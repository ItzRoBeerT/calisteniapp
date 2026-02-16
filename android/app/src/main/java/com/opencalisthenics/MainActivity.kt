package com.opencalisthenics

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewScreenSizes
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.navigation.AppDestinations
import com.opencalisthenics.navigation.AppNavigation
import com.opencalisthenics.presentation.common.AppBottomBar
import com.opencalisthenics.presentation.common.PlaceholderScreen
import com.opencalisthenics.presentation.exercise.exercises.ExercisesScreen
import com.opencalisthenics.presentation.common.WorkoutFabMenu
import com.opencalisthenics.presentation.home.OpenCalisthenicsAppViewModel
import com.opencalisthenics.presentation.user.profile.ProfileScreen
import com.opencalisthenics.ui.theme.OpenCalisthenicsTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge(
            statusBarStyle = SystemBarStyle.dark(android.graphics.Color.TRANSPARENT),
            navigationBarStyle = SystemBarStyle.dark(android.graphics.Color.TRANSPARENT)
        )
        setContent {
            OpenCalisthenicsTheme {
                AppNavigation()
            }
        }
    }
}

@PreviewScreenSizes
@Composable
fun OpenCalisthenicsApp(
    onLogout: () -> Unit = {},
    onDoWorkout: () -> Unit = {},
    onAddWorkout: () -> Unit = {},
    onExerciseClick: (Int) -> Unit = {},
    viewModel: OpenCalisthenicsAppViewModel = viewModel()
) {
    val currentDestination = viewModel.currentDestination

    Scaffold(
        containerColor = MaterialTheme.colorScheme.background,
        contentWindowInsets = WindowInsets(0),
        bottomBar = {
            AppBottomBar(
                currentDestination = currentDestination,
                onDestinationSelected = viewModel::onDestinationSelected,
                fabContent = {
                    WorkoutFabMenu(
                        onDoWorkout = onDoWorkout,
                        onAddWorkout = onAddWorkout
                    )
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentDestination) {
                AppDestinations.EXERCISES -> ExercisesScreen(onExerciseClick = onExerciseClick)
                AppDestinations.PROFILE -> ProfileScreen(onLogout = onLogout)
                else -> PlaceholderScreen(currentDestination.label)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun AppPreview() {
    OpenCalisthenicsTheme {
        OpenCalisthenicsApp()
    }
}
