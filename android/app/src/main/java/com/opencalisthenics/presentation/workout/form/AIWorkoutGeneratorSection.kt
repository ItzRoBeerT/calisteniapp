package com.opencalisthenics.presentation.workout.form

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.expandVertically
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText

@Composable
fun AIWorkoutGeneratorSection(
    isOpen: Boolean,
    workoutType: String,
    difficultyAdjustment: String,
    isGenerating: Boolean,
    error: String?,
    recentWorkoutName: String?,
    onToggle: () -> Unit,
    onWorkoutTypeChanged: (String) -> Unit,
    onDifficultyAdjustmentChanged: (String) -> Unit,
    onGenerate: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .background(MaterialTheme.colorScheme.surface)
    ) {
        // Header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable(onClick = onToggle)
                .padding(horizontal = 16.dp, vertical = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Default.AutoAwesome,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.primary,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = stringResource(R.string.ai_workout_generate_with_ai),
                color = MaterialTheme.colorScheme.onSurface,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                modifier = Modifier.weight(1f)
            )
            Icon(
                imageVector = if (isOpen) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                contentDescription = null,
                tint = GrayText,
                modifier = Modifier.size(20.dp)
            )
        }

        AnimatedVisibility(
            visible = isOpen,
            enter = expandVertically(),
            exit = shrinkVertically()
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Recent workout hint
                if (recentWorkoutName != null) {
                    Text(
                        text = stringResource(R.string.ai_workout_based_on, recentWorkoutName),
                        color = GrayText,
                        fontSize = 12.sp
                    )
                }

                // Workout type selector
                Text(
                    text = stringResource(R.string.ai_workout_type),
                    color = GrayText,
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium
                )
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    listOf(
                        "push" to stringResource(R.string.ai_workout_type_push),
                        "pull" to stringResource(R.string.ai_workout_type_pull),
                        "legs" to stringResource(R.string.ai_workout_type_legs),
                        "full_body" to stringResource(R.string.ai_workout_type_full_body)
                    ).chunked(2).forEach { rowItems ->
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            rowItems.forEach { (value, label) ->
                                FilterChip(
                                    modifier = Modifier.weight(1f),
                                    selected = workoutType == value,
                                    onClick = { onWorkoutTypeChanged(value) },
                                    label = { Text(label, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.2f),
                                        selectedLabelColor = MaterialTheme.colorScheme.primary
                                    )
                                )
                            }
                        }
                    }
                }

                // Difficulty adjustment (only if user has history)
                if (recentWorkoutName != null) {
                    Text(
                        text = stringResource(R.string.ai_workout_difficulty_adj),
                        color = GrayText,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        listOf(
                            "easier" to stringResource(R.string.ai_workout_adj_easier),
                            "same" to stringResource(R.string.ai_workout_adj_same),
                            "harder" to stringResource(R.string.ai_workout_adj_harder)
                        ).forEach { (value, label) ->
                            FilterChip(
                                modifier = Modifier.weight(1f),
                                selected = difficultyAdjustment == value,
                                onClick = { onDifficultyAdjustmentChanged(value) },
                                label = { Text(label, fontSize = 12.sp) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = when (value) {
                                        "easier" -> MaterialTheme.colorScheme.tertiary.copy(alpha = 0.2f)
                                        "harder" -> ErrorRed.copy(alpha = 0.2f)
                                        else -> MaterialTheme.colorScheme.primary.copy(alpha = 0.2f)
                                    },
                                    selectedLabelColor = when (value) {
                                        "easier" -> MaterialTheme.colorScheme.tertiary
                                        "harder" -> ErrorRed
                                        else -> MaterialTheme.colorScheme.primary
                                    }
                                )
                            )
                        }
                    }
                }

                // Error
                if (error != null) {
                    Text(
                        text = error,
                        color = ErrorRed,
                        fontSize = 12.sp
                    )
                }

                // Generate button
                AppButton(
                    text = if (isGenerating)
                        stringResource(R.string.ai_workout_generating)
                    else
                        stringResource(R.string.ai_workout_generate),
                    onClick = onGenerate,
                    isLoading = isGenerating,
                    enabled = !isGenerating,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(44.dp)
                )

                Spacer(modifier = Modifier.height(0.dp))
            }
        }
    }
}
