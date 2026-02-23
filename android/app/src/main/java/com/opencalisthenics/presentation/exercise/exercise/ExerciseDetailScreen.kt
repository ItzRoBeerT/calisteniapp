package com.opencalisthenics.presentation.exercise.exercise

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import coil3.compose.AsyncImage
import com.opencalisthenics.R
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.presentation.exercise.difficultyColor
import com.opencalisthenics.presentation.exercise.difficultyLabel
import com.opencalisthenics.presentation.exercise.muscleGroupLabel
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Primary600

@Composable
fun ExerciseDetailScreen(
    exerciseId: Int,
    onBack: () -> Unit,
    onExerciseClick: (Int) -> Unit = {},
    viewModel: ExerciseDetailViewModel = viewModel(
        factory = ExerciseDetailViewModel.factory(
            LocalContext.current.applicationContext as android.app.Application,
            exerciseId
        )
    )
) {
    val uiState = viewModel.uiState

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .statusBarsPadding()
    ) {
        IconButton(
            onClick = onBack,
            modifier = Modifier.padding(start = 4.dp, top = 8.dp)
        ) {
            Icon(
                imageVector = Icons.AutoMirrored.Filled.ArrowBack,
                contentDescription = stringResource(R.string.exercise_back),
                tint = MaterialTheme.colorScheme.onBackground
            )
        }

        when {
            uiState.isLoading -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator(color = Primary600)
                }
            }
            uiState.errorMessage != null -> {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = uiState.errorMessage!!.asString(),
                        color = ErrorRed,
                        fontSize = 14.sp
                    )
                }
            }
            uiState.exercise != null -> {
                ExerciseDetailContent(
                    exercise = uiState.exercise,
                    prerequisites = uiState.prerequisites,
                    variations = uiState.variations,
                    progressions = uiState.progressions,
                    onExerciseClick = onExerciseClick
                )
            }
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun ExerciseDetailContent(
    exercise: Exercise,
    prerequisites: List<Exercise> = emptyList(),
    variations: List<Exercise> = emptyList(),
    progressions: List<Exercise> = emptyList(),
    onExerciseClick: (Int) -> Unit = {}
) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
    ) {
        AsyncImage(
            model = exercise.image,
            contentDescription = exercise.name,
            contentScale = ContentScale.Crop,
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(16f / 9f)
        )

        Column(
            modifier = Modifier.padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text(
                text = exercise.name,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.onBackground
            )

            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                DifficultyBadge(difficulty = exercise.difficulty)
            }

            if (exercise.description.isNotBlank()) {
                Text(
                    text = exercise.description,
                    fontSize = 15.sp,
                    color = MaterialTheme.colorScheme.onBackground,
                    lineHeight = 22.sp
                )
            }

            DetailSection(title = stringResource(R.string.exercise_muscle_groups)) {
                FlowRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    exercise.muscleGroups.forEach { group ->
                        InfoChip(text = muscleGroupLabel(group))
                    }
                }
            }

            if (exercise.equipment.isNotEmpty()) {
                DetailSection(title = stringResource(R.string.exercise_equipment)) {
                    FlowRow(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        exercise.equipment.forEach { item ->
                            InfoChip(text = item)
                        }
                    }
                }
            }

            if (exercise.category.isNotBlank()) {
                DetailSection(title = stringResource(R.string.exercise_category)) {
                    Text(
                        text = exercise.category,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
            }

            if (exercise.type.isNotBlank()) {
                DetailSection(title = stringResource(R.string.exercise_type)) {
                    Text(
                        text = exercise.type,
                        fontSize = 14.sp,
                        color = MaterialTheme.colorScheme.onBackground
                    )
                }
            }

            val hasAnyProgression =
                prerequisites.isNotEmpty() || variations.isNotEmpty() || progressions.isNotEmpty()
            if (hasAnyProgression) {
                DetailSection(title = stringResource(R.string.exercise_progression_title)) {
                    ExerciseProgressionGraph(
                        current = exercise,
                        prerequisites = prerequisites,
                        variations = variations,
                        progressions = progressions,
                        onNodeClick = onExerciseClick,
                        modifier = Modifier.fillMaxWidth()
                    )
                }
            }
        }
    }
}

@Composable
private fun DifficultyBadge(difficulty: Int) {
    val color = difficultyColor(difficulty)
    Surface(
        color = color.copy(alpha = 0.15f),
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = difficultyLabel(difficulty),
            color = color,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        )
    }
}

@Composable
private fun DetailSection(
    title: String,
    content: @Composable () -> Unit
) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            text = title,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            color = GrayText,
            letterSpacing = 0.5.sp
        )
        content()
    }
}

@Composable
private fun InfoChip(text: String) {
    Surface(
        color = com.opencalisthenics.ui.theme.Surface,
        shape = RoundedCornerShape(8.dp)
    ) {
        Text(
            text = text,
            fontSize = 13.sp,
            color = MaterialTheme.colorScheme.onSurface,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp)
        )
    }
}
