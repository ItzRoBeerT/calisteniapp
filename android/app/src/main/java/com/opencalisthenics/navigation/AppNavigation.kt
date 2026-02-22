package com.opencalisthenics.navigation

import androidx.compose.animation.AnimatedContentTransitionScope
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.toRoute
import com.opencalisthenics.OpenCalisthenicsApp
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.presentation.exercise.exercise.ExerciseDetailScreen
import com.opencalisthenics.presentation.user.auth.login.LoginScreen
import com.opencalisthenics.presentation.user.auth.register.RegisterScreen
import com.opencalisthenics.presentation.workout.detail.WorkoutDetailScreen
import com.opencalisthenics.presentation.workout.form.WorkoutFormScreen
import com.opencalisthenics.presentation.workout.runner.WorkoutRunnerScreen
import com.opencalisthenics.presentation.workout.selection.WorkoutSelectionScreen
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.flow.first
import kotlinx.serialization.Serializable

@Serializable
object Login

@Serializable
object Register

@Serializable
object Home

@Serializable
data class ExerciseDetail(val exerciseId: Int)

@Serializable
data class WorkoutDetail(val workoutId: Int)

@Serializable
object WorkoutCreate

@Serializable
data class WorkoutEdit(val workoutId: Int)

@Serializable
data class WorkoutRunner(val workoutId: Int)

@Serializable
object WorkoutSelection

private const val ANIM_DURATION = 300

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    var startDestination by remember { mutableStateOf<Any?>(null) }

    LaunchedEffect(Unit) {
        val status = SupabaseClient.client.auth.sessionStatus.first { s ->
            s is SessionStatus.Authenticated || s is SessionStatus.NotAuthenticated
        }
        startDestination = if (status is SessionStatus.Authenticated) Home else Login
    }

    if (startDestination == null) return

    NavHost(
        navController = navController,
        startDestination = startDestination!!,
        enterTransition = {
            fadeIn(animationSpec = tween(ANIM_DURATION)) +
                slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.Start, tween(ANIM_DURATION))
        },
        exitTransition = {
            fadeOut(animationSpec = tween(ANIM_DURATION)) +
                slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.Start, tween(ANIM_DURATION))
        },
        popEnterTransition = {
            fadeIn(animationSpec = tween(ANIM_DURATION)) +
                slideIntoContainer(AnimatedContentTransitionScope.SlideDirection.End, tween(ANIM_DURATION))
        },
        popExitTransition = {
            fadeOut(animationSpec = tween(ANIM_DURATION)) +
                slideOutOfContainer(AnimatedContentTransitionScope.SlideDirection.End, tween(ANIM_DURATION))
        }
    ) {
        composable<Login> {
            LoginScreen(
                onLoginSuccess = {
                    navController.navigate(Home) {
                        popUpTo<Login> { inclusive = true }
                    }
                },
                onNavigateToRegister = {
                    navController.navigate(Register)
                }
            )
        }

        composable<Register> {
            RegisterScreen(
                onRegisterSuccess = {
                    navController.navigate(Login) {
                        popUpTo<Register> { inclusive = true }
                    }
                },
                onNavigateToLogin = {
                    navController.popBackStack()
                }
            )
        }

        composable<Home> { backStackEntry ->
            val workoutSavedAction = backStackEntry.savedStateHandle.get<String>("workout_saved_action")
            if (workoutSavedAction != null) {
                backStackEntry.savedStateHandle.remove<String>("workout_saved_action")
            }

            OpenCalisthenicsApp(
                workoutSavedAction = workoutSavedAction,
                onLogout = {
                    navController.navigate(Login) {
                        popUpTo<Home> { inclusive = true }
                    }
                },
                onDoWorkout = { workoutId ->
                    navController.navigate(WorkoutRunner(workoutId))
                },
                onOpenWorkoutSelection = {
                    navController.navigate(WorkoutSelection)
                },
                onAddWorkout = {
                    navController.navigate(WorkoutCreate)
                },
                onWorkoutClick = { workoutId ->
                    navController.navigate(WorkoutDetail(workoutId))
                },
                onExerciseClick = { exerciseId ->
                    navController.navigate(ExerciseDetail(exerciseId))
                }
            )
        }

        composable<ExerciseDetail> { backStackEntry ->
            val route = backStackEntry.toRoute<ExerciseDetail>()
            ExerciseDetailScreen(
                exerciseId = route.exerciseId,
                onBack = { navController.popBackStack() },
                onExerciseClick = { id -> navController.navigate(ExerciseDetail(id)) }
            )
        }

        composable<WorkoutDetail> { backStackEntry ->
            val route = backStackEntry.toRoute<WorkoutDetail>()
            WorkoutDetailScreen(
                workoutId = route.workoutId,
                onBack = { navController.popBackStack() },
                onEdit = { id -> navController.navigate(WorkoutEdit(id)) },
                onStartWorkout = { id -> navController.navigate(WorkoutRunner(id)) },
                onExerciseClick = { id -> navController.navigate(ExerciseDetail(id)) }
            )
        }

        composable<WorkoutCreate> {
            WorkoutFormScreen(
                onBack = { navController.popBackStack() },
                onSaveSuccess = {
                    navController.getBackStackEntry<Home>().savedStateHandle["workout_saved_action"] = "created"
                    navController.popBackStack()
                }
            )
        }

        composable<WorkoutEdit> { backStackEntry ->
            val route = backStackEntry.toRoute<WorkoutEdit>()
            WorkoutFormScreen(
                editWorkoutId = route.workoutId,
                onBack = { navController.popBackStack() },
                onSaveSuccess = {
                    navController.getBackStackEntry<Home>().savedStateHandle["workout_saved_action"] = "updated"
                    navController.popBackStack()
                }
            )
        }

        composable<WorkoutRunner> { backStackEntry ->
            val route = backStackEntry.toRoute<WorkoutRunner>()
            WorkoutRunnerScreen(
                workoutId = route.workoutId,
                onBack = { navController.popBackStack() }
            )
        }

        composable<WorkoutSelection> {
            WorkoutSelectionScreen(
                onWorkoutSelected = { workoutId ->
                    navController.navigate(WorkoutRunner(workoutId))
                },
                onBack = { navController.popBackStack() }
            )
        }
    }
}
