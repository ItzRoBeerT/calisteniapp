package com.opencalisthenics

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.SystemBarStyle
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.FitnessCenter
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Timer
import androidx.compose.material.icons.outlined.FitnessCenter
import androidx.compose.material.icons.outlined.Map
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Timer
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.foundation.shape.GenericShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupProperties
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.tooling.preview.PreviewScreenSizes
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.navigation.AppNavigation
import com.opencalisthenics.presentation.home.OpenCalisthenicsAppViewModel
import com.opencalisthenics.presentation.user.profile.ProfileScreen
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.OpenCalisthenicsTheme
import com.opencalisthenics.ui.theme.Primary500
import com.opencalisthenics.ui.theme.Surface

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
    viewModel: OpenCalisthenicsAppViewModel = viewModel()
) {
    val currentDestination = viewModel.currentDestination
    var showMenu by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = Background,
        contentWindowInsets = WindowInsets(0),
        bottomBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .windowInsetsPadding(WindowInsets.navigationBars)
            ) {
                NavigationBar(
                    containerColor = Surface,
                    tonalElevation = 0.dp,
                    modifier = Modifier.height(80.dp)
                ) {
                    val leftTabs = listOf(AppDestinations.EXERCISES, AppDestinations.WORKOUTS)
                    val rightTabs = listOf(AppDestinations.ROADMAPS, AppDestinations.PROFILE)

                    leftTabs.forEach { destination ->
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == destination) destination.selectedIcon else destination.icon,
                                    contentDescription = destination.label,
                                    modifier = Modifier.size(24.dp)
                                )
                            },
                            label = {
                                Text(
                                    text = destination.label,
                                    fontSize = 11.sp,
                                    fontWeight = if (currentDestination == destination) FontWeight.SemiBold else FontWeight.Normal
                                )
                            },
                            selected = currentDestination == destination,
                            onClick = { viewModel.onDestinationSelected(destination) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Primary500,
                                selectedTextColor = Primary500,
                                unselectedIconColor = GrayText,
                                unselectedTextColor = GrayText,
                                indicatorColor = Primary500.copy(alpha = 0.12f)
                            )
                        )
                    }

                    // Spacer for the FAB
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
                        NavigationBarItem(
                            icon = {
                                Icon(
                                    imageVector = if (currentDestination == destination) destination.selectedIcon else destination.icon,
                                    contentDescription = destination.label,
                                    modifier = Modifier.size(24.dp)
                                )
                            },
                            label = {
                                Text(
                                    text = destination.label,
                                    fontSize = 11.sp,
                                    fontWeight = if (currentDestination == destination) FontWeight.SemiBold else FontWeight.Normal
                                )
                            },
                            selected = currentDestination == destination,
                            onClick = { viewModel.onDestinationSelected(destination) },
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = Primary500,
                                selectedTextColor = Primary500,
                                unselectedIconColor = GrayText,
                                unselectedTextColor = GrayText,
                                indicatorColor = Primary500.copy(alpha = 0.12f)
                            )
                        )
                    }
                }

                // Centered FAB with popup menu
                Box(
                    modifier = Modifier
                        .align(Alignment.TopCenter)
                        .offset(y = (-28).dp)
                ) {
                    FloatingActionButton(
                        onClick = { showMenu = !showMenu },
                        shape = CircleShape,
                        containerColor = Primary500,
                        contentColor = Color.White,
                        elevation = FloatingActionButtonDefaults.elevation(
                            defaultElevation = 8.dp,
                            pressedElevation = 12.dp
                        ),
                        modifier = Modifier.size(64.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Add,
                            contentDescription = "Crear workout",
                            modifier = Modifier.size(32.dp)
                        )
                    }

                    if (showMenu) {
                        val arrowHeightDp = 10.dp
                        val arrowHeightPx = with(LocalDensity.current) { arrowHeightDp.toPx() }

                        Popup(
                            alignment = Alignment.BottomCenter,
                            offset = IntOffset(0, with(LocalDensity.current) { (-72).dp.roundToPx() }),
                            onDismissRequest = { showMenu = false },
                            properties = PopupProperties(focusable = true)
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally
                            ) {
                                // Menu card
                                Column(
                                    modifier = Modifier
                                        .shadow(8.dp, RoundedCornerShape(12.dp))
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(Surface)
                                        .padding(vertical = 8.dp),
                                    verticalArrangement = Arrangement.spacedBy(4.dp)
                                ) {
                                    Row(
                                        modifier = Modifier
                                            .clickable {
                                                showMenu = false
                                                onDoWorkout()
                                            }
                                            .padding(horizontal = 20.dp, vertical = 12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.PlayArrow,
                                            contentDescription = null,
                                            tint = Primary500,
                                            modifier = Modifier.size(24.dp)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Text(
                                            text = "Hacer workout",
                                            color = Color.White,
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                    Row(
                                        modifier = Modifier
                                            .clickable {
                                                showMenu = false
                                                onAddWorkout()
                                            }
                                            .padding(horizontal = 20.dp, vertical = 12.dp),
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.EditNote,
                                            contentDescription = null,
                                            tint = Primary500,
                                            modifier = Modifier.size(24.dp)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Text(
                                            text = "Añadir workout",
                                            color = Color.White,
                                            fontSize = 15.sp,
                                            fontWeight = FontWeight.Medium
                                        )
                                    }
                                }

                                // Triangle arrow pointing down
                                Box(
                                    modifier = Modifier
                                        .size(20.dp, arrowHeightDp)
                                        .clip(
                                            GenericShape { size, _ ->
                                                moveTo(0f, 0f)
                                                lineTo(size.width, 0f)
                                                lineTo(size.width / 2f, size.height)
                                                close()
                                            }
                                        )
                                        .background(Surface)
                                )
                            }
                        }
                    }
                }
            }
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when (currentDestination) {
                AppDestinations.PROFILE -> ProfileScreen(onLogout = onLogout)
                else -> PlaceholderScreen(currentDestination.label)
            }
        }
    }
}

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

@Composable
fun PlaceholderScreen(title: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = title,
            color = GrayText,
            fontSize = 18.sp
        )
    }
}

@Preview(showBackground = true)
@Composable
fun AppPreview() {
    OpenCalisthenicsTheme {
        OpenCalisthenicsApp()
    }
}
