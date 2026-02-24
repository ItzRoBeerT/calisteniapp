package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.GeneratedWorkout
import com.opencalisthenics.domain.model.RecentWorkoutData
import com.opencalisthenics.domain.repository.AIWorkoutRepository

class GenerateAIWorkoutUseCase(
    private val aiWorkoutRepository: AIWorkoutRepository
) {
    suspend operator fun invoke(
        exercises: List<Exercise>,
        recentWorkout: RecentWorkoutData?,
        workoutType: String,
        difficultyAdjustment: String,
        locale: String
    ): Result<GeneratedWorkout> {
        return aiWorkoutRepository.generate(exercises, recentWorkout, workoutType, difficultyAdjustment, locale)
    }
}
