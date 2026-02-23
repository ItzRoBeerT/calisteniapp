package com.opencalisthenics.domain.usecase.exercise

import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.repository.ExerciseRepository

class GetExercisesUseCase(
    private val repository: ExerciseRepository
) {
    suspend operator fun invoke(): Result<List<Exercise>> = repository.getExercises()
}
