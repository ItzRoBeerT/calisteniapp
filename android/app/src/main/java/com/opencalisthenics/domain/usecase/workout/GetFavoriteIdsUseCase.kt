package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.repository.WorkoutRepository

class GetFavoriteIdsUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(): Result<List<Int>> = repository.getFavoriteIds()
}
