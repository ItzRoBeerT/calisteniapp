package com.opencalisthenics.data.repository

import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.data.model.ExerciseImageDto
import com.opencalisthenics.data.model.ProfileUsernameDto
import com.opencalisthenics.data.model.WorkoutCompletionDto
import com.opencalisthenics.data.model.WorkoutDto
import com.opencalisthenics.data.model.WorkoutExerciseDto
import com.opencalisthenics.data.model.WorkoutExerciseWithImageDto
import com.opencalisthenics.data.model.WorkoutFavoriteDto
import com.opencalisthenics.data.model.WorkoutFavoriteWithDateDto
import com.opencalisthenics.data.model.WorkoutTagDto
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.ExerciseWorkout
import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.model.WorkoutCompletion
import com.opencalisthenics.domain.model.WorkoutFilters
import com.opencalisthenics.domain.repository.WorkoutRepository
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.postgrest.from
import io.github.jan.supabase.postgrest.query.Columns
import io.github.jan.supabase.postgrest.query.Order
import io.ktor.client.plugins.HttpRequestTimeoutException
import java.net.UnknownHostException

class WorkoutRepositoryImpl : WorkoutRepository {

    private val client = SupabaseClient.client

    override suspend fun getWorkouts(
        page: Int,
        limit: Int,
        filters: WorkoutFilters?
    ): Result<List<Workout>> = try {
        val startIndex = (page - 1) * limit
        val endIndex = startIndex + limit - 1

        val workouts = client.from("Workout").select {
            range(startIndex.toLong(), endIndex.toLong())
            filters?.difficulty?.let { filter { WorkoutDto::difficulty eq it } }
            filters?.muscleGroup?.let { filter { WorkoutDto::muscle_groups contains listOf(it) } }
        }.decodeList<WorkoutDto>()

        val workoutsWithDetails = workouts.map { workout ->
            val exercises = client.from("WorkoutExercise").select(
                Columns.raw("*, Exercise(image)")
            ) {
                filter { WorkoutExerciseWithImageDto::workout_id eq workout.id }
                order("order", Order.ASCENDING)
            }.decodeList<WorkoutExerciseWithImageDto>()

            val tags = client.from("WorkoutTags").select {
                filter { WorkoutTagDto::workout_id eq workout.id }
            }.decodeList<WorkoutTagDto>()

            val likesCount = getLikesCountForWorkout(workout.id)

            workout.toDomain(
                exercises = exercises.map { it.toDomain() },
                tags = tags.map { it.name },
                likesCount = likesCount
            )
        }

        Result.success(workoutsWithDetails)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun getWorkoutById(id: Int): Result<Workout> = try {
        val workout = client.from("Workout").select {
            filter { WorkoutDto::id eq id }
        }.decodeSingle<WorkoutDto>()

        var username: String? = null
        if (workout.user_id != null) {
            val profile = try {
                client.from("Profile").select {
                    filter { ProfileUsernameDto::username eq workout.user_id }
                    filter { eq("user_id", workout.user_id!!) }
                }.decodeSingleOrNull<ProfileUsernameDto>()
            } catch (_: Exception) { null }
            username = profile?.username
        }

        val exercises = client.from("WorkoutExercise").select(
            Columns.raw("*, Exercise(image)")
        ) {
            filter { WorkoutExerciseWithImageDto::workout_id eq id }
            order("order", Order.ASCENDING)
        }.decodeList<WorkoutExerciseWithImageDto>()

        val tags = client.from("WorkoutTags").select {
            filter { WorkoutTagDto::workout_id eq id }
        }.decodeList<WorkoutTagDto>()

        Result.success(
            workout.toDomain(
                exercises = exercises.map { it.toDomain() },
                tags = tags.map { it.name },
                username = username
            )
        )
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun createWorkout(workout: Workout): Result<Workout> = try {
        val userId = client.auth.currentUserOrNull()?.id
            ?: return Result.failure(AppError.Unknown("User not authenticated"))

        val duration = calculateDuration(workout.exercises)
        val muscleGroups = workout.exercises.flatMap { it.muscleGroups }.distinct()

        val created = client.from("Workout").insert(
            WorkoutDto(
                name = workout.name,
                description = workout.description,
                difficulty = workout.difficulty,
                duration = duration,
                muscle_groups = muscleGroups,
                user_id = userId,
                is_public = workout.isPublic
            )
        ) { select() }.decodeSingle<WorkoutDto>()

        if (workout.exercises.isNotEmpty()) {
            val exerciseDtos = workout.exercises.mapIndexed { index, ex ->
                WorkoutExerciseDto(
                    workout_id = created.id,
                    exercise_id = ex.exerciseId,
                    exercise_name = ex.name,
                    sets = ex.sets,
                    reps = ex.reps,
                    rest = ex.rest,
                    order = index
                )
            }
            client.from("WorkoutExercise").insert(exerciseDtos)
        }

        if (workout.tags.isNotEmpty()) {
            val tagDtos = workout.tags.map { tag ->
                WorkoutTagDto(workout_id = created.id, name = tag)
            }
            client.from("WorkoutTags").insert(tagDtos)
        }

        Result.success(created.toDomain(exercises = workout.exercises, tags = workout.tags))
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun updateWorkout(id: Int, workout: Workout): Result<Unit> = try {
        val duration = calculateDuration(workout.exercises)
        val muscleGroups = workout.exercises.flatMap { it.muscleGroups }.distinct()

        client.from("Workout").update(
            WorkoutDto(
                id = id,
                name = workout.name,
                description = workout.description,
                difficulty = workout.difficulty,
                duration = duration,
                muscle_groups = muscleGroups,
                is_public = workout.isPublic
            )
        ) { filter { WorkoutDto::id eq id } }

        // Replace exercises
        client.from("WorkoutExercise").delete {
            filter { WorkoutExerciseDto::workout_id eq id }
        }
        if (workout.exercises.isNotEmpty()) {
            val exerciseDtos = workout.exercises.mapIndexed { index, ex ->
                WorkoutExerciseDto(
                    workout_id = id,
                    exercise_id = ex.exerciseId,
                    exercise_name = ex.name,
                    sets = ex.sets,
                    reps = ex.reps,
                    rest = ex.rest,
                    order = index
                )
            }
            client.from("WorkoutExercise").insert(exerciseDtos)
        }

        // Replace tags
        client.from("WorkoutTags").delete {
            filter { WorkoutTagDto::workout_id eq id }
        }
        if (workout.tags.isNotEmpty()) {
            val tagDtos = workout.tags.map { tag ->
                WorkoutTagDto(workout_id = id, name = tag)
            }
            client.from("WorkoutTags").insert(tagDtos)
        }

        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun deleteWorkout(id: Int): Result<Unit> = try {
        client.from("WorkoutExercise").delete {
            filter { WorkoutExerciseDto::workout_id eq id }
        }
        client.from("WorkoutTags").delete {
            filter { WorkoutTagDto::workout_id eq id }
        }
        client.from("Workout").delete {
            filter { WorkoutDto::id eq id }
        }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun toggleFavorite(workoutId: Int): Result<Boolean> = try {
        val userId = client.auth.currentUserOrNull()?.id
            ?: return Result.failure(AppError.Unknown("User not authenticated"))

        val existing = try {
            client.from("workout_favorites").select {
                filter {
                    eq("user_id", userId)
                    WorkoutFavoriteDto::workout_id eq workoutId
                }
            }.decodeList<WorkoutFavoriteDto>()
        } catch (_: Exception) { emptyList() }

        if (existing.isNotEmpty()) {
            client.from("workout_favorites").delete {
                filter {
                    eq("user_id", userId)
                    WorkoutFavoriteDto::workout_id eq workoutId
                }
            }
            Result.success(false)
        } else {
            client.from("workout_favorites").insert(
                WorkoutFavoriteDto(user_id = userId, workout_id = workoutId)
            )
            Result.success(true)
        }
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun getFavoriteIds(): Result<List<Int>> = try {
        val userId = client.auth.currentUserOrNull()?.id
            ?: return Result.success(emptyList())

        val favorites = client.from("workout_favorites").select {
            filter { eq("user_id", userId) }
        }.decodeList<WorkoutFavoriteDto>()

        Result.success(favorites.map { it.workout_id })
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun saveCompletion(completion: WorkoutCompletion): Result<Unit> = try {
        val userId = client.auth.currentUserOrNull()?.id
            ?: return Result.failure(AppError.Unknown("User not authenticated"))

        client.from("workout_completions").insert(
            WorkoutCompletionDto(
                user_id = userId,
                workout_id = completion.workoutId,
                workout_name = completion.workoutName,
                duration_seconds = completion.durationSeconds,
                exercises_count = completion.exercisesCount
            )
        )
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun getUserWorkouts(): Result<List<Workout>> {
        return try {
            val userId = client.auth.currentUserOrNull()?.id
                ?: return Result.success(emptyList())

            val workouts = client.from("Workout").select {
                filter { WorkoutDto::user_id eq userId }
                order("created_at", Order.DESCENDING)
            }.decodeList<WorkoutDto>()

            val workoutsWithDetails = workouts.map { workout ->
                val exercises = client.from("WorkoutExercise").select(
                    Columns.raw("*, Exercise(image)")
                ) {
                    filter { WorkoutExerciseWithImageDto::workout_id eq workout.id }
                    order("order", Order.ASCENDING)
                }.decodeList<WorkoutExerciseWithImageDto>()

                val tags = client.from("WorkoutTags").select {
                    filter { WorkoutTagDto::workout_id eq workout.id }
                }.decodeList<WorkoutTagDto>()

                val likesCount = getLikesCountForWorkout(workout.id)

                workout.toDomain(
                    exercises = exercises.map { it.toDomain() },
                    tags = tags.map { it.name },
                    likesCount = likesCount
                )
            }

            Result.success(workoutsWithDetails)
        } catch (e: Exception) {
            Result.failure(e.toAppError())
        }
    }

    override suspend fun getFavoriteWorkoutsWithDetails(): Result<List<Workout>> {
        return try {
            val userId = client.auth.currentUserOrNull()?.id
                ?: return Result.success(emptyList())

            val favorites = client.from("workout_favorites").select(Columns.raw("workout_id, created_at")) {
                filter { eq("user_id", userId) }
                order("created_at", Order.DESCENDING)
            }.decodeList<WorkoutFavoriteWithDateDto>()

            if (favorites.isEmpty()) return Result.success(emptyList())

            val workoutsWithDetails = favorites.mapNotNull { fav ->
                try {
                    val workout = client.from("Workout").select {
                        filter { WorkoutDto::id eq fav.workout_id }
                    }.decodeSingle<WorkoutDto>()

                    val exercises = client.from("WorkoutExercise").select(
                        Columns.raw("*, Exercise(image)")
                    ) {
                        filter { WorkoutExerciseWithImageDto::workout_id eq fav.workout_id }
                        order("order", Order.ASCENDING)
                    }.decodeList<WorkoutExerciseWithImageDto>()

                    val tags = client.from("WorkoutTags").select {
                        filter { WorkoutTagDto::workout_id eq fav.workout_id }
                    }.decodeList<WorkoutTagDto>()

                    val likesCount = getLikesCountForWorkout(fav.workout_id)

                    workout.toDomain(
                        exercises = exercises.map { it.toDomain() },
                        tags = tags.map { it.name },
                        likesCount = likesCount,
                        favoritedAt = fav.created_at
                    )
                } catch (_: Exception) { null }
            }

            Result.success(workoutsWithDetails)
        } catch (e: Exception) {
            Result.failure(e.toAppError())
        }
    }

    private fun calculateDuration(exercises: List<ExerciseWorkout>): Int {
        val totalSeconds = exercises.sumOf { ex ->
            (4 * ex.reps * ex.sets) + (ex.rest * ex.sets)
        }
        return Math.ceil(totalSeconds / 60.0).toInt()
    }

    private suspend fun getLikesCountForWorkout(workoutId: Int): Int = try {
        client.from("workout_favorites").select {
            filter { WorkoutFavoriteDto::workout_id eq workoutId }
        }.decodeList<WorkoutFavoriteDto>().size
    } catch (_: Exception) { 0 }

    private fun WorkoutDto.toDomain(
        exercises: List<ExerciseWorkout> = emptyList(),
        tags: List<String> = emptyList(),
        username: String? = null,
        likesCount: Int = 0,
        favoritedAt: String? = null
    ) = Workout(
        id = id,
        name = name,
        description = description ?: "",
        difficulty = difficulty ?: "",
        duration = duration ?: 0,
        muscleGroups = muscle_groups ?: emptyList(),
        userId = user_id,
        username = username,
        isPublic = is_public,
        exercises = exercises,
        tags = tags,
        likesCount = likesCount,
        createdAt = created_at ?: "",
        favoritedAt = favoritedAt
    )

    private fun WorkoutExerciseWithImageDto.toDomain() = ExerciseWorkout(
        id = id,
        exerciseId = exercise_id,
        name = exercise_name ?: "",
        sets = sets,
        reps = reps,
        rest = rest,
        image = exercise?.image ?: ""
    )

    private fun Exception.toAppError(): AppError = when (this) {
        is UnknownHostException -> AppError.NetworkError
        is HttpRequestTimeoutException -> AppError.NetworkError
        else -> AppError.Unknown(message)
    }
}
