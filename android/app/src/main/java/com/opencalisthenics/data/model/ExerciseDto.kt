package com.opencalisthenics.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ExerciseDto(
    val id: Int,
    val name: String = "",
    val description: String = "",
    val image: String,
    val difficulty: Int,
    val muscle_group: List<String>,
    val category: String = "",
    val type: String = "",
    val equipment: List<String> = emptyList(),
    val resources: List<ExerciseResourceDto> = emptyList()
)

@Serializable
data class ExerciseResourceDto(
    val type: String = "",
    val url: String = "",
    val title: String = ""
)
