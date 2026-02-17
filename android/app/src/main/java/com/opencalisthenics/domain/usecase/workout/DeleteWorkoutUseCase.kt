package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.repository.WorkoutRepository

class DeleteWorkoutUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(id: Int): Result<Unit> = repository.deleteWorkout(id)
}
