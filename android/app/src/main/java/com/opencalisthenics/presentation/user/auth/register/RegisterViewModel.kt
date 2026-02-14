package com.opencalisthenics.presentation.user.auth.register

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.repository.AuthRepository
import kotlinx.coroutines.launch

data class RegisterUiState(
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null,
    val successMessage: String? = null
)

class RegisterViewModel(
    private val authRepository: AuthRepository = AuthRepositoryImpl()
) : ViewModel() {
    var uiState by mutableStateOf(RegisterUiState())
        private set

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value)
    }

    fun onConfirmPasswordChange(value: String) {
        uiState = uiState.copy(confirmPassword = value)
    }

    fun submit(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(errorMessage = null, successMessage = null)

        if (uiState.password.length < 6) {
            uiState = uiState.copy(errorMessage = "La contrasena debe tener al menos 6 caracteres")
            return
        }
        if (uiState.password != uiState.confirmPassword) {
            uiState = uiState.copy(errorMessage = "Las contrasenas no coinciden")
            return
        }

        uiState = uiState.copy(isLoading = true)

        viewModelScope.launch {
            authRepository.signUp(uiState.email, uiState.password)
                .onSuccess {
                    uiState = uiState.copy(
                        successMessage = "Revisa tu email para confirmar tu cuenta"
                    )
                    onSuccess()
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = e.message ?: "Error al crear la cuenta"
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
