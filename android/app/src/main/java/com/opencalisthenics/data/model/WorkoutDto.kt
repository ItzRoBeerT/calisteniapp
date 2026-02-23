package com.opencalisthenics.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WorkoutDto(
    val id: Int = 0,
    val name: String,
    val description: String? = null,
    val difficulty: String? = null,
    val duration: Int? = null,
    val muscle_groups: List<String>? = null,
    val user_id: String? = null,
    val is_public: Boolean = true,
    val created_at: String? = null
)

@Serializable
data class WorkoutExerciseDto(
    val id: Int = 0,
    val workout_id: Int,
    val exercise_id: Int? = null,
    val exercise_name: String? = null,
    val sets: Int = 3,
    val reps: Int = 10,
    val rest: Int = 60,
    val order: Int = 0
)

@Serializable
data class WorkoutExerciseWithImageDto(
    val id: Int = 0,
    val workout_id: Int,
    val exercise_id: Int? = null,
    val exercise_name: String? = null,
    val sets: Int = 3,
    val reps: Int = 10,
    val rest: Int = 60,
    val order: Int? = null,
    @SerialName("Exercise")
    val exercise: ExerciseImageDto? = null
)

@Serializable
data class ExerciseImageDto(
    val image: String? = null
)

@Serializable
data class WorkoutTagDto(
    val id: Int = 0,
    val workout_id: Int,
    val name: String
)

@Serializable
data class WorkoutFavoriteDto(
    val id: Int = 0,
    val user_id: String,
    val workout_id: Int
)

@Serializable
data class WorkoutFavoriteWithDateDto(
    val workout_id: Int,
    val created_at: String? = null
)

@Serializable
data class WorkoutCompletionDto(
    val id: Int = 0,
    val user_id: String,
    val workout_id: Int,
    val workout_name: String,
    val duration_seconds: Int? = null,
    val exercises_count: Int? = null
)

@Serializable
data class ProfileUsernameDto(
    val username: String? = null
)
