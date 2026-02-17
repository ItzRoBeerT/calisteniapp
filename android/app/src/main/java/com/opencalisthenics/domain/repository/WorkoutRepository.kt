package com.opencalisthenics.domain.repository

import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.model.WorkoutCompletion
import com.opencalisthenics.domain.model.WorkoutFilters

interface WorkoutRepository {
    suspend fun getWorkouts(page: Int, limit: Int, filters: WorkoutFilters? = null): Result<List<Workout>>
    suspend fun getWorkoutById(id: Int): Result<Workout>
    suspend fun createWorkout(workout: Workout): Result<Workout>
    suspend fun updateWorkout(id: Int, workout: Workout): Result<Unit>
    suspend fun deleteWorkout(id: Int): Result<Unit>
    suspend fun toggleFavorite(workoutId: Int): Result<Boolean>
    suspend fun getFavoriteIds(): Result<List<Int>>
    suspend fun saveCompletion(completion: WorkoutCompletion): Result<Unit>
}
