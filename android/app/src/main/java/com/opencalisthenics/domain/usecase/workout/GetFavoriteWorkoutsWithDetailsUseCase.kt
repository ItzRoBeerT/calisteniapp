package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.repository.WorkoutRepository

class GetFavoriteWorkoutsWithDetailsUseCase(private val repo: WorkoutRepository) {
    suspend operator fun invoke(): Result<List<Workout>> = repo.getFavoriteWorkoutsWithDetails()
}
