package com.opencalisthenics.presentation.user.auth.register

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.usecase.auth.SignUpUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

data class RegisterUiState(
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null,
    val successMessage: UiText? = null,
    val emailError: UiText? = null,
    val passwordError: UiText? = null,
    val confirmPasswordError: UiText? = null
)

class RegisterViewModel(
    private val signUpUseCase: SignUpUseCase = SignUpUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(RegisterUiState())
        private set

    fun onEmailChange(value: String) {
        uiState = uiState.copy(email = value, emailError = null)
    }

    fun onPasswordChange(value: String) {
        uiState = uiState.copy(password = value, passwordError = null)
    }

    fun onConfirmPasswordChange(value: String) {
        uiState = uiState.copy(confirmPassword = value, confirmPasswordError = null)
    }

    fun submit(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(
            isLoading = true,
            errorMessage = null,
            successMessage = null,
            emailError = null,
            passwordError = null,
            confirmPasswordError = null
        )

        viewModelScope.launch {
            signUpUseCase(uiState.email, uiState.password, uiState.confirmPassword)
                .onSuccess {
                    uiState = uiState.copy(
                        successMessage = UiText.StringResource(R.string.register_check_email)
                    )
                    onSuccess()
                }
                .onFailure { e -> handleError(e) }
            uiState = uiState.copy(isLoading = false)
        }
    }

    private fun handleError(e: Throwable) {
        when (e) {
            is ValidationError.InvalidEmail ->
                uiState = uiState.copy(emailError = UiText.StringResource(R.string.error_invalid_email))
            is ValidationError.PasswordTooShort ->
                uiState = uiState.copy(passwordError = UiText.StringResource(R.string.error_password_too_short))
            is ValidationError.PasswordsMismatch ->
                uiState = uiState.copy(confirmPasswordError = UiText.StringResource(R.string.error_passwords_dont_match))
            is AppError ->
                uiState = uiState.copy(errorMessage = e.toUiText())
            else ->
                uiState = uiState.copy(errorMessage = UiText.StringResource(R.string.error_create_account))
        }
    }
}
