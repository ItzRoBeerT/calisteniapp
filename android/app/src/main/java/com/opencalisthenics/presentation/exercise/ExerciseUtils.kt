package com.opencalisthenics.presentation.exercise

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.opencalisthenics.ui.theme.ErrorRed

@Composable
fun difficultyColor(difficulty: Int): Color = when (difficulty) {
    in 0..1 -> MaterialTheme.colorScheme.secondary
    in 2..3 -> MaterialTheme.colorScheme.tertiary
    else -> ErrorRed
}

fun difficultyLabel(difficulty: Int): String = when (difficulty) {
    0 -> "Muy fácil"
    1 -> "Fácil"
    2 -> "Intermedio"
    3 -> "Intermedio-Alto"
    4 -> "Difícil"
    5 -> "Muy difícil"
    else -> ""
}
