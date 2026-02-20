package com.opencalisthenics.domain.model

data class ExerciseProgression(
    val exerciseId: Int,
    val prerequisites: List<Int>,
    val variations: List<Int>,
    val progressions: List<Int>
)
