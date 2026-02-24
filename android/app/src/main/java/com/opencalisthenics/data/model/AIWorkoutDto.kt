package com.opencalisthenics.data.model

import kotlinx.serialization.Serializable

@Serializable
data class AIRequestMessage(
    val role: String,
    val content: String
)

@Serializable
data class AICompletionRequest(
    val model: String,
    val messages: List<AIRequestMessage>,
    val temperature: Double = 0.7,
    val max_tokens: Int = 1000
)

@Serializable
data class AICompletionChoice(
    val message: AIRequestMessage
)

@Serializable
data class AICompletionResponse(
    val choices: List<AICompletionChoice>
)

@Serializable
data class AIGeneratedExerciseDto(
    val exercise_id: Int,
    val name: String,
    val sets: Int,
    val reps: Int,
    val rest: Int
)

@Serializable
data class AIGeneratedWorkoutDto(
    val name: String,
    val description: String,
    val difficulty: String,
    val exercises: List<AIGeneratedExerciseDto>
)

@Serializable
data class WorkoutCompletionSelectDto(
    val workout_id: Int,
    val workout_name: String,
    val completed_at: String? = null
)
