package com.opencalisthenics.presentation.workout.runner.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.presentation.workout.formatDuration
import com.opencalisthenics.presentation.workout.runner.WorkoutRunnerUiState
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Secondary500

@Composable
fun CompletePhaseContent(
    state: WorkoutRunnerUiState,
    onFinish: () -> Unit
) {
    val workout = state.workout ?: return

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
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
