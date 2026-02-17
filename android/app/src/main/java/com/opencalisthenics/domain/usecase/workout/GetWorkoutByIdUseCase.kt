package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.repository.WorkoutRepository

class GetWorkoutByIdUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(id: Int): Result<Workout> = repository.getWorkoutById(id)
}
