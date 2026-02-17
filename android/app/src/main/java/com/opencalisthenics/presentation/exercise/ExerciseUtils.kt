package com.opencalisthenics.presentation.exercise

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import com.opencalisthenics.R
import com.opencalisthenics.domain.model.DifficultyLevel
import com.opencalisthenics.ui.theme.ErrorRed

@Composable
fun difficultyColor(difficulty: Int): Color = when (difficulty) {
    in 0..1 -> MaterialTheme.colorScheme.secondary
    in 2..3 -> MaterialTheme.colorScheme.tertiary
    else -> ErrorRed
}

@Composable
fun difficultyLabel(difficulty: Int): String = stringResource(
    when (difficulty) {
        0 -> R.string.difficulty_very_easy
        1 -> R.string.difficulty_easy
        2 -> R.string.difficulty_medium
        3 -> R.string.difficulty_medium_high
        4 -> R.string.difficulty_hard
        5 -> R.string.difficulty_very_hard
        else -> R.string.difficulty_very_hard
    }
)

@Composable
fun DifficultyLevel.label(): String = stringResource(
    when (this) {
        DifficultyLevel.BEGINNER -> R.string.difficulty_beginner
        DifficultyLevel.INTERMEDIATE -> R.string.difficulty_intermediate
        DifficultyLevel.ADVANCED -> R.string.difficulty_advanced
    }
)

@Composable
fun muscleGroupLabel(key: String): String {
    val resId = when (key) {
        "chest" -> R.string.muscle_group_chest
        "back" -> R.string.muscle_group_back
        "shoulders" -> R.string.muscle_group_shoulders
        "triceps" -> R.string.muscle_group_triceps
        "biceps" -> R.string.muscle_group_biceps
        "core" -> R.string.muscle_group_core
        "legs" -> R.string.muscle_group_legs
        "glutes" -> R.string.muscle_group_glutes
        else -> return key
    }
    return stringResource(resId)
}
