package com.opencalisthenics.data.repository

import com.opencalisthenics.BuildConfig
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.data.model.AICompletionRequest
import com.opencalisthenics.data.model.AICompletionResponse
import com.opencalisthenics.data.model.AIGeneratedWorkoutDto
import com.opencalisthenics.data.model.AIRequestMessage
import com.opencalisthenics.data.model.WorkoutCompletionSelectDto
import com.opencalisthenics.data.model.WorkoutDto
import com.opencalisthenics.data.model.WorkoutExerciseDto
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.GeneratedExercise
import com.opencalisthenics.domain.model.GeneratedWorkout
import com.opencalisthenics.domain.model.RecentExercise
import com.opencalisthenics.domain.model.RecentWorkoutData
import com.opencalisthenics.domain.repository.AIWorkoutRepository
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.request.header
import io.ktor.client.request.post
import io.ktor.client.request.setBody
import io.ktor.client.statement.bodyAsText
import io.ktor.http.ContentType
import io.ktor.http.HttpHeaders
import io.ktor.http.contentType
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

class AIWorkoutRepositoryImpl : AIWorkoutRepository {

    private val supabase = SupabaseClient.client
    private val httpClient = HttpClient(Android)
    private val apiKey = BuildConfig.OPENAI_API_KEY
    private val baseUrl = BuildConfig.OPENAI_BASE_URL.ifBlank { "https://api.openai.com/v1" }
    private val model = BuildConfig.OPENAI_MODEL.ifBlank { "gpt-4o-mini" }
    private val json = Json { ignoreUnknownKeys = true }

    private val workoutTypeMuscles = mapOf(
        "push" to listOf("chest", "shoulders", "triceps"),
        "pull" to listOf("back", "biceps", "forearms"),
        "legs" to listOf("legs", "glutes", "calves", "hamstrings", "quadriceps"),
        "full_body" to listOf("chest", "back", "shoulders", "legs", "core")
    )

    override suspend fun getRecentWorkout(): Result<RecentWorkoutData?> {
        return try {
            val userId = supabase.auth.currentUserOrNull()?.id
                ?: return Result.success(null)

            val completions = supabase.from("workout_completions")
                .select(Columns.raw("workout_id, workout_name, completed_at")) {
                    filter { eq("user_id", userId) }
                    order("completed_at", Order.DESCENDING)
                    limit(1)
                }.decodeList<WorkoutCompletionSelectDto>()

            if (completions.isEmpty()) return Result.success(null)

            val recent = completions[0]

            val workout = supabase.from("Workout").select {
                filter { WorkoutDto::id eq recent.workout_id }
            }.decodeSingleOrNull<WorkoutDto>() ?: return Result.success(null)

            val exercises = supabase.from("WorkoutExercise").select {
                filter { WorkoutExerciseDto::workout_id eq recent.workout_id }
                order("order", Order.ASCENDING)
            }.decodeList<WorkoutExerciseDto>()

            Result.success(
                RecentWorkoutData(
                    name = recent.workout_name,
                    difficulty = workout.difficulty ?: "",
                    exercises = exercises.map { ex ->
                        RecentExercise(
                            name = ex.exercise_name ?: "",
                            sets = ex.sets ?: 3,
                            reps = ex.reps,
                            rest = ex.rest
                        )
                    }
                )
            )
        } catch (_: Exception) {
            Result.success(null)
        }
    }

    override suspend fun generate(
        exercises: List<Exercise>,
        recentWorkout: RecentWorkoutData?,
        workoutType: String,
        difficultyAdjustment: String,
        locale: String
    ): Result<GeneratedWorkout> {
        if (apiKey.isBlank()) {
            return Result.failure(Exception("AI not configured"))
        }

        return try {
            val targetMuscles = workoutTypeMuscles[workoutType] ?: workoutTypeMuscles["full_body"]!!
            val pool = exercises.filter { ex ->
                ex.category == workoutType || ex.muscleGroups.any { it in targetMuscles }
            }.takeIf { it.size >= 4 } ?: exercises

            val exerciseList = pool.joinToString("\n") { ex ->
                "- ID: ${ex.id}, Name: \"${ex.name}\", Muscles: [${ex.muscleGroups.joinToString()}], Difficulty: ${ex.difficulty}/5"
            }

            val historyContext = if (recentWorkout != null) {
                val exList = recentWorkout.exercises.joinToString("\n") { ex ->
                    "  - ${ex.name}: ${ex.sets}x${ex.reps} reps, ${ex.rest}s rest"
                }
                """
                |
                |User's most recent workout ("${recentWorkout.name}", difficulty: ${recentWorkout.difficulty}):
                |$exList
                |Difficulty adjustment: $difficultyAdjustment
                |- If "easier": reduce sets/reps by ~20%, increase rest by ~20%
                |- If "harder": increase sets/reps by ~20%, reduce rest by ~20%
                |- If "same": use similar volume""".trimMargin()
            } else ""

            val languageInstruction = if (locale == "es")
                "Respond with the workout name and description in Spanish."
            else
                "Respond with the workout name and description in English."

            val systemPrompt = """You are a calisthenics workout generator. Generate a ${workoutType.replace("_", " ")} workout using ONLY exercises from the provided list. $languageInstruction

Rules:
- Select 4-6 exercises from the list
- Use only the exact exercise IDs and names from the list
- Focus on muscles: ${targetMuscles.joinToString()}
- Sets: 2-5, Reps: 5-20, Rest: 30-120 seconds
- Choose difficulty (Beginner/Intermediate/Advanced/Expert) based on the exercises selected$historyContext

Respond ONLY with valid JSON, no markdown, no explanation:
{"name":"workout name","description":"1-2 sentence description","difficulty":"Beginner|Intermediate|Advanced|Expert","exercises":[{"exercise_id":<number>,"name":"<exact name from list>","sets":<number>,"reps":<number>,"rest":<number>}]}"""

            val request = AICompletionRequest(
                model = model,
                messages = listOf(
                    AIRequestMessage("system", systemPrompt),
                    AIRequestMessage("user", "Available exercises for ${workoutType.replace("_", " ")} workout:\n$exerciseList")
                )
            )

            val response = httpClient.post("$baseUrl/chat/completions") {
                header(HttpHeaders.Authorization, "Bearer $apiKey")
                contentType(ContentType.Application.Json)
                setBody(json.encodeToString(request))
            }

            val responseText = response.bodyAsText()
            val completionResponse = json.decodeFromString<AICompletionResponse>(responseText)
            val content = completionResponse.choices.firstOrNull()?.message?.content?.trim()
                ?: return Result.failure(Exception("Empty AI response"))

            val jsonStr = content
                .removePrefix("```json").removePrefix("```")
                .removeSuffix("```").trim()

            val dto = json.decodeFromString<AIGeneratedWorkoutDto>(jsonStr)

            Result.success(
                GeneratedWorkout(
                    name = dto.name,
                    description = dto.description,
                    difficulty = dto.difficulty,
                    exercises = dto.exercises.map { ex ->
                        GeneratedExercise(
                            exerciseId = ex.exercise_id,
                            name = ex.name,
                            sets = ex.sets,
                            reps = ex.reps,
                            rest = ex.rest
                        )
                    }
                )
            )
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
