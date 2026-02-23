package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.repository.WorkoutRepository

class CreateWorkoutUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(workout: Workout): Result<Workout> {
        if (workout.name.isBlank()) {
            return Result.failure(IllegalArgumentException("Workout name is required"))
        }
        if (workout.exercises.isEmpty()) {
            return Result.failure(IllegalArgumentException("At least one exercise is required"))
        }
        return repository.createWorkout(workout)
    }
}
