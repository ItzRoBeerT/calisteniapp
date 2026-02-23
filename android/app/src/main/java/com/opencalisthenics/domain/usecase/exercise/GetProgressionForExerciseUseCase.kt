package com.opencalisthenics.domain.usecase.exercise

import com.opencalisthenics.domain.model.ExerciseProgression
import com.opencalisthenics.domain.repository.ExerciseRepository

class GetProgressionForExerciseUseCase(private val repository: ExerciseRepository) {
    suspend operator fun invoke(id: Int): Result<ExerciseProgression?> =
        repository.getProgressionForExercise(id)
}
