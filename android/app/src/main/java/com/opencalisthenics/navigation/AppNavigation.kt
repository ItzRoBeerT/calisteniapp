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
import com.opencalisthenics.OpenCalisthenicsApp
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.ui.auth.LoginScreen
import com.opencalisthenics.ui.auth.RegisterScreen
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.serialization.Serializable

@Serializable
object Login

@Serializable
object Register

@Serializable
object Home

private const val ANIM_DURATION = 300

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    var startDestination by remember { mutableStateOf<Any?>(null) }

    LaunchedEffect(Unit) {
        val status = SupabaseClient.client.auth.sessionStatus.value
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

        composable<Home> {
            OpenCalisthenicsApp(
                onLogout = {
                    navController.navigate(Login) {
                        popUpTo<Home> { inclusive = true }
                    }
                }
            )
        }
    }
}
