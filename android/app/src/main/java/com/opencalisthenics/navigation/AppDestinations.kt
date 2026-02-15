package com.opencalisthenics.navigation

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.FitnessCenter
import androidx.compose.material.icons.outlined.Map
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.ui.graphics.vector.ImageVector

enum class AppDestinations(
    val label: String,
    val icon: ImageVector,
    val selectedIcon: ImageVector,
) {
    EXERCISES("Ejercicios", Icons.Outlined.FitnessCenter, Icons.Filled.FitnessCenter),
    WORKOUTS("Workouts", Icons.Outlined.Timer, Icons.Filled.Timer),
    ROADMAPS("Roadmaps", Icons.Outlined.Map, Icons.Filled.Map),
    PROFILE("Perfil", Icons.Outlined.Person, Icons.Filled.Person),
}
