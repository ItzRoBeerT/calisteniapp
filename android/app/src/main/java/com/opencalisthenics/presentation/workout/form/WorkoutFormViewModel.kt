package com.opencalisthenics.presentation.workout.form

import android.app.Application
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.ExerciseRepositoryImpl
import com.opencalisthenics.data.repository.WorkoutRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.domain.model.ExerciseWorkout
import com.opencalisthenics.domain.model.Workout
import com.opencalisthenics.domain.usecase.exercise.GetExercisesUseCase
import com.opencalisthenics.domain.usecase.workout.CreateWorkoutUseCase
import com.opencalisthenics.domain.usecase.workout.GetWorkoutByIdUseCase
import com.opencalisthenics.domain.usecase.workout.UpdateWorkoutUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

data class WorkoutFormUiState(
    val name: String = "",
    val description: String = "",
    val difficulty: String = "",
    val isPublic: Boolean = true,
    val tags: List<String> = emptyList(),
    val tagInput: String = "",
    val exercises: List<ExerciseWorkout> = emptyList(),
    val availableExercises: List<Exercise> = emptyList(),
    val exerciseSearchQuery: String = "",
    val exerciseSearchResults: List<Exercise> = emptyList(),
    val estimatedDuration: Int = 0,
    val isEditMode: Boolean = false,
    val isLoading: Boolean = false,
    val isSaving: Boolean = false,
    val isSaved: Boolean = false,
    val errorMessage: UiText? = null
)

