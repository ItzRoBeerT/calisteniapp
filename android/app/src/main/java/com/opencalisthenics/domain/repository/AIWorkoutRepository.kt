package com.opencalisthenics.domain.repository

import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.GeneratedWorkout
import com.opencalisthenics.domain.model.RecentWorkoutData

interface AIWorkoutRepository {
    suspend fun getRecentWorkout(): Result<RecentWorkoutData?>
    suspend fun generate(
        exercises: List<Exercise>,
        recentWorkout: RecentWorkoutData?,
        workoutType: String,
        difficultyAdjustment: String,
        locale: String
    ): Result<GeneratedWorkout>
}
