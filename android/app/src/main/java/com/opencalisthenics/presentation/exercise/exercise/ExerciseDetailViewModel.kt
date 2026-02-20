package com.opencalisthenics.presentation.exercise.exercise

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.ExerciseRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.usecase.exercise.GetExerciseByIdUseCase
import com.opencalisthenics.domain.usecase.exercise.GetProgressionForExerciseUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

data class ExerciseDetailUiState(
    val exercise: Exercise? = null,
    val prerequisites: List<Exercise> = emptyList(),
    val variations: List<Exercise> = emptyList(),
    val progressions: List<Exercise> = emptyList(),
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null
)

class ExerciseDetailViewModel(
    private val exerciseId: Int,
    private val getExerciseByIdUseCase: GetExerciseByIdUseCase,
    private val getProgressionForExerciseUseCase: GetProgressionForExerciseUseCase
) : ViewModel() {

    var uiState by mutableStateOf(ExerciseDetailUiState())
        private set

    init {
        loadExercise()
    }

    private fun loadExercise() {
        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            getExerciseByIdUseCase(exerciseId)
                .onSuccess { exercise ->
                    uiState = uiState.copy(exercise = exercise, isLoading = false)
                    loadProgression()
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_load_exercise),
                        isLoading = false
                    )
                }
        }
    }

    private fun loadProgression() {
        viewModelScope.launch {
            getProgressionForExerciseUseCase(exerciseId).onSuccess { progression ->
                if (progression == null) return@onSuccess

                val prereqs = progression.prerequisites.mapNotNull { id ->
                    getExerciseByIdUseCase(id).getOrNull()
                }
                val vars = progression.variations.mapNotNull { id ->
                    getExerciseByIdUseCase(id).getOrNull()
                }
                val progs = progression.progressions.mapNotNull { id ->
                    getExerciseByIdUseCase(id).getOrNull()
                }
                uiState = uiState.copy(
                    prerequisites = prereqs,
                    variations = vars,
                    progressions = progs
                )
            }
        }
    }

    companion object {
        fun factory(application: Application, exerciseId: Int): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    val repository = ExerciseRepositoryImpl(application.applicationContext)
                    return ExerciseDetailViewModel(
                        exerciseId = exerciseId,
                        getExerciseByIdUseCase = GetExerciseByIdUseCase(repository),
                        getProgressionForExerciseUseCase = GetProgressionForExerciseUseCase(repository)
                    ) as T
                }
            }
        }
    }
}
