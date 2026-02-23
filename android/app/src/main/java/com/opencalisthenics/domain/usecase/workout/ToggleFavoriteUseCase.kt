package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.repository.WorkoutRepository

class ToggleFavoriteUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(workoutId: Int): Result<Boolean> = repository.toggleFavorite(workoutId)
}
