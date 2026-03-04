package com.opencalisthenics.data.repository

import android.content.Context
import com.opencalisthenics.BuildConfig
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.data.model.ExerciseProgressionDto
import com.opencalisthenics.data.model.ExercisesManifestDto
import com.opencalisthenics.data.model.ExercisesVersionDto
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.ExerciseProgression
import com.opencalisthenics.domain.repository.ExerciseRepository
import io.github.jan.supabase.postgrest.from
import io.ktor.client.HttpClient
import io.ktor.client.engine.android.Android
import io.ktor.client.request.get
import io.ktor.client.statement.bodyAsText
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import java.io.File

class ExerciseRepositoryImpl(
    private val context: Context
) : ExerciseRepository {

    private val supabaseClient = SupabaseClient.client
    private val json = Json { ignoreUnknownKeys = true }
    private val httpClient = HttpClient(Android)

    private val prefs by lazy {
        context.getSharedPreferences("exercises_prefs", Context.MODE_PRIVATE)
    }
    private val cacheFile by lazy {
        File(context.filesDir, "exercises_cache.json")
    }

    private fun loadFromAssets(): ExercisesManifestDto {
        val text = context.assets.open("exercises.json").bufferedReader().use { it.readText() }
        return json.decodeFromString(text)
    }

    private fun loadFromCache(): ExercisesManifestDto? {
        if (!cacheFile.exists()) return null
        return try {
            json.decodeFromString(cacheFile.readText())
        } catch (_: Exception) {
            null
        }
    }

    private fun loadBest(): ExercisesManifestDto {
        val cached = loadFromCache()
        val bundled = loadFromAssets()
        return if (cached != null && cached.version >= bundled.version) cached else bundled
    }

    override suspend fun getExercises(): Result<List<Exercise>> = try {
        val manifest = loadBest()
        CoroutineScope(Dispatchers.IO).launch { checkForUpdates(manifest.version) }
        Result.success(manifest.exercises.map { dto ->
            Exercise(
                id = dto.id,
                image = dto.image,
                difficulty = dto.difficulty,
                muscleGroups = dto.muscle_group,
                category = dto.category,
                type = dto.type,
                equipment = dto.equipment,
                name = dto.name.ifBlank { "Ejercicio ${dto.id}" },
                description = dto.description
            )
        })
    } catch (e: Exception) {
        Result.failure(AppError.Unknown(e.message))
    }

    override suspend fun getExerciseById(id: Int): Result<Exercise> = try {
        val exercises = getExercises().getOrThrow()
        val exercise = exercises.firstOrNull { it.id == id }
            ?: return Result.failure(AppError.NotFound)
        Result.success(exercise)
    } catch (e: AppError) {
        Result.failure(e)
    } catch (e: Exception) {
        Result.failure(AppError.Unknown(e.message))
    }

    override suspend fun getProgressionForExercise(id: Int): Result<ExerciseProgression?> = try {
        val rows = supabaseClient.from("exercise_progressions").select {
            filter { eq("exercise_id", id) }
        }.decodeList<ExerciseProgressionDto>()
        val dto = rows.firstOrNull()
        Result.success(dto?.let {
            ExerciseProgression(
                exerciseId = it.exercise_id,
                prerequisites = it.prerequisites,
                variations = it.variations,
                progressions = it.progressions
            )
        })
    } catch (e: Exception) {
        Result.success(null)
    }

    private suspend fun checkForUpdates(currentVersion: Int) {
        val baseUrl = BuildConfig.EXERCISES_API_URL.ifBlank { return }
        try {
            val versionText = httpClient.get("$baseUrl/api/exercises/version").bodyAsText()
            val remote = json.decodeFromString<ExercisesVersionDto>(versionText)
            if (remote.version > currentVersion) {
                val fullText = httpClient.get("$baseUrl/api/exercises").bodyAsText()
                val manifest = json.decodeFromString<ExercisesManifestDto>(fullText)
                cacheFile.writeText(fullText)
                prefs.edit().putInt("exercises_version", manifest.version).apply()
            }
        } catch (_: Exception) {
            // Silent: no network or server unavailable — use cached/bundled data
        }
    }
}
