package com.opencalisthenics.presentation.exercise.exercise

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.ExerciseRepositoryImpl
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.usecase.exercise.GetExerciseByIdUseCase
import kotlinx.coroutines.launch

data class ExerciseDetailUiState(
    val exercise: Exercise? = null,
    val isLoading: Boolean = false,
    val errorMessage: String? = null
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
                        errorMessage = e.message ?: "Error al cargar el ejercicio",
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
