package com.opencalisthenics.domain.repository

import com.opencalisthenics.domain.model.Exercise

interface ExerciseRepository {
    suspend fun getExercises(): Result<List<Exercise>>
}
