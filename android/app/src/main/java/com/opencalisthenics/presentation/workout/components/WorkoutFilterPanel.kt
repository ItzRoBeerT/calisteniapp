package com.opencalisthenics.presentation.workout.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.R
import com.opencalisthenics.presentation.exercise.muscleGroupLabel
import com.opencalisthenics.presentation.workout.workoutDifficultyColor
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Primary600

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun WorkoutFilterPanel(
    selectedDifficulty: String?,
    selectedMuscleGroup: String?,
    availableMuscleGroups: List<String>,
    onDifficultySelected: (String?) -> Unit,
    onMuscleGroupSelected: (String?) -> Unit,
    modifier: Modifier = Modifier
) {
    val difficulties = listOf("Beginner", "Intermediate", "Advanced")

    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        // Difficulty filter
        Text(
            text = stringResource(R.string.workout_difficulty),
            color = GrayText,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium
        )
        FlowRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            difficulties.forEach { difficulty ->
                val difficultyColor = workoutDifficultyColor(difficulty)
                FilterChip(
                    selected = selectedDifficulty == difficulty,
                    onClick = {
                        onDifficultySelected(
                            if (selectedDifficulty == difficulty) null else difficulty
                        )
                    },
                    label = {
                        Text(
                            text = when (difficulty) {
                                "Beginner" -> stringResource(R.string.difficulty_beginner)
                                "Intermediate" -> stringResource(R.string.difficulty_intermediate)
                                "Advanced" -> stringResource(R.string.difficulty_advanced)
                                else -> difficulty
                            },
                            fontSize = 13.sp
                        )
                    },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = difficultyColor,
                        selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                    )
                )
            }
        }

        // Muscle group filter
        if (availableMuscleGroups.isNotEmpty()) {
            Text(
                text = stringResource(R.string.exercise_muscle_groups),
                color = GrayText,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
            FlowRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                availableMuscleGroups.forEach { group ->
                    FilterChip(
                        selected = selectedMuscleGroup == group,
                        onClick = {
                            onMuscleGroupSelected(
                                if (selectedMuscleGroup == group) null else group
                            )
                        },
                        label = {
                            Text(
                                text = muscleGroupLabel(group),
                                fontSize = 13.sp
                            )
                        },
                        colors = FilterChipDefaults.filterChipColors(
                            selectedContainerColor = Primary600,
                            selectedLabelColor = MaterialTheme.colorScheme.onPrimary
                        )
                    )
                }
            }
        }
    }
}
