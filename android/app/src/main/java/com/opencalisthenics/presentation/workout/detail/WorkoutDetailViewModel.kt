package com.opencalisthenics.presentation.workout.detail

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
import com.opencalisthenics.domain.usecase.workout.DeleteWorkoutUseCase
import com.opencalisthenics.domain.usecase.workout.GetWorkoutByIdUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import io.github.jan.supabase.auth.auth
import kotlinx.coroutines.launch

data class WorkoutDetailUiState(
    val workout: Workout? = null,
    val isOwner: Boolean = false,
    val showDeleteDialog: Boolean = false,
    val isLoading: Boolean = false,
    val isDeleting: Boolean = false,
    val isDeleted: Boolean = false,
    val errorMessage: UiText? = null
)

class WorkoutDetailViewModel(
    private val workoutId: Int,
    private val getWorkoutByIdUseCase: GetWorkoutByIdUseCase = GetWorkoutByIdUseCase(WorkoutRepositoryImpl()),
    private val deleteWorkoutUseCase: DeleteWorkoutUseCase = DeleteWorkoutUseCase(WorkoutRepositoryImpl())
) : ViewModel() {

    var uiState by mutableStateOf(WorkoutDetailUiState())
        private set

    init {
        loadWorkout()
    }

    private fun loadWorkout() {
        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            getWorkoutByIdUseCase(workoutId)
                .onSuccess { workout ->
                    val currentUserId = SupabaseClient.client.auth.currentUserOrNull()?.id
                    uiState = uiState.copy(
                        workout = workout,
                        isOwner = workout.userId == currentUserId,
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

    fun onShowDeleteDialog() {
        uiState = uiState.copy(showDeleteDialog = true)
    }

    fun onDismissDeleteDialog() {
        uiState = uiState.copy(showDeleteDialog = false)
    }

    fun onDeleteWorkout() {
        uiState = uiState.copy(isDeleting = true, showDeleteDialog = false)

        viewModelScope.launch {
            deleteWorkoutUseCase(workoutId)
                .onSuccess {
                    uiState = uiState.copy(isDeleted = true, isDeleting = false)
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_unknown),
                        isDeleting = false
                    )
                }
        }
    }

    companion object {
        fun factory(workoutId: Int): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    val repo = WorkoutRepositoryImpl()
                    return WorkoutDetailViewModel(
                        workoutId = workoutId,
                        getWorkoutByIdUseCase = GetWorkoutByIdUseCase(repo),
                        deleteWorkoutUseCase = DeleteWorkoutUseCase(repo)
                    ) as T
                }
            }
        }
    }
}