class WorkoutFormViewModel(
    private val editWorkoutId: Int? = null,
    private val getExercisesUseCase: GetExercisesUseCase,
    private val createWorkoutUseCase: CreateWorkoutUseCase = CreateWorkoutUseCase(WorkoutRepositoryImpl()),
    private val updateWorkoutUseCase: UpdateWorkoutUseCase = UpdateWorkoutUseCase(WorkoutRepositoryImpl()),
    private val getWorkoutByIdUseCase: GetWorkoutByIdUseCase = GetWorkoutByIdUseCase(WorkoutRepositoryImpl())
) : ViewModel() {

    var uiState by mutableStateOf(WorkoutFormUiState(isEditMode = editWorkoutId != null))
        private set

    init {
        loadExercises()
        if (editWorkoutId != null) {
            loadWorkoutForEdit(editWorkoutId)
        }
    }

    private fun loadExercises() {
        viewModelScope.launch {
            getExercisesUseCase()
                .onSuccess { exercises ->
                    uiState = uiState.copy(availableExercises = exercises)
                }
        }
    }

    private fun loadWorkoutForEdit(id: Int) {
        uiState = uiState.copy(isLoading = true)

        viewModelScope.launch {
            getWorkoutByIdUseCase(id)
                .onSuccess { workout ->
                    uiState = uiState.copy(
                        name = workout.name,
                        description = workout.description,
                        difficulty = workout.difficulty,
                        isPublic = workout.isPublic,
                        tags = workout.tags,
                        exercises = workout.exercises,
                        estimatedDuration = calculateDuration(workout.exercises),
                        isLoading = false
                    )
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_unknown),
                        isLoading = false
                    )
                }
        }
    }

    fun onNameChanged(name: String) {
        uiState = uiState.copy(name = name)
    }

    fun onDescriptionChanged(description: String) {
        uiState = uiState.copy(description = description)
    }

    fun onDifficultySelected(difficulty: String) {
        uiState = uiState.copy(
            difficulty = if (uiState.difficulty == difficulty) "" else difficulty
        )
    }

    fun onVisibilityToggled() {
        uiState = uiState.copy(isPublic = !uiState.isPublic)
    }

    fun onTagInputChanged(input: String) {
        uiState = uiState.copy(tagInput = input)
    }

    fun onAddTag() {
        val tag = uiState.tagInput.trim()
        if (tag.isNotBlank() && tag !in uiState.tags) {
            uiState = uiState.copy(
                tags = uiState.tags + tag,
                tagInput = ""
            )
        }
    }

    fun onRemoveTag(tag: String) {
        uiState = uiState.copy(tags = uiState.tags - tag)
    }

    fun onExerciseSearchChanged(query: String) {
        uiState = uiState.copy(exerciseSearchQuery = query)
        val existingIds = uiState.exercises.mapNotNull { it.exerciseId }.toSet()
        val results = if (query.isBlank()) {
            emptyList()
        } else {
            uiState.availableExercises.filter {
                it.id !in existingIds &&
                    it.name.contains(query, ignoreCase = true)
            }.take(5)
        }
        uiState = uiState.copy(exerciseSearchResults = results)
    }

    fun onAddExercise(exercise: Exercise) {
        val exerciseWorkout = ExerciseWorkout(
            exerciseId = exercise.id,
            name = exercise.name,
            sets = 3,
            reps = 10,
            rest = 60,
            muscleGroups = exercise.muscleGroups,
            image = exercise.image
        )
        val updated = uiState.exercises + exerciseWorkout
        uiState = uiState.copy(
            exercises = updated,
            exerciseSearchQuery = "",
            exerciseSearchResults = emptyList(),
            estimatedDuration = calculateDuration(updated)
        )
    }

    fun onRemoveExercise(index: Int) {
        val updated = uiState.exercises.toMutableList().apply { removeAt(index) }
        uiState = uiState.copy(
            exercises = updated,
            estimatedDuration = calculateDuration(updated)
        )
    }

    fun onUpdateExerciseSets(index: Int, sets: Int) {
        val updated = uiState.exercises.toMutableList().apply {
            this[index] = this[index].copy(sets = sets.coerceAtLeast(1))
        }
        uiState = uiState.copy(
            exercises = updated,
            estimatedDuration = calculateDuration(updated)
        )
    }

    fun onUpdateExerciseReps(index: Int, reps: Int) {
        val updated = uiState.exercises.toMutableList().apply {
            this[index] = this[index].copy(reps = reps.coerceAtLeast(1))
        }
        uiState = uiState.copy(
            exercises = updated,
            estimatedDuration = calculateDuration(updated)
        )
    }

    fun onUpdateExerciseRest(index: Int, rest: Int) {
        val updated = uiState.exercises.toMutableList().apply {
            this[index] = this[index].copy(rest = rest.coerceAtLeast(0))
        }
        uiState = uiState.copy(
            exercises = updated,
            estimatedDuration = calculateDuration(updated)
        )
    }

    fun onSave() {
        if (uiState.name.isBlank()) {
            uiState = uiState.copy(errorMessage = UiText.StringResource(R.string.workout_form_name))
            return
        }
        if (uiState.exercises.isEmpty()) {
            uiState = uiState.copy(errorMessage = UiText.StringResource(R.string.workout_form_no_exercises))
            return
        }

        uiState = uiState.copy(isSaving = true, errorMessage = null)

        val workout = Workout(
            name = uiState.name,
            description = uiState.description,
            difficulty = uiState.difficulty,
            isPublic = uiState.isPublic,
            exercises = uiState.exercises,
            tags = uiState.tags
        )

        viewModelScope.launch {
            val result = if (editWorkoutId != null) {
                updateWorkoutUseCase(editWorkoutId, workout).map { workout }
            } else {
                createWorkoutUseCase(workout)
            }

            result
                .onSuccess {
                    uiState = uiState.copy(isSaved = true, isSaving = false)
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_unknown),
                        isSaving = false
                    )
                }
        }
    }

    private fun calculateDuration(exercises: List<ExerciseWorkout>): Int {
        return exercises.sumOf { ex ->
            (4 * ex.reps * ex.sets) + (ex.rest * ex.sets)
        }
    }

    companion object {
        fun factory(application: Application, editWorkoutId: Int? = null): ViewModelProvider.Factory {
            return object : ViewModelProvider.Factory {
                @Suppress("UNCHECKED_CAST")
                override fun <T : ViewModel> create(modelClass: Class<T>): T {
                    val workoutRepo = WorkoutRepositoryImpl()
                    return WorkoutFormViewModel(
                        editWorkoutId = editWorkoutId,
                        getExercisesUseCase = GetExercisesUseCase(ExerciseRepositoryImpl(application.applicationContext)),
                        createWorkoutUseCase = CreateWorkoutUseCase(workoutRepo),
                        updateWorkoutUseCase = UpdateWorkoutUseCase(workoutRepo),
                        getWorkoutByIdUseCase = GetWorkoutByIdUseCase(workoutRepo)
                    ) as T
                }
            }
        }
    }
}
