package com.opencalisthenics.presentation.workout.list

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FilterList
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Snackbar
import androidx.compose.material3.SnackbarHost
import androidx.compose.material3.SnackbarHostState
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.R
import com.opencalisthenics.presentation.workout.components.WorkoutCard
import com.opencalisthenics.presentation.workout.components.WorkoutFilterPanel
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.GrayText

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WorkoutsScreen(
    onWorkoutClick: (Int) -> Unit,
    onStartWorkout: (Int) -> Unit,
    onCreateWorkout: () -> Unit,
    workoutSavedAction: String? = null,
    viewModel: WorkoutsViewModel = viewModel(factory = WorkoutsViewModel.Factory)
) {
    val state = viewModel.uiState
    val snackbarHostState = remember { SnackbarHostState() }

    LaunchedEffect(workoutSavedAction) {
        if (workoutSavedAction != null) {
            viewModel.onWorkoutSaved(workoutSavedAction)
        }
    }

    val successText = state.successMessage?.asString()

    LaunchedEffect(successText) {
        successText?.let {
            snackbarHostState.showSnackbar(it)
            viewModel.onSuccessMessageShown()
        }
    }

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Background)
                .statusBarsPadding()
        ) {
            // Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = stringResource(R.string.workouts_title),
                    color = MaterialTheme.colorScheme.onSurface,
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                IconButton(onClick = viewModel::onToggleFilters) {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = stringResource(R.string.workouts_filter),
                        tint = if (state.showFilters) MaterialTheme.colorScheme.primary else GrayText
                    )
                }
            }

            // Filters
            AnimatedVisibility(visible = state.showFilters) {
                WorkoutFilterPanel(
                    selectedDifficulty = state.selectedDifficulty,
                    selectedMuscleGroup = state.selectedMuscleGroup,
                    availableMuscleGroups = state.availableMuscleGroups,
                    onDifficultySelected = viewModel::onDifficultySelected,
                    onMuscleGroupSelected = viewModel::onMuscleGroupSelected
                )
            }

            // Content
            PullToRefreshBox(
                isRefreshing = state.isRefreshing,
                onRefresh = viewModel::onRefresh,
                modifier = Modifier.weight(1f)
            ) {
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

                    state.errorMessage != null -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = state.errorMessage.asString(),
                                color = MaterialTheme.colorScheme.error,
                                textAlign = TextAlign.Center
                            )
                        }
                    }

                    state.workouts.isEmpty() -> {
                        Box(
                            modifier = Modifier.fillMaxSize(),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                Text(
                                    text = stringResource(R.string.workouts_empty),
                                    color = GrayText,
                                    fontSize = 16.sp
                                )
                                Spacer(modifier = Modifier.height(12.dp))
                                TextButton(onClick = onCreateWorkout) {
                                    Text(
                                        text = stringResource(R.string.workouts_empty_cta),
                                        color = MaterialTheme.colorScheme.primary,
                                        fontWeight = FontWeight.Medium
                                    )
                                }
                            }
                        }
                    }

                    else -> {
                        Column(modifier = Modifier.fillMaxSize()) {
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(2),
                                contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                                verticalArrangement = Arrangement.spacedBy(12.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                items(
                                    items = state.workouts,
                                    key = { it.id }
                                ) { workout ->
                                    WorkoutCard(
                                        workout = workout,
                                        isFavorite = workout.id in state.favoriteIds,
                                        isOwner = workout.userId == state.currentUserId,
                                        onCardClick = { onWorkoutClick(workout.id) },
                                        onFavoriteClick = { viewModel.onToggleFavorite(workout.id) },
                                        onPlayClick = { onStartWorkout(workout.id) }
                                    )
                                }
                            }

                            // Pagination
                            if (state.currentPage > 1 || state.hasMorePages) {
                                Row(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(16.dp),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    TextButton(
                                        onClick = viewModel::onPreviousPage,
                                        enabled = state.currentPage > 1
                                    ) {
                                        Text(stringResource(R.string.workouts_previous))
                                    }
                                    Text(
                                        text = stringResource(R.string.workouts_page, state.currentPage),
                                        color = GrayText,
                                        fontSize = 14.sp
                                    )
                                    TextButton(
                                        onClick = viewModel::onNextPage,
                                        enabled = state.hasMorePages
                                    ) {
                                        Text(stringResource(R.string.workouts_next))
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        SnackbarHost(
            hostState = snackbarHostState,
            modifier = Modifier.align(Alignment.BottomCenter)
        ) { data ->
            Snackbar(
                snackbarData = data,
                containerColor = MaterialTheme.colorScheme.secondary,
                contentColor = MaterialTheme.colorScheme.onSecondary
            )
        }
    }
}
