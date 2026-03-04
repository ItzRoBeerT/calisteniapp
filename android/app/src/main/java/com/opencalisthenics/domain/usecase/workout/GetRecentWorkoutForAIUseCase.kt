package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.RecentWorkoutData
import com.opencalisthenics.domain.repository.AIWorkoutRepository

class GetRecentWorkoutForAIUseCase(
    private val aiWorkoutRepository: AIWorkoutRepository
) {
    suspend operator fun invoke(): Result<RecentWorkoutData?> {
        return aiWorkoutRepository.getRecentWorkout()
    }
}
