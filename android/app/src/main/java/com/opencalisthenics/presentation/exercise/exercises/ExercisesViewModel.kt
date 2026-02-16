package com.opencalisthenics.presentation.exercise.exercises

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.ExerciseRepositoryImpl
import com.opencalisthenics.domain.model.DifficultyLevel
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.usecase.exercise.GetExercisesUseCase
import com.opencalisthenics.domain.usecase.exercise.GetMuscleGroupLabelsUseCase
import kotlinx.coroutines.launch

data class ExercisesUiState(
    val allExercises: List<Exercise> = emptyList(),
    val filteredExercises: List<Exercise> = emptyList(),
    val selectedDifficulty: DifficultyLevel? = null,
    val selectedMuscleGroup: String? = null,
    val availableMuscleGroups: List<String> = emptyList(),
    val muscleGroupLabels: Map<String, String> = emptyMap(),
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class ExercisesViewModel(
    private val getExercisesUseCase: GetExercisesUseCase,
    private val getMuscleGroupLabelsUseCase: GetMuscleGroupLabelsUseCase = GetMuscleGroupLabelsUseCase()
) : ViewModel() {

    var uiState by mutableStateOf(ExercisesUiState())
        private set

    init {
        uiState = uiState.copy(muscleGroupLabels = getMuscleGroupLabelsUseCase())
        loadExercises()
    }

    private fun loadExercises() {
        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            getExercisesUseCase()
                .onSuccess { exercises ->
                    val muscleGroups = exercises
                        .flatMap { it.muscleGroups }
                        .distinct()
                        .sorted()
                    uiState = uiState.copy(
                        allExercises = exercises,
                        filteredExercises = exercises,
                        availableMuscleGroups = muscleGroups,
                        isLoading = false
                    )
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = e.message ?: "Error al cargar los ejercicios",
                        isLoading = false
                    )
                }
        }
    }

    fun onDifficultySelected(difficulty: DifficultyLevel?) {
        uiState = uiState.copy(selectedDifficulty = difficulty)
        applyFilters()
    }

    fun onMuscleGroupSelected(muscleGroup: String?) {
        uiState = uiState.copy(selectedMuscleGroup = muscleGroup)
        applyFilters()
    }

    private fun applyFilters() {
        val filtered = uiState.allExercises.filter { exercise ->
            val matchesDifficulty = uiState.selectedDifficulty?.let {
                exercise.difficulty in it.range
            } ?: true

            val matchesMuscleGroup = uiState.selectedMuscleGroup?.let {
                it in exercise.muscleGroups
            } ?: true

            matchesDifficulty && matchesMuscleGroup
        }
        uiState = uiState.copy(filteredExercises = filtered)
    }

    companion object {
        fun factory(application: Application): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    return ExercisesViewModel(
                        GetExercisesUseCase(ExerciseRepositoryImpl(application.applicationContext))
                    ) as T
                }
            }
        }
    }
}
