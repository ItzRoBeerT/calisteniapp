package com.opencalisthenics.domain.model

data class Exercise(
    val id: Int,
    val image: String,
    val difficulty: Int,
    val muscleGroups: List<String>,
    val category: String,
    val type: String,
    val equipment: List<String>,
    val name: String,
    val description: String
)

enum class DifficultyLevel(val range: IntRange) {
    BEGINNER(0..1),
    INTERMEDIATE(2..3),
    ADVANCED(4..5);
}
