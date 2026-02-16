package com.opencalisthenics.domain.model

object MuscleGroupLabels {
    private val labels = mapOf(
        "chest" to "Pecho",
        "back" to "Espalda",
        "shoulders" to "Hombros",
        "triceps" to "Tríceps",
        "biceps" to "Bíceps",
        "core" to "Core",
        "legs" to "Piernas",
        "glutes" to "Glúteos"
    )

    fun getLabel(key: String): String = labels[key] ?: key

    fun getAll(): Map<String, String> = labels
}
