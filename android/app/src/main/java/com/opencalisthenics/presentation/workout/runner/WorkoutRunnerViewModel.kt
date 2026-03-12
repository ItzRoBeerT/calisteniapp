package com.opencalisthenics.presentation.workout.runner

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.WorkoutRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.ExerciseWorkout
import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.model.WorkoutCompletion
import com.opencalisthenics.domain.usecase.workout.GetWorkoutByIdUseCase
import com.opencalisthenics.domain.usecase.workout.SaveWorkoutCompletionUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class RunnerPhase {
    LOADING,
    PREVIEW,
    EXERCISE,
    REST,
    COMPLETE
}

private data class Step(
    val exerciseIndex: Int,
    val set: Int,
    val skipRestAfter: Boolean
)

private fun computeSteps(exercises: List<ExerciseWorkout>): List<Step> {
    val steps = mutableListOf<Step>()
    var i = 0
    while (i < exercises.size) {
        val ex = exercises[i]
        val groupId = ex.supersetGroup
        if (groupId != null) {
            val groupIndices = mutableListOf(i)
            while (i + 1 < exercises.size && exercises[i + 1].supersetGroup == groupId) {
                i++
                groupIndices.add(i)
            }
            val maxSets = groupIndices.maxOf { exercises[it].sets }
            for (set in 1..maxSets) {
                for (k in groupIndices.indices) {
                    val exIdx = groupIndices[k]
                    if (set <= exercises[exIdx].sets) {
                        steps.add(Step(exerciseIndex = exIdx, set = set, skipRestAfter = k < groupIndices.size - 1))
                    }
                }
            }
        } else {
            for (set in 1..ex.sets) {
                steps.add(Step(exerciseIndex = i, set = set, skipRestAfter = false))
            }
        }
        i++
    }
    return steps
}

data class WorkoutRunnerUiState(
    val workout: Workout? = null,
    val phase: RunnerPhase = RunnerPhase.LOADING,
    val currentExerciseIndex: Int = 0,
    val currentSet: Int = 1,
    val progressPercent: Float = 0f,
    val isInSuperset: Boolean = false,
    val totalExercises: Int = 0,
    val elapsedSeconds: Int = 0,
    val restSecondsRemaining: Int = 0,
    val restTotalSeconds: Int = 0,
    val showCancelDialog: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: UiText? = null,
    val isSaving: Boolean = false,
    val isSaved: Boolean = false,
    val saveError: UiText? = null
) {
    val currentExercise: ExerciseWorkout?
        get() = workout?.exercises?.getOrNull(currentExerciseIndex)
}

