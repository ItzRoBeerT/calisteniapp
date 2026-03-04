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

data class WorkoutRunnerUiState(
    val workout: Workout? = null,
    val phase: RunnerPhase = RunnerPhase.LOADING,
    val currentExerciseIndex: Int = 0,
    val currentSet: Int = 1,
    val totalSetsCompleted: Int = 0,
    val totalSets: Int = 0,
    val elapsedSeconds: Int = 0,
    val restSecondsRemaining: Int = 0,
    val restTotalSeconds: Int = 0,
    val showCancelDialog: Boolean = false,
    val isRestBetweenExercises: Boolean = false,
    val isLoading: Boolean = true,
    val errorMessage: UiText? = null,
    val isSaving: Boolean = false,
    val isSaved: Boolean = false,
    val saveError: UiText? = null
) {
    val currentExercise: ExerciseWorkout?
        get() = workout?.exercises?.getOrNull(currentExerciseIndex)

    val progressPercent: Float
        get() = if (totalSets > 0) totalSetsCompleted.toFloat() / totalSets else 0f
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

    init {
        loadWorkout()
    }

    private fun loadWorkout() {
        viewModelScope.launch {
            getWorkoutByIdUseCase(workoutId)
                .onSuccess { workout ->
                    val totalSets = workout.exercises.sumOf { it.sets }
                    uiState = uiState.copy(
                        workout = workout,
                        totalSets = totalSets,
                        phase = RunnerPhase.PREVIEW,
                        isLoading = false
                    )
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
        val exercise = uiState.currentExercise ?: return
        val newTotalCompleted = uiState.totalSetsCompleted + 1

        if (uiState.currentSet < exercise.sets) {
            // More sets remaining for this exercise → go to rest
            uiState = uiState.copy(
                totalSetsCompleted = newTotalCompleted,
                currentSet = uiState.currentSet + 1,
                phase = RunnerPhase.REST,
                isRestBetweenExercises = false,
                restSecondsRemaining = exercise.rest,
                restTotalSeconds = exercise.rest
            )
            startRestTimer()
        } else {
            // Last set of this exercise
            val nextIndex = uiState.currentExerciseIndex + 1
            val workout = uiState.workout ?: return

            if (nextIndex < workout.exercises.size) {
                // More exercises → rest then next exercise
                uiState = uiState.copy(
                    totalSetsCompleted = newTotalCompleted,
                    phase = RunnerPhase.REST,
                    isRestBetweenExercises = true,
                    restSecondsRemaining = exercise.rest,
                    restTotalSeconds = exercise.rest
                )
                startRestTimer(moveToNextExercise = true)
            } else {
                // Workout complete
                timerJob?.cancel()
                uiState = uiState.copy(
                    totalSetsCompleted = newTotalCompleted,
                    phase = RunnerPhase.COMPLETE
                )
                saveCompletion()
            }
        }
    }

    private fun startRestTimer(moveToNextExercise: Boolean = false) {
        restTimerJob?.cancel()
        restTimerJob = viewModelScope.launch {
            while (uiState.restSecondsRemaining > 0) {
                delay(1000)
                uiState = uiState.copy(
                    restSecondsRemaining = uiState.restSecondsRemaining - 1
                )
            }
            onRestFinished(moveToNextExercise)
        }
    }

    fun onSkipRest() {
        restTimerJob?.cancel()
        onRestFinished(uiState.isRestBetweenExercises)
    }

    private fun onRestFinished(moveToNextExercise: Boolean) {
        if (moveToNextExercise) {
            val nextIndex = uiState.currentExerciseIndex + 1
            uiState = uiState.copy(
                currentExerciseIndex = nextIndex,
                currentSet = 1,
                phase = RunnerPhase.EXERCISE,
                restSecondsRemaining = 0
            )
        } else {
            uiState = uiState.copy(
                phase = RunnerPhase.EXERCISE,
                restSecondsRemaining = 0
            )
        }
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
