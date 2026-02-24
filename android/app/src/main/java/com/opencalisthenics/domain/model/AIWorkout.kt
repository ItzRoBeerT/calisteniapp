package com.opencalisthenics.domain.model

data class RecentWorkoutData(
    val name: String,
    val difficulty: String = "",
    val exercises: List<RecentExercise>
)

data class RecentExercise(
    val name: String,
    val sets: Int,
    val reps: Int,
    val rest: Int
)

data class GeneratedWorkout(
    val name: String,
    val description: String,
    val difficulty: String,
    val exercises: List<GeneratedExercise>
)

data class GeneratedExercise(
    val exerciseId: Int,
    val name: String,
    val sets: Int,
    val reps: Int,
    val rest: Int
)
