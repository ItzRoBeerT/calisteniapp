package com.opencalisthenics.presentation.common

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.opencalisthenics.navigation.AppDestinations

@Composable
fun AppBottomBar(
    currentDestination: AppDestinations,
    onDestinationSelected: (AppDestinations) -> Unit,
    modifier: Modifier = Modifier,
    fabContent: @Composable () -> Unit = {}
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .background(MaterialTheme.colorScheme.surface)
            .windowInsetsPadding(WindowInsets.navigationBars)
    ) {
        NavigationBar(
            containerColor = MaterialTheme.colorScheme.surface,
            tonalElevation = 0.dp,
            modifier = Modifier.height(80.dp)
        ) {
            val leftTabs = listOf(AppDestinations.EXERCISES, AppDestinations.WORKOUTS)
            val rightTabs = listOf(AppDestinations.ROADMAPS, AppDestinations.PROFILE)

            leftTabs.forEach { destination ->
                AppNavItem(
                    destination = destination,
                    isSelected = currentDestination == destination,
                    onClick = { onDestinationSelected(destination) }
                )
            }

            // Spacer for the centered FAB
            NavigationBarItem(
                icon = {},
                label = {},
                selected = false,
                onClick = {},
                enabled = false,
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color.Transparent
                )
            )

            rightTabs.forEach { destination ->
                AppNavItem(
                    destination = destination,
                    isSelected = currentDestination == destination,
                    onClick = { onDestinationSelected(destination) }
                )
            }
        }

        Box(
            modifier = Modifier.align(Alignment.TopCenter)
        ) {
            fabContent()
        }
    }
}

@Composable
private fun RowScope.AppNavItem(
    destination: AppDestinations,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    NavigationBarItem(
        icon = {
            Icon(
                imageVector = if (isSelected) destination.selectedIcon else destination.icon,
                contentDescription = destination.label,
                modifier = Modifier.size(24.dp)
            )
        },
        label = {
            Text(
                text = destination.label,
                style = MaterialTheme.typography.labelSmall,
                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
            )
        },
        selected = isSelected,
        onClick = onClick,
        colors = NavigationBarItemDefaults.colors(
            selectedIconColor = MaterialTheme.colorScheme.primary,
            selectedTextColor = MaterialTheme.colorScheme.primary,
            unselectedIconColor = MaterialTheme.colorScheme.onSurfaceVariant,
            unselectedTextColor = MaterialTheme.colorScheme.onSurfaceVariant,
            indicatorColor = MaterialTheme.colorScheme.primary.copy(alpha = 0.12f)
        )
    )
}
