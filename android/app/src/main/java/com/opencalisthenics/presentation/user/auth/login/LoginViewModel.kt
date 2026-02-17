package com.opencalisthenics.presentation.user.auth.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.usecase.auth.SignInUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import kotlinx.coroutines.launch

private val EMAIL_PATTERN = android.util.Patterns.EMAIL_ADDRESS

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

        val emailError = if (!EMAIL_PATTERN.matcher(uiState.email.trim()).matches())
            UiText.StringResource(R.string.error_invalid_email) else null
        val passwordError = if (uiState.password.isBlank())
            UiText.StringResource(R.string.error_empty_password) else null

        if (emailError != null || passwordError != null) {
            uiState = uiState.copy(emailError = emailError, passwordError = passwordError)
            return
        }

        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            signInUseCase(uiState.email.trim(), uiState.password)
                .onSuccess { onSuccess() }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_sign_in)
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
