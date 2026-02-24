package com.opencalisthenics.presentation.workout.form

import android.app.Application
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.Remove
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun WorkoutFormScreen(
    editWorkoutId: Int? = null,
    onBack: () -> Unit,
    onSaveSuccess: () -> Unit = onBack,
    viewModel: WorkoutFormViewModel = viewModel(
        factory = WorkoutFormViewModel.factory(
            LocalContext.current.applicationContext as Application,
            editWorkoutId
        )
    )
) {
    val state = viewModel.uiState

    LaunchedEffect(state.isSaved) {
        if (state.isSaved) onSaveSuccess()
    }

    val textFieldColors = OutlinedTextFieldDefaults.colors(
        focusedTextColor = MaterialTheme.colorScheme.onSurface,
        unfocusedTextColor = MaterialTheme.colorScheme.onSurface,
        focusedBorderColor = MaterialTheme.colorScheme.primary,
        unfocusedBorderColor = GrayText.copy(alpha = 0.3f),
        cursorColor = MaterialTheme.colorScheme.primary,
        focusedLabelColor = MaterialTheme.colorScheme.primary,
        unfocusedLabelColor = GrayText
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .statusBarsPadding()
            .imePadding()
            .padding(top = 8.dp)
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBack) {
                Icon(
                    imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                    contentDescription = stringResource(R.string.workout_back),
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
            Text(
                text = stringResource(
                    if (state.isEditMode) R.string.workout_form_edit_title
                    else R.string.workout_form_create_title
                ),
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold
            )
        }

        when {
            state.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(
                        color = MaterialTheme.colorScheme.primary,
                        modifier = Modifier.size(48.dp)
                    )
                }
            }

            else -> {
                Column(
                    modifier = Modifier
                        .weight(1f)
                        .verticalScroll(rememberScrollState())
                        .padding(horizontal = 16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Spacer(modifier = Modifier.height(4.dp))

                    // AI Workout Generator (create mode only, requires API key)
                    if (!state.isEditMode && state.isAiEnabled) {
                        AIWorkoutGeneratorSection(
                            isOpen = state.isAiPanelOpen,
                            workoutType = state.aiWorkoutType,
                            difficultyAdjustment = state.aiDifficultyAdjustment,
                            isGenerating = state.isAiGenerating,
                            error = state.aiError,
                            recentWorkoutName = state.recentWorkout?.name,
                            onToggle = viewModel::onToggleAiPanel,
                            onWorkoutTypeChanged = viewModel::onAiWorkoutTypeChanged,
                            onDifficultyAdjustmentChanged = viewModel::onAiDifficultyAdjustmentChanged,
                            onGenerate = viewModel::onGenerateAIWorkout
                        )
                    }

                    // Name
                    OutlinedTextField(
                        value = state.name,
                        onValueChange = viewModel::onNameChanged,
                        label = { Text(stringResource(R.string.workout_form_name)) },
                        placeholder = { Text(stringResource(R.string.workout_form_name_placeholder)) },
                        singleLine = true,
                        colors = textFieldColors,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Description
                    OutlinedTextField(
                        value = state.description,
                        onValueChange = viewModel::onDescriptionChanged,
                        label = { Text(stringResource(R.string.workout_form_description)) },
                        placeholder = { Text(stringResource(R.string.workout_form_description_placeholder)) },
                        minLines = 2,
                        maxLines = 4,
                        colors = textFieldColors,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Difficulty
                    Text(
                        text = stringResource(R.string.workout_difficulty),
                        color = GrayText,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf("Beginner", "Intermediate", "Advanced").forEach { difficulty ->
                            FilterChip(
                                selected = state.difficulty == difficulty,
                                onClick = { viewModel.onDifficultySelected(difficulty) },
                                label = {
                                    Text(
                                        text = when (difficulty) {
                                            "Beginner" -> stringResource(R.string.difficulty_beginner)
                                            "Intermediate" -> stringResource(R.string.difficulty_intermediate)
                                            "Advanced" -> stringResource(R.string.difficulty_advanced)
                                            else -> difficulty
                                        },
                                        fontSize = 12.sp
                                    )
                                },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                                    selectedLabelColor = MaterialTheme.colorScheme.primary
                                )
                            )
                        }
                    }

                    // Visibility toggle
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = stringResource(
                                if (state.isPublic) R.string.workout_public
                                else R.string.workout_private
                            ),
                            color = MaterialTheme.colorScheme.onSurface,
                            fontSize = 15.sp
                        )
                        Switch(
                            checked = state.isPublic,
                            onCheckedChange = { viewModel.onVisibilityToggled() },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = MaterialTheme.colorScheme.primary,
                                checkedTrackColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.3f)
                            )
                        )
                    }

                    // Tags
                    Text(
                        text = stringResource(R.string.workout_tags),
                        color = GrayText,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = state.tagInput,
                            onValueChange = viewModel::onTagInputChanged,
                            placeholder = { Text(stringResource(R.string.workout_form_tag_placeholder)) },
                            singleLine = true,
                            colors = textFieldColors,
                            keyboardOptions = KeyboardOptions(imeAction = ImeAction.Done),
                            keyboardActions = KeyboardActions(onDone = { viewModel.onAddTag() }),
                            modifier = Modifier.weight(1f)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        IconButton(onClick = viewModel::onAddTag) {
                            Icon(
                                imageVector = Icons.Default.Add,
                                contentDescription = stringResource(R.string.workout_form_add_tag),
                                tint = MaterialTheme.colorScheme.primary
                            )
                        }
                    }
                    if (state.tags.isNotEmpty()) {
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalArrangement = Arrangement.spacedBy(6.dp)
                        ) {
                            state.tags.forEach { tag ->
                                Row(
                                    modifier = Modifier
                                        .clip(RoundedCornerShape(16.dp))
                                        .background(MaterialTheme.colorScheme.primary.copy(alpha = 0.15f))
                                        .padding(start = 10.dp, end = 4.dp, top = 4.dp, bottom = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = "#$tag",
                                        color = MaterialTheme.colorScheme.primary,
                                        fontSize = 13.sp
                                    )
                                    IconButton(
                                        onClick = { viewModel.onRemoveTag(tag) },
                                        modifier = Modifier.size(20.dp)
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Close,
                                            contentDescription = null,
                                            tint = MaterialTheme.colorScheme.primary,
                                            modifier = Modifier.size(14.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }

                    // Exercise search
                    Text(
                        text = stringResource(R.string.workout_exercises),
                        color = MaterialTheme.colorScheme.onSurface,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                    OutlinedTextField(
                        value = state.exerciseSearchQuery,
                        onValueChange = viewModel::onExerciseSearchChanged,
                        placeholder = { Text(stringResource(R.string.workout_form_add_exercise)) },
                        singleLine = true,
                        colors = textFieldColors,
                        modifier = Modifier.fillMaxWidth()
                    )

                    // Search results
                    if (state.exerciseSearchResults.isNotEmpty()) {
                        Column(
                            modifier = Modifier
                                .clip(RoundedCornerShape(8.dp))
                                .background(MaterialTheme.colorScheme.surface)
                        ) {
                            state.exerciseSearchResults.forEach { exercise ->
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .clickable { viewModel.onAddExercise(exercise) }
                                        .padding(12.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(
                                        text = exercise.name,
                                        color = MaterialTheme.colorScheme.onSurface,
                                        fontSize = 14.sp,
                                        modifier = Modifier.weight(1f)
                                    )
                                    Icon(
                                        imageVector = Icons.Default.Add,
                                        contentDescription = null,
                                        tint = MaterialTheme.colorScheme.primary,
                                        modifier = Modifier.size(20.dp)
                                    )
                                }
                            }
                        }
                    }

                    // Added exercises
                    state.exercises.forEachIndexed { index, exercise ->
                        ExerciseFormItem(
                            exercise = exercise,
                            onRemove = { viewModel.onRemoveExercise(index) },
                            onSetsChange = { viewModel.onUpdateExerciseSets(index, it) },
                            onRepsChange = { viewModel.onUpdateExerciseReps(index, it) },
                            onRestChange = { viewModel.onUpdateExerciseRest(index, it) }
                        )
                    }

                    // Estimated duration
                    if (state.exercises.isNotEmpty()) {
                        Text(
                            text = stringResource(
                                R.string.workout_form_estimated_duration,
                                state.estimatedDuration / 60
                            ),
                            color = GrayText,
                            fontSize = 13.sp
                        )
                    }

                    // Error
                    if (state.errorMessage != null) {
                        Text(
                            text = state.errorMessage.asString(),
                            color = ErrorRed,
                            fontSize = 13.sp,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    // Save button
                    AppButton(
                        text = stringResource(
                            if (state.isEditMode) R.string.workout_form_save
                            else R.string.workout_form_create
                        ),
                        onClick = viewModel::onSave,
                        isLoading = state.isSaving,
                        enabled = state.exercises.isNotEmpty() && state.name.isNotBlank(),
                        modifier = Modifier.fillMaxWidth()
                    )

                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }
}

@Composable
private fun ExerciseFormItem(
    exercise: com.opencalisthenics.domain.model.ExerciseWorkout,
    onRemove: () -> Unit,
    onSetsChange: (Int) -> Unit,
    onRepsChange: (Int) -> Unit,
    onRestChange: (Int) -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .background(MaterialTheme.colorScheme.surface)
            .padding(12.dp)
    ) {
        // Header: name + remove button
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = exercise.name,
                color = MaterialTheme.colorScheme.onSurface,
                fontWeight = FontWeight.Medium,
                fontSize = 14.sp,
                modifier = Modifier.weight(1f)
            )
            IconButton(
                onClick = onRemove,
                modifier = Modifier.size(24.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Close,
                    contentDescription = null,
                    tint = ErrorRed,
                    modifier = Modifier.size(18.dp)
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Sets / Reps / Rest controls
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            NumberControl(
                label = stringResource(R.string.workout_sets),
                value = exercise.sets,
                onValueChange = onSetsChange
            )
            NumberControl(
                label = stringResource(R.string.workout_reps),
                value = exercise.reps,
                onValueChange = onRepsChange
            )
            NumberControl(
                label = stringResource(R.string.workout_rest),
                value = exercise.rest,
                onValueChange = onRestChange,
                step = 15
            )
        }
    }
}

@Composable
private fun NumberControl(
    label: String,
    value: Int,
    onValueChange: (Int) -> Unit,
    step: Int = 1
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = label,
            color = GrayText,
            fontSize = 11.sp
        )
        Row(
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { onValueChange(value - step) },
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Remove,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
            }
            Text(
                text = value.toString(),
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.width(36.dp),
                textAlign = TextAlign.Center
            )
            IconButton(
                onClick = { onValueChange(value + step) },
                modifier = Modifier.size(28.dp)
            ) {
                Icon(
                    imageVector = Icons.Default.Add,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
    }
}
