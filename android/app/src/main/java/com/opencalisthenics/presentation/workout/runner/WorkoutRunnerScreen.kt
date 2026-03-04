package com.opencalisthenics.presentation.workout.runner

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.presentation.workout.runner.components.CancelWorkoutDialog
import com.opencalisthenics.presentation.workout.runner.components.CompletePhaseContent
import com.opencalisthenics.presentation.workout.runner.components.ExercisePhaseContent
import com.opencalisthenics.presentation.workout.runner.components.PreviewPhaseContent
import com.opencalisthenics.presentation.workout.runner.components.RestPhaseContent
import com.opencalisthenics.presentation.workout.runner.components.WorkoutRunnerTopBar
import com.opencalisthenics.ui.theme.Background

@Composable
fun WorkoutRunnerScreen(
    workoutId: Int,
    onBack: () -> Unit,
    viewModel: WorkoutRunnerViewModel = viewModel(factory = WorkoutRunnerViewModel.factory(workoutId))
) {
    val state = viewModel.uiState

    LaunchedEffect(state.isSaved, state.phase) {
        if (state.isSaved && state.phase == RunnerPhase.PREVIEW) onBack()
    }

    if (state.showCancelDialog) {
        CancelWorkoutDialog(
            onConfirm = onBack,
            onDismiss = viewModel::onDismissCancelDialog
        )
    }

    val showCancel = state.phase != RunnerPhase.COMPLETE &&
            state.phase != RunnerPhase.LOADING &&
            state.phase != RunnerPhase.PREVIEW

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .statusBarsPadding()
            .padding(top = 8.dp)
    ) {
        if (showCancel) {
            WorkoutRunnerTopBar(
                showCancelButton = true,
                onCancel = viewModel::onShowCancelDialog
            )
        }

        when (state.phase) {
            RunnerPhase.LOADING -> LoadingPhaseContent(state)

            RunnerPhase.PREVIEW -> PreviewPhaseContent(
                state = state,
                onBack = onBack,
                onMarkAsDone = viewModel::onMarkAsDone,
                onStart = viewModel::onStartWorkout
            )

            RunnerPhase.EXERCISE -> ExercisePhaseContent(
                state = state,
                onSetDone = viewModel::onSetDone
            )

            RunnerPhase.REST -> RestPhaseContent(
                state = state,
                onSkipRest = viewModel::onSkipRest
            )

            RunnerPhase.COMPLETE -> CompletePhaseContent(
                state = state,
                onFinish = onBack
            )
        }
    }
}

@Composable
private fun LoadingPhaseContent(state: WorkoutRunnerUiState) {
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
