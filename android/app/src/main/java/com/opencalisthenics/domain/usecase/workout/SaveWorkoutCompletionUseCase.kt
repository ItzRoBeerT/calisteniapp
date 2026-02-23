package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.WorkoutCompletion
import com.opencalisthenics.domain.repository.WorkoutRepository

class SaveWorkoutCompletionUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(completion: WorkoutCompletion): Result<Unit> =
        repository.saveCompletion(completion)
}
