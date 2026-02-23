package com.opencalisthenics.domain.usecase.exercise

import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.repository.ExerciseRepository

class GetExerciseByIdUseCase(
    private val repository: ExerciseRepository
) {
    suspend operator fun invoke(id: Int): Result<Exercise> {
        return repository.getExerciseById(id)
    }
}
