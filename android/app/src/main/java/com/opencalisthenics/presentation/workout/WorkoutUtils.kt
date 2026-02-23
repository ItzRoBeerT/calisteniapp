package com.opencalisthenics.presentation.workout

import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import com.opencalisthenics.R
import com.opencalisthenics.ui.theme.ErrorRed

@Composable
fun workoutDifficultyColor(difficulty: String): Color = when (difficulty.lowercase()) {
    "beginner", "principiante" -> MaterialTheme.colorScheme.secondary
    "intermediate", "intermedio" -> MaterialTheme.colorScheme.tertiary
    "advanced", "avanzado" -> ErrorRed
    "expert", "experto" -> ErrorRed
    else -> MaterialTheme.colorScheme.tertiary
}

@Composable
fun workoutDifficultyLabel(difficulty: String): String = when (difficulty.lowercase()) {
    "beginner" -> stringResource(R.string.difficulty_beginner)
    "intermediate" -> stringResource(R.string.difficulty_intermediate)
    "advanced" -> stringResource(R.string.difficulty_advanced)
    else -> difficulty
}

fun formatDuration(totalSeconds: Int): String {
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return "%02d:%02d".format(minutes, seconds)
}
