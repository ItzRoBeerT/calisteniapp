package com.opencalisthenics.presentation.user.auth.register

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.usecase.auth.SignUpUseCase
import com.opencalisthenics.presentation.common.UiText
import kotlinx.coroutines.launch

data class RegisterUiState(
    val email: String = "",
    val password: String = "",
    val confirmPassword: String = "",
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null,
    val successMessage: UiText? = null
)

class RegisterViewModel(
    private val signUpUseCase: SignUpUseCase = SignUpUseCase(AuthRepositoryImpl())
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

        if (uiState.password != uiState.confirmPassword) {
            uiState = uiState.copy(errorMessage = UiText.StringResource(R.string.error_passwords_dont_match))
            return
        }

        uiState = uiState.copy(isLoading = true)

        viewModelScope.launch {
            signUpUseCase(uiState.email, uiState.password)
                .onSuccess {
                    uiState = uiState.copy(
                        successMessage = UiText.StringResource(R.string.register_check_email)
                    )
                    onSuccess()
                }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = e.message?.let { UiText.DynamicString(it) }
                            ?: UiText.StringResource(R.string.error_create_account)
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }
}