class WorkoutRunnerViewModel(
    private val workoutId: Int,
    private val getWorkoutByIdUseCase: GetWorkoutByIdUseCase = GetWorkoutByIdUseCase(WorkoutRepositoryImpl()),
    private val saveWorkoutCompletionUseCase: SaveWorkoutCompletionUseCase = SaveWorkoutCompletionUseCase(WorkoutRepositoryImpl())
) : ViewModel() {

    var uiState by mutableStateOf(WorkoutRunnerUiState())
        private set

    private var timerJob: Job? = null
    private var restTimerJob: Job? = null
    private var steps: List<Step> = emptyList()
    private var currentStepIndex: Int = 0

    init {
        loadWorkout()
    }

    private fun loadWorkout() {
        viewModelScope.launch {
            getWorkoutByIdUseCase(workoutId)
                .onSuccess { workout ->
                    steps = computeSteps(workout.exercises)
                    currentStepIndex = 0
                    uiState = uiState.copy(
                        workout = workout,
                        totalExercises = workout.exercises.size,
                        phase = RunnerPhase.PREVIEW,
                        isLoading = false
                    ).applyStep()
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_unknown),
                        isLoading = false
                    )
                }
        }
    }

    private fun WorkoutRunnerUiState.applyStep(): WorkoutRunnerUiState {
        val step = steps.getOrNull(currentStepIndex)
        return copy(
            currentExerciseIndex = step?.exerciseIndex ?: 0,
            currentSet = step?.set ?: 1,
            isInSuperset = step?.let { workout?.exercises?.getOrNull(it.exerciseIndex)?.supersetGroup != null } ?: false,
            progressPercent = if (steps.isNotEmpty()) currentStepIndex.toFloat() / steps.size else 0f
        )
    }

    private fun startElapsedTimer() {
        timerJob?.cancel()
        timerJob = viewModelScope.launch {
            while (true) {
                delay(1000)
                uiState = uiState.copy(elapsedSeconds = uiState.elapsedSeconds + 1)
            }
        }
    }

    fun onSetDone() {
        val step = steps.getOrNull(currentStepIndex) ?: return
        val exercise = uiState.currentExercise ?: return
        val isLastStep = currentStepIndex >= steps.size - 1

        when {
            isLastStep -> {
                timerJob?.cancel()
                uiState = uiState.copy(phase = RunnerPhase.COMPLETE)
                saveCompletion()
            }
            step.skipRestAfter -> {
                currentStepIndex++
                uiState = uiState.copy(phase = RunnerPhase.EXERCISE).applyStep()
            }
            else -> {
                currentStepIndex++
                val restDuration = if (exercise.rest > 0) exercise.rest else 60
                uiState = uiState.copy(
                    phase = RunnerPhase.REST,
                    restSecondsRemaining = restDuration,
                    restTotalSeconds = restDuration
                ).applyStep()
                startRestTimer()
            }
        }
    }

    private fun startRestTimer() {
        restTimerJob?.cancel()
        restTimerJob = viewModelScope.launch {
            while (uiState.restSecondsRemaining > 0) {
                delay(1000)
                uiState = uiState.copy(restSecondsRemaining = uiState.restSecondsRemaining - 1)
            }
            onRestFinished()
        }
    }

    fun onSkipRest() {
        restTimerJob?.cancel()
        onRestFinished()
    }

    private fun onRestFinished() {
        uiState = uiState.copy(phase = RunnerPhase.EXERCISE, restSecondsRemaining = 0)
    }

    fun onStartWorkout() {
        uiState = uiState.copy(phase = RunnerPhase.EXERCISE)
        startElapsedTimer()
    }

    fun onMarkAsDone() {
        uiState = uiState.copy(isSaved = true)
        saveCompletion(durationSeconds = 0)
    }

    fun onShowCancelDialog() {
        uiState = uiState.copy(showCancelDialog = true)
    }

    fun onDismissCancelDialog() {
        uiState = uiState.copy(showCancelDialog = false)
    }

    private fun saveCompletion(durationSeconds: Int = uiState.elapsedSeconds) {
        val workout = uiState.workout ?: return
        viewModelScope.launch {
            uiState = uiState.copy(isSaving = true, saveError = null)
            saveWorkoutCompletionUseCase(
                WorkoutCompletion(
                    workoutId = workout.id,
                    workoutName = workout.name,
                    durationSeconds = durationSeconds,
                    exercisesCount = workout.exercises.size
                )
            )
                .onSuccess {
                    uiState = uiState.copy(isSaving = false, isSaved = true)
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        isSaving = false,
                        saveError = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.workout_runner_save_error)
                    )
                }
        }
    }

    fun onRetrySave() {
        saveCompletion()
    }

    override fun onCleared() {
        super.onCleared()
        timerJob?.cancel()
        restTimerJob?.cancel()
    }

    companion object {
        fun factory(workoutId: Int): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    val repo = WorkoutRepositoryImpl()
                    return WorkoutRunnerViewModel(
                        workoutId = workoutId,
                        getWorkoutByIdUseCase = GetWorkoutByIdUseCase(repo),
                        saveWorkoutCompletionUseCase = SaveWorkoutCompletionUseCase(repo)
                    ) as T
                }
            }
        }
    }
}
