package com.opencalisthenics.presentation.user.auth.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.usecase.auth.SignInUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

data class LoginUiState(
    val email: String = "",
    val password: String = "",
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null,
    val emailError: UiText? = null,
    val passwordError: UiText? = null
)

class LoginViewModel(
    private val signInUseCase: SignInUseCase = SignInUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(LoginUiState())
        private set

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value, emailError = null)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value, passwordError = null)
    }

    fun submit(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(isLoading = true, errorMessage = null, emailError = null, passwordError = null)

        viewModelScope.launch {
            signInUseCase(uiState.email, uiState.password)
                .onSuccess { onSuccess() }
                .onFailure { e -> handleError(e) }
            uiState = uiState.copy(isLoading = false)
        }
    }

    private fun handleError(e: Throwable) {
        when (e) {
            is ValidationError.InvalidEmail ->
                uiState = uiState.copy(emailError = UiText.StringResource(R.string.error_invalid_email))
            is ValidationError.EmptyPassword ->
                uiState = uiState.copy(passwordError = UiText.StringResource(R.string.error_empty_password))
            is AppError ->
                uiState = uiState.copy(errorMessage = e.toUiText())
            else ->
                uiState = uiState.copy(errorMessage = UiText.StringResource(R.string.error_sign_in))
        }
    }
}
