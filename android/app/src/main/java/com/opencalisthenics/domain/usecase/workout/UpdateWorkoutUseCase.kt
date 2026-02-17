package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.repository.WorkoutRepository

class UpdateWorkoutUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(id: Int, workout: Workout): Result<Unit> {
        if (workout.name.isBlank()) {
            return Result.failure(IllegalArgumentException("Workout name is required"))
        }
        if (workout.exercises.isEmpty()) {
            return Result.failure(IllegalArgumentException("At least one exercise is required"))
        }
        return repository.updateWorkout(id, workout)
    }
}
