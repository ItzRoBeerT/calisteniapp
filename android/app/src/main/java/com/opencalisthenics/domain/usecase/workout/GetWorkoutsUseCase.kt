package com.opencalisthenics.domain.usecase.workout

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.model.WorkoutFilters
import com.opencalisthenics.domain.repository.WorkoutRepository

class GetWorkoutsUseCase(
    private val repository: WorkoutRepository
) {
    suspend operator fun invoke(
        page: Int = 1,
        limit: Int = 12,
        filters: WorkoutFilters? = null
    ): Result<List<Workout>> = repository.getWorkouts(page, limit, filters)
}
