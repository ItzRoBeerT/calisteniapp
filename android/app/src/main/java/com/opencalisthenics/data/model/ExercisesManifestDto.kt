package com.opencalisthenics.data.model

import kotlinx.serialization.Serializable

@Serializable
data class ExercisesManifestDto(
    val version: Int,
    val exercises: List<ExerciseDto>
)

@Serializable
data class ExercisesVersionDto(
    val version: Int
)
