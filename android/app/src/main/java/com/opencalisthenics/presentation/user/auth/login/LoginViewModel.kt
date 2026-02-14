package com.opencalisthenics.presentation.user.auth.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.usecase.auth.SignInUseCase
import kotlinx.coroutines.launch

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: String? = null
)

class LoginViewModel(
    private val signInUseCase: SignInUseCase = SignInUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value)
    }

    fun submit(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            signInUseCase(uiState.email, uiState.password)
                .onSuccess { onSuccess() }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = e.message ?: "Error al iniciar sesion"
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
