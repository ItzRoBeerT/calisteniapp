package com.opencalisthenics.presentation.workout.runner.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil3.compose.AsyncImage
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.presentation.workout.formatDuration
import com.opencalisthenics.presentation.workout.runner.WorkoutRunnerUiState
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Secondary500

@Composable
fun ExercisePhaseContent(
    state: WorkoutRunnerUiState,
    onSetDone: () -> Unit
) {
    val exercise = state.currentExercise ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(8.dp))

        LinearProgressIndicator(
            progress = { state.progressPercent },
            modifier = Modifier
                .fillMaxWidth()
                .height(6.dp)
                .clip(RoundedCornerShape(3.dp)),
            color = MaterialTheme.colorScheme.primary,
            trackColor = MaterialTheme.colorScheme.surface,
        )

        Spacer(modifier = Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = stringResource(
                    R.string.workout_runner_elapsed,
                    formatDuration(state.elapsedSeconds)
                ),
                color = GrayText,
                fontSize = 13.sp
            )
            Text(
                text = stringResource(
                    R.string.workout_runner_exercise,
                    state.currentExerciseIndex + 1,
                    state.totalExercises
                ),
                color = GrayText,
                fontSize = 13.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Superset badge
        if (state.isInSuperset) {
            Text(
                text = stringResource(R.string.workout_superset),
                color = Secondary500,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier
                    .clip(RoundedCornerShape(12.dp))
                    .background(Secondary500.copy(alpha = 0.15f))
                    .padding(horizontal = 10.dp, vertical = 3.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
        }

        if (exercise.image.isNotBlank()) {
            AsyncImage(
                model = exercise.image,
                contentDescription = exercise.name,
                modifier = Modifier
                    .size(180.dp)
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.height(20.dp))
        }

        Text(
            text = exercise.name,
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = stringResource(R.string.workout_runner_set, state.currentSet, exercise.sets),
            color = MaterialTheme.colorScheme.primary,
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(24.dp))

        Row(horizontalArrangement = Arrangement.spacedBy(32.dp)) {
            // RIR or reps — mutually exclusive
            if (exercise.rir != null) {
                StatDisplay(
                    label = stringResource(R.string.workout_rir),
                    value = if (exercise.rir == 0) stringResource(R.string.workout_rir_to_failure)
                            else exercise.rir.toString(),
                    valueColor = androidx.compose.ui.graphics.Color(0xFFFF9800)
                )
            } else {
                StatDisplay(
                    label = stringResource(R.string.workout_reps),
                    value = exercise.reps.toString()
                )
            }
            StatDisplay(
                label = stringResource(R.string.workout_rest),
                value = stringResource(R.string.workout_rest_seconds, exercise.rest)
            )
        }

        Spacer(modifier = Modifier.height(40.dp))

        AppButton(
            text = stringResource(R.string.workout_runner_set_done),
            onClick = onSetDone,
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 32.dp)
        )
    }
}

@Composable
fun StatDisplay(
    label: String,
    value: String,
    valueColor: androidx.compose.ui.graphics.Color = MaterialTheme.colorScheme.onSurface
) {
    Column(horizontalAlignment = Alignment.CenterHorizontally) {
        Text(
            text = value,
            color = valueColor,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )
        Text(
            text = label,
            color = GrayText,
            fontSize = 13.sp
        )
    }
}
