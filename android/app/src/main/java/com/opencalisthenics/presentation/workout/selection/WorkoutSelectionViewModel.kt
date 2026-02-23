package com.opencalisthenics.presentation.workout.selection

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.WorkoutRepositoryImpl
import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.usecase.workout.GetFavoriteWorkoutsWithDetailsUseCase
import com.opencalisthenics.domain.usecase.workout.GetUserWorkoutsUseCase
import kotlinx.coroutines.async
import kotlinx.coroutines.launch

data class WorkoutSelectionUiState(
    val userWorkouts: List<Workout> = emptyList(),
    val likedWorkouts: List<Workout> = emptyList(),
    val isLoading: Boolean = false
)

class WorkoutSelectionViewModel(
    private val getUserWorkoutsUseCase: GetUserWorkoutsUseCase,
    private val getFavoriteWorkoutsWithDetailsUseCase: GetFavoriteWorkoutsWithDetailsUseCase
) : ViewModel() {

    var uiState by mutableStateOf(WorkoutSelectionUiState())
        private set

    init {
        loadData()
    }

    fun loadData() {
        uiState = uiState.copy(isLoading = true)
        viewModelScope.launch {
            val userDeferred = async { getUserWorkoutsUseCase() }
            val likedDeferred = async { getFavoriteWorkoutsWithDetailsUseCase() }

            val userResult = userDeferred.await()
            val likedResult = likedDeferred.await()

            uiState = uiState.copy(
                userWorkouts = userResult.getOrDefault(emptyList()),
                likedWorkouts = likedResult.getOrDefault(emptyList()),
                isLoading = false
            )
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val repo = WorkoutRepositoryImpl()
                return WorkoutSelectionViewModel(
                    getUserWorkoutsUseCase = GetUserWorkoutsUseCase(repo),
                    getFavoriteWorkoutsWithDetailsUseCase = GetFavoriteWorkoutsWithDetailsUseCase(repo)
                ) as T
            }
        }
    }
}
