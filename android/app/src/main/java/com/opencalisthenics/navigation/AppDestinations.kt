package com.opencalisthenics.navigation

import androidx.annotation.StringRes
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
import com.opencalisthenics.R

enum class AppDestinations(
    @StringRes val labelRes: Int,
    val icon: ImageVector,
    val selectedIcon: ImageVector,
) {
    EXERCISES(R.string.nav_exercises, Icons.Outlined.FitnessCenter, Icons.Filled.FitnessCenter),
    WORKOUTS(R.string.nav_workouts, Icons.Outlined.Timer, Icons.Filled.Timer),
    ROADMAPS(R.string.nav_roadmaps, Icons.Outlined.Map, Icons.Filled.Map),
    PROFILE(R.string.nav_profile, Icons.Outlined.Person, Icons.Filled.Person),
}
