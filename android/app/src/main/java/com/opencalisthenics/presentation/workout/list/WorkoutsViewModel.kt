package com.opencalisthenics.presentation.workout.list

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.data.repository.WorkoutRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.model.WorkoutFilters
import com.opencalisthenics.domain.usecase.workout.GetFavoriteIdsUseCase
import com.opencalisthenics.domain.usecase.workout.GetWorkoutsUseCase
import com.opencalisthenics.domain.usecase.workout.ToggleFavoriteUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import io.github.jan.supabase.auth.auth
import kotlinx.coroutines.launch

data class WorkoutsUiState(
    val workouts: List<Workout> = emptyList(),
    val favoriteIds: Set<Int> = emptySet(),
    val currentUserId: String? = null,
    val currentPage: Int = 1,
    val hasMorePages: Boolean = false,
    val selectedDifficulty: String? = null,
    val selectedMuscleGroup: String? = null,
    val availableMuscleGroups: List<String> = emptyList(),
    val showFilters: Boolean = false,
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null
)

class WorkoutsViewModel(
    private val getWorkoutsUseCase: GetWorkoutsUseCase = GetWorkoutsUseCase(WorkoutRepositoryImpl()),
    private val getFavoriteIdsUseCase: GetFavoriteIdsUseCase = GetFavoriteIdsUseCase(WorkoutRepositoryImpl()),
    private val toggleFavoriteUseCase: ToggleFavoriteUseCase = ToggleFavoriteUseCase(WorkoutRepositoryImpl())
) : ViewModel() {

    var uiState by mutableStateOf(WorkoutsUiState())
        private set

    private val pageSize = 12

    init {
        loadCurrentUser()
        loadWorkouts()
        loadFavorites()
    }

    private fun loadCurrentUser() {
        uiState = uiState.copy(
            currentUserId = SupabaseClient.client.auth.currentUserOrNull()?.id
        )
    }

    fun loadWorkouts() {
        uiState = uiState.copy(isLoading = true, errorMessage = null)

        val filters = if (uiState.selectedDifficulty != null || uiState.selectedMuscleGroup != null) {
            WorkoutFilters(
                difficulty = uiState.selectedDifficulty,
                muscleGroup = uiState.selectedMuscleGroup
            )
        } else null

        viewModelScope.launch {
            getWorkoutsUseCase(
                page = uiState.currentPage,
                limit = pageSize,
                filters = filters
            )
                .onSuccess { workouts ->
                    val muscleGroups = workouts
                        .flatMap { it.muscleGroups }
                        .distinct()
                        .sorted()

                    // Sort: favorites first
                    val sorted = workouts.sortedByDescending { it.id in uiState.favoriteIds }

                    uiState = uiState.copy(
                        workouts = sorted,
                        availableMuscleGroups = if (muscleGroups.isNotEmpty()) muscleGroups
                        else uiState.availableMuscleGroups,
                        hasMorePages = workouts.size >= pageSize,
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

    private fun loadFavorites() {
        viewModelScope.launch {
            getFavoriteIdsUseCase()
                .onSuccess { ids ->
                    uiState = uiState.copy(favoriteIds = ids.toSet())
                }
        }
    }

    fun onToggleFavorite(workoutId: Int) {
        viewModelScope.launch {
            toggleFavoriteUseCase(workoutId)
                .onSuccess { isFavorite ->
                    val newFavorites = if (isFavorite) {
                        uiState.favoriteIds + workoutId
                    } else {
                        uiState.favoriteIds - workoutId
                    }
                    uiState = uiState.copy(favoriteIds = newFavorites)
                }
        }
    }

    fun onDifficultySelected(difficulty: String?) {
        uiState = uiState.copy(selectedDifficulty = difficulty, currentPage = 1)
        loadWorkouts()
    }

    fun onMuscleGroupSelected(muscleGroup: String?) {
        uiState = uiState.copy(selectedMuscleGroup = muscleGroup, currentPage = 1)
        loadWorkouts()
    }

    fun onToggleFilters() {
        uiState = uiState.copy(showFilters = !uiState.showFilters)
    }

    fun onNextPage() {
        uiState = uiState.copy(currentPage = uiState.currentPage + 1)
        loadWorkouts()
    }

    fun onPreviousPage() {
        if (uiState.currentPage > 1) {
            uiState = uiState.copy(currentPage = uiState.currentPage - 1)
            loadWorkouts()
        }
    }

    companion object {
        val Factory: ViewModelProvider.Factory = object : ViewModelProvider.Factory {
            @Suppress("UNCHECKED_CAST")
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                val repo = WorkoutRepositoryImpl()
                return WorkoutsViewModel(
                    getWorkoutsUseCase = GetWorkoutsUseCase(repo),
                    getFavoriteIdsUseCase = GetFavoriteIdsUseCase(repo),
                    toggleFavoriteUseCase = ToggleFavoriteUseCase(repo)
                ) as T
            }
        }
    }
}
