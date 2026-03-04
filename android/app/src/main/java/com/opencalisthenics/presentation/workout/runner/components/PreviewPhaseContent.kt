package com.opencalisthenics.presentation.workout.runner.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.FilledTonalButton
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.R
import com.opencalisthenics.presentation.workout.components.WorkoutExerciseList
import com.opencalisthenics.presentation.workout.components.WorkoutTagList
import com.opencalisthenics.presentation.workout.runner.WorkoutRunnerUiState
import com.opencalisthenics.presentation.workout.workoutDifficultyColor
import com.opencalisthenics.presentation.workout.workoutDifficultyLabel
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Secondary500

@Composable
fun PreviewPhaseContent(
    state: WorkoutRunnerUiState,
    onBack: () -> Unit,
    onMarkAsDone: () -> Unit,
    onStart: () -> Unit
) {
    val workout = state.workout ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp)
    ) {
        // Title — anchored at top, outside scroll
        Text(
            text = workout.name,
            color = MaterialTheme.colorScheme.onSurface,
            fontSize = 26.sp,
            fontWeight = FontWeight.Bold
        )
        Spacer(modifier = Modifier.height(16.dp))

        // Scrollable content
        Column(
            modifier = Modifier
                .weight(1f)
                .verticalScroll(rememberScrollState())
        ) {
            if (workout.description.isNotBlank()) {
                Text(
                    text = workout.description,
                    color = GrayText,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.height(12.dp))
            }

            if (workout.difficulty.isNotBlank() || workout.duration > 0) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    if (workout.difficulty.isNotBlank()) {
                        val diffColor = workoutDifficultyColor(workout.difficulty)
                        Text(
                            text = workoutDifficultyLabel(workout.difficulty),
                            color = diffColor,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier
                                .clip(RoundedCornerShape(50))
                                .background(diffColor.copy(alpha = 0.15f))
                                .padding(horizontal = 12.dp, vertical = 5.dp)
                        )
                    }
                    if (workout.duration > 0) {
                        Text(
                            text = stringResource(R.string.workout_duration, workout.duration),
                            color = MaterialTheme.colorScheme.tertiary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier
                                .clip(RoundedCornerShape(50))
                                .background(MaterialTheme.colorScheme.tertiary.copy(alpha = 0.15f))
                                .padding(horizontal = 12.dp, vertical = 5.dp)
                        )
                    }
                }
                Spacer(modifier = Modifier.height(10.dp))
            }

            if (workout.tags.isNotEmpty()) {
                WorkoutTagList(tags = workout.tags)
                Spacer(modifier = Modifier.height(10.dp))
            }

            if (workout.exercises.isNotEmpty()) {
                HorizontalDivider(color = MaterialTheme.colorScheme.surface)
                Spacer(modifier = Modifier.height(16.dp))
                WorkoutExerciseList(exercises = workout.exercises)
                Spacer(modifier = Modifier.height(16.dp))
            }
        }

        // Buttons — anchored at bottom, outside scroll
        Spacer(modifier = Modifier.height(12.dp))

        Button(
            onClick = onStart,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(12.dp)
        ) {
            Icon(
                imageVector = Icons.Default.PlayArrow,
                contentDescription = null,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.size(6.dp))
            Text(
                text = stringResource(R.string.workout_runner_start),
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(modifier = Modifier.height(8.dp))

        FilledTonalButton(
            onClick = onMarkAsDone,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.filledTonalButtonColors(
                containerColor = Secondary500.copy(alpha = 0.15f),
                contentColor = Secondary500
            )
        ) {
            Icon(
                imageVector = Icons.Default.Check,
                contentDescription = null,
                modifier = Modifier.size(18.dp)
            )
            Spacer(modifier = Modifier.size(6.dp))
            Text(
                text = stringResource(R.string.workout_runner_mark_done),
                fontSize = 15.sp
            )
        }

        Spacer(modifier = Modifier.height(16.dp))
    }
}
