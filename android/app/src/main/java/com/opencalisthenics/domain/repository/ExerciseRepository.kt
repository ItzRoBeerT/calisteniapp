package com.opencalisthenics.domain.repository

import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.ExerciseProgression

interface ExerciseRepository {
    suspend fun getExercises(): Result<List<Exercise>>
    suspend fun getExerciseById(id: Int): Result<Exercise>
    suspend fun getProgressionForExercise(id: Int): Result<ExerciseProgression?>
}
