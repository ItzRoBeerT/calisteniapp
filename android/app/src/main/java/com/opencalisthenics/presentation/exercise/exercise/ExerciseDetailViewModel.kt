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
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.usecase.exercise.GetExerciseByIdUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

data class ExerciseDetailUiState(
    val exercise: Exercise? = null,
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null
)

class ExerciseDetailViewModel(
    private val exerciseId: Int,
    private val getExerciseByIdUseCase: GetExerciseByIdUseCase
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
                    uiState = uiState.copy(
                        exercise = exercise,
                        isLoading = false
                    )
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

    companion object {
        fun factory(application: Application, exerciseId: Int): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return ExerciseDetailViewModel(
                        exerciseId = exerciseId,
                        getExerciseByIdUseCase = GetExerciseByIdUseCase(
                            ExerciseRepositoryImpl(application.applicationContext)
                        )
                    ) as T
                }
            }
        }
    }
}
