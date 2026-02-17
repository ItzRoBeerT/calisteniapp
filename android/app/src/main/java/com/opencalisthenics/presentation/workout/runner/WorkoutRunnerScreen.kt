package com.opencalisthenics.presentation.workout.runner

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Close
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil3.compose.AsyncImage
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.presentation.workout.formatDuration
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Secondary500

@Composable
fun WorkoutRunnerScreen(
    workoutId: Int,
    onBack: () -> Unit,
    viewModel: WorkoutRunnerViewModel = viewModel(factory = WorkoutRunnerViewModel.factory(workoutId))
) {
    val state = viewModel.uiState

    // Cancel dialog
    if (state.showCancelDialog) {
        AlertDialog(
            onDismissRequest = viewModel::onDismissCancelDialog,
            title = {
                Text(
                    text = stringResource(R.string.workout_runner_cancel_title),
                    color = MaterialTheme.colorScheme.onSurface
                )
            },
            text = {
                Text(
                    text = stringResource(R.string.workout_runner_cancel_confirm),
                    color = MaterialTheme.colorScheme.onSurface
                )
            },
            confirmButton = {
                TextButton(onClick = onBack) {
                    Text(
                        text = stringResource(R.string.workout_runner_cancel_yes),
                        color = MaterialTheme.colorScheme.error
                    )
                }
            },
            dismissButton = {
                TextButton(onClick = viewModel::onDismissCancelDialog) {
                    Text(
                        text = stringResource(R.string.workout_runner_cancel_no),
                        color = MaterialTheme.colorScheme.primary
                    )
                }
            },
            containerColor = MaterialTheme.colorScheme.surface
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(top = 8.dp)
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = stringResource(R.string.workout_runner_title),
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(start = 8.dp)
            )
            if (state.phase != RunnerPhase.COMPLETE && state.phase != RunnerPhase.LOADING) {
                IconButton(onClick = viewModel::onShowCancelDialog) {
                    Icon(
                        imageVector = Icons.Default.Close,
                        contentDescription = stringResource(R.string.workout_runner_cancel),
                        tint = GrayText
                    )
                }
            }
        }

        when (state.phase) {
            RunnerPhase.LOADING -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    if (state.errorMessage != null) {
                        Text(
                            text = state.errorMessage.asString(),
                            color = MaterialTheme.colorScheme.error,
                            textAlign = TextAlign.Center
                        )
                    } else {
                        CircularProgressIndicator(
                            color = MaterialTheme.colorScheme.primary,
                            modifier = Modifier.size(48.dp)
                        )
                    }
                }
            }

            RunnerPhase.EXERCISE -> {
                ExercisePhase(
                    state = state,
                    onSetDone = viewModel::onSetDone
                )
            }

            RunnerPhase.REST -> {
                RestPhase(
                    state = state,
                    onSkipRest = viewModel::onSkipRest
                )
            }

            RunnerPhase.COMPLETE -> {
                CompletePhase(
                    state = state,
                    onFinish = onBack
                )
            }
        }
    }
}

@Composable
private fun ExercisePhase(
    state: WorkoutRunnerUiState,
    onSetDone: () -> Unit
) {
    val exercise = state.currentExercise ?: return
    val workout = state.workout ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Progress bar
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

        // Elapsed time + exercise counter
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
                    workout.exercises.size
                ),
                color = GrayText,
                fontSize = 13.sp
            )
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Exercise image
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

        // Exercise name
        Text(
            text = exercise.name,
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 22.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(16.dp))

        // Set info
        Text(
            text = stringResource(R.string.workout_runner_set, state.currentSet, exercise.sets),
            color = MaterialTheme.colorScheme.primary,
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium
        )

        Spacer(modifier = Modifier.height(24.dp))

        // Reps display
        Row(
            horizontalArrangement = Arrangement.spacedBy(32.dp)
        ) {
            StatDisplay(
                label = stringResource(R.string.workout_reps),
                value = exercise.reps.toString()
            )
            StatDisplay(
                label = stringResource(R.string.workout_rest),
                value = stringResource(R.string.workout_rest_seconds, exercise.rest)
            )
        }

        Spacer(modifier = Modifier.weight(1f))

        // Set done button
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
private fun RestPhase(
    state: WorkoutRunnerUiState,
    onSkipRest: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(R.string.workout_runner_rest_title),
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold
        )

        Spacer(modifier = Modifier.height(40.dp))

        // Circular timer
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier.size(200.dp)
        ) {
            val progress = if (state.restTotalSeconds > 0) {
                state.restSecondsRemaining.toFloat() / state.restTotalSeconds
            } else 0f

            val primaryColor = MaterialTheme.colorScheme.primary
            val surfaceColor = MaterialTheme.colorScheme.surface

            Canvas(modifier = Modifier.size(200.dp)) {
                val strokeWidth = 8.dp.toPx()
                val arcSize = Size(size.width - strokeWidth, size.height - strokeWidth)
                val topLeft = Offset(strokeWidth / 2, strokeWidth / 2)

                // Background arc
                drawArc(
                    color = surfaceColor,
                    startAngle = -90f,
                    sweepAngle = 360f,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
                // Progress arc
                drawArc(
                    color = primaryColor,
                    startAngle = -90f,
                    sweepAngle = 360f * progress,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arcSize,
                    style = Stroke(width = strokeWidth, cap = StrokeCap.Round)
                )
            }

            Text(
                text = "${state.restSecondsRemaining}",
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 48.sp,
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(40.dp))

        TextButton(onClick = onSkipRest) {
            Text(
                text = stringResource(R.string.workout_runner_skip_rest),
                color = MaterialTheme.colorScheme.primary,
                fontSize = 16.sp
            )
        }
    }
}

@Composable
private fun CompletePhase(
    state: WorkoutRunnerUiState,
    onFinish: () -> Unit
) {
    val workout = state.workout ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = stringResource(R.string.workout_runner_complete),
            color = Secondary500,
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(modifier = Modifier.height(32.dp))

        // Stats
        Column(
            modifier = Modifier
                .clip(RoundedCornerShape(12.dp))
                .background(MaterialTheme.colorScheme.surface)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Text(
                text = workout.name,
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = stringResource(
                    R.string.workout_runner_complete_time,
                    formatDuration(state.elapsedSeconds)
                ),
                color = GrayText,
                fontSize = 15.sp
            )
            Text(
                text = stringResource(
                    R.string.workout_runner_complete_exercises,
                    workout.exercises.size
                ),
                color = GrayText,
                fontSize = 15.sp
            )
        }

        Spacer(modifier = Modifier.height(40.dp))

        AppButton(
            text = stringResource(R.string.workout_runner_finish),
            onClick = onFinish,
            modifier = Modifier.fillMaxWidth()
        )
    }
}

@Composable
private fun StatDisplay(label: String, value: String) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = value,
            color = MaterialTheme.colorScheme.onSurface,
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
