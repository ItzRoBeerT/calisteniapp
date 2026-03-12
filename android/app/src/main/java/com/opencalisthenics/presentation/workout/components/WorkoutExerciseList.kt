package com.opencalisthenics.presentation.workout.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.opencalisthenics.R
import com.opencalisthenics.domain.model.ExerciseWorkout
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Primary500
import com.opencalisthenics.ui.theme.Secondary500

@Composable
fun WorkoutExerciseList(
    exercises: List<ExerciseWorkout>,
    modifier: Modifier = Modifier,
    onExerciseClick: (Int) -> Unit = {}
) {
    // Build superset labels (A, B, C…) by group, in order of first appearance
    val supersetLabels = mutableMapOf<String, String>()
    var labelCounter = 0
    exercises.forEach { ex ->
        val g = ex.supersetGroup
        if (g != null && g !in supersetLabels) {
            supersetLabels[g] = ('A' + labelCounter++).toString()
        }
    }

    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        exercises.forEach { exercise ->
            val supersetLabel = exercise.supersetGroup?.let { supersetLabels[it] }
            WorkoutExerciseItem(
                exercise = exercise,
                supersetLabel = supersetLabel,
                onExerciseClick = onExerciseClick
            )
        }
    }
}

@Composable
private fun WorkoutExerciseItem(
    exercise: ExerciseWorkout,
    supersetLabel: String?,
    modifier: Modifier = Modifier,
    onExerciseClick: (Int) -> Unit = {}
) {
    val accentColor = if (supersetLabel != null) Secondary500 else Primary500
    val clickableModifier = if (exercise.exerciseId != null) {
        modifier.clickable { onExerciseClick(exercise.exerciseId) }
    } else {
        modifier
    }
    Row(
        modifier = clickableModifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(start = 3.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left accent border
        Box(
            modifier = Modifier
                .width(3.dp)
                .height(56.dp)
                .background(accentColor, RoundedCornerShape(2.dp))
        )

        // Exercise image
        if (exercise.image.isNotBlank()) {
            AsyncImage(
                model = exercise.image,
                contentDescription = exercise.name,
                modifier = Modifier
                    .size(48.dp)
                    .padding(start = 8.dp)
                    .clip(RoundedCornerShape(6.dp)),
                contentScale = ContentScale.Crop
            )
        }

        // Exercise info
        Column(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            if (supersetLabel != null) {
                Text(
                    text = stringResource(R.string.workout_superset_label, supersetLabel),
                    color = Secondary500,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.SemiBold,
                    modifier = Modifier
                        .clip(RoundedCornerShape(8.dp))
                        .background(Secondary500.copy(alpha = 0.12f))
                        .padding(horizontal = 6.dp, vertical = 1.dp)
                )
                Spacer(modifier = Modifier.height(2.dp))
            }
            Text(
                text = exercise.name,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp
            )
            Spacer(modifier = Modifier.height(2.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ExerciseStat(
                    label = stringResource(R.string.workout_sets),
                    value = exercise.sets.toString()
                )
                // RIR or reps — mutually exclusive
                if (exercise.rir != null) {
                    ExerciseStat(
                        label = stringResource(R.string.workout_rir),
                        value = if (exercise.rir == 0) stringResource(R.string.workout_rir_to_failure)
                                else exercise.rir.toString()
                    )
                } else {
                    ExerciseStat(
                        label = stringResource(R.string.workout_reps),
                        value = exercise.reps.toString()
                    )
                }
                ExerciseStat(
                    label = stringResource(R.string.workout_rest),
                    value = stringResource(R.string.workout_rest_seconds, exercise.rest)
                )
            }
        }
    }
}

@Composable
private fun ExerciseStat(label: String, value: String) {
    Row {
        Text(
            text = "$label: ",
            color = GrayText,
            fontSize = 11.sp
        )
        Text(
            text = value,
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 11.sp,
            fontWeight = FontWeight.Medium
        )
    }
}
