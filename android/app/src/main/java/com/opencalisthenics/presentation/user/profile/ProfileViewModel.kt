package com.opencalisthenics.presentation.user.profile

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.usecase.auth.SignOutUseCase
import kotlinx.coroutines.launch

data class ProfileUiState(
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class ProfileViewModel(
    private val signOutUseCase: SignOutUseCase = SignOutUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(ProfileUiState())
        private set

    fun logout(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            signOutUseCase()
                .onSuccess { onSuccess() }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = e.message ?: "Error al cerrar sesion"
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
