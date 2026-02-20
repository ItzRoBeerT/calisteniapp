package com.opencalisthenics.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ExerciseProgressionDto(
    val exercise_id: Int,
    val prerequisites: List<Int> = emptyList(),
    val variations: List<Int> = emptyList(),
    val progressions: List<Int> = emptyList()
)
