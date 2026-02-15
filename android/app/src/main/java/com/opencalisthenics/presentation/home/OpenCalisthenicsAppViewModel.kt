package com.opencalisthenics.presentation.home

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.SavedStateHandle
import androidx.lifecycle.ViewModel
import com.opencalisthenics.navigation.AppDestinations

class OpenCalisthenicsAppViewModel(
    private val savedStateHandle: SavedStateHandle
) : ViewModel() {
    var currentDestination by mutableStateOf(
        savedStateHandle.get<AppDestinations>(KEY_DESTINATION) ?: AppDestinations.EXERCISES
    )
        private set

    fun onDestinationSelected(destination: AppDestinations) {
        currentDestination = destination
        savedStateHandle[KEY_DESTINATION] = destination
    }

    private companion object {
        private const val KEY_DESTINATION = "current_destination"
    }
}
