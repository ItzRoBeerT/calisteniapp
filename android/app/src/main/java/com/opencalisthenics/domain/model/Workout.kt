package com.opencalisthenics.domain.model

data class Workout(
    val id: Int = 0,
    val name: String,
    val description: String = "",
    val difficulty: String = "",
    val duration: Int = 0,
    val muscleGroups: List<String> = emptyList(),
    val userId: String? = null,
    val username: String? = null,
    val isPublic: Boolean = true,
    val exercises: List<ExerciseWorkout> = emptyList(),
    val tags: List<String> = emptyList(),
    val likesCount: Int = 0,
    val createdAt: String = "",
    val favoritedAt: String? = null
)

data class ExerciseWorkout(
    val id: Int = 0,
    val exerciseId: Int? = null,
    val name: String,
    val sets: Int = 3,
    val reps: Int = 10,
    val rest: Int = 60,
    val muscleGroups: List<String> = emptyList(),
    val image: String = ""
)

data class WorkoutFilters(
    val difficulty: String? = null,
    val muscleGroup: String? = null,
    val duration: Int? = null,
    val tag: String? = null
)

data class WorkoutCompletion(
    val workoutId: Int,
    val workoutName: String,
    val durationSeconds: Int,
    val exercisesCount: Int
)
