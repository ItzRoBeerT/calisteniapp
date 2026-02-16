package com.opencalisthenics.presentation.user.auth.register

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.usecase.auth.SignUpUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

private val EMAIL_PATTERN = android.util.Patterns.EMAIL_ADDRESS

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

        uiState = uiState.copy(errorMessage = null, successMessage = null)

        val emailError = if (!EMAIL_PATTERN.matcher(uiState.email.trim()).matches())
            UiText.StringResource(R.string.error_invalid_email) else null
        val passwordError = if (uiState.password.length < 6)
            UiText.StringResource(R.string.error_password_too_short) else null
        val confirmPasswordError = if (uiState.password != uiState.confirmPassword)
            UiText.StringResource(R.string.error_passwords_dont_match) else null

        if (emailError != null || passwordError != null || confirmPasswordError != null) {
            uiState = uiState.copy(
                emailError = emailError,
                passwordError = passwordError,
                confirmPasswordError = confirmPasswordError
            )
            return
        }

        uiState = uiState.copy(isLoading = true)

        viewModelScope.launch {
            signUpUseCase(uiState.email.trim(), uiState.password)
                .onSuccess {
                    uiState = uiState.copy(
                        successMessage = UiText.StringResource(R.string.register_check_email)
                    )
                    onSuccess()
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_create_account)
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
