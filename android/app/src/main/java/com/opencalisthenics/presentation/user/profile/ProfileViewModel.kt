package com.opencalisthenics.presentation.user.profile

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.opencalisthenics.R
import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.data.repository.AuthRepositoryImpl
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.usecase.auth.ChangeEmailUseCase
import com.opencalisthenics.domain.usecase.auth.ChangePasswordUseCase
import com.opencalisthenics.domain.usecase.auth.SignOutUseCase
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.presentation.common.toUiText
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.status.SessionStatus
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Locale

data class ProfileUiState(
    val email: String = "",
    val initials: String = "?",
    val memberSince: String? = null,
    val isLoading: Boolean = false,
    val errorMessage: UiText? = null,
    // Change email dialog
    val showChangeEmailDialog: Boolean = false,
    val newEmail: String = "",
    val changeEmailError: UiText? = null,
    val isChangingEmail: Boolean = false,
    val changeEmailSuccess: UiText? = null,
    // Change password dialog
    val showChangePasswordDialog: Boolean = false,
    val newPassword: String = "",
    val confirmPassword: String = "",
    val changePasswordError: UiText? = null,
    val isChangingPassword: Boolean = false,
    val changePasswordSuccess: UiText? = null
)

class ProfileViewModel(
    private val signOutUseCase: SignOutUseCase = SignOutUseCase(AuthRepositoryImpl()),
    private val changeEmailUseCase: ChangeEmailUseCase = ChangeEmailUseCase(AuthRepositoryImpl()),
    private val changePasswordUseCase: ChangePasswordUseCase = ChangePasswordUseCase(AuthRepositoryImpl())
) : ViewModel() {
    var uiState by mutableStateOf(ProfileUiState())
        private set

    init {
        loadUserData()
    }

    private fun loadUserData() {
        viewModelScope.launch {
            val status = SupabaseClient.client.auth.sessionStatus.value
            if (status is SessionStatus.Authenticated) {
                val user = SupabaseClient.client.auth.currentUserOrNull()
                if (user != null) {
                    val email = user.email ?: ""
                    val initials = email.take(2).uppercase()
                    val createdAt = user.createdAt
                    val memberSince = createdAt?.let {
                        try {
                            val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
                            val date = inputFormat.parse(it.toString())
                            val outputFormat = SimpleDateFormat("MMMM yyyy", Locale.getDefault())
                            date?.let { d -> outputFormat.format(d) }
                        } catch (_: Exception) {
                            null
                        }
                    }

                    uiState = uiState.copy(
                        email = email,
                        initials = initials,
                        memberSince = memberSince
                    )
                }
            }
        }
    }

    fun logout(onSuccess: () -> Unit) {
        if (uiState.isLoading) return

        uiState = uiState.copy(isLoading = true, errorMessage = null)

        viewModelScope.launch {
            signOutUseCase()
                .onSuccess { onSuccess() }
                .onFailure { e ->
                    uiState = uiState.copy(
                        errorMessage = (e as? AppError)?.toUiText()
                            ?: UiText.StringResource(R.string.error_sign_out)
                    )
                }
            uiState = uiState.copy(isLoading = false)
        }
    }

    // Change email
    fun showChangeEmailDialog() {
        uiState = uiState.copy(
            showChangeEmailDialog = true,
            newEmail = "",
            changeEmailError = null,
            changeEmailSuccess = null
        )
    }

    fun dismissChangeEmailDialog() {
        uiState = uiState.copy(showChangeEmailDialog = false)
    }

    fun onNewEmailChange(value: String) {
        uiState = uiState.copy(newEmail = value, changeEmailError = null)
    }

    fun changeEmail() {
        if (uiState.isChangingEmail) return

        uiState = uiState.copy(isChangingEmail = true, changeEmailError = null, changeEmailSuccess = null)

        viewModelScope.launch {
            changeEmailUseCase(uiState.newEmail)
                .onSuccess {
                    uiState = uiState.copy(
                        changeEmailSuccess = UiText.StringResource(R.string.profile_change_email_success),
                        showChangeEmailDialog = false
                    )
                }
                .onFailure { e ->
                    val error = when (e) {
                        is ValidationError.InvalidEmail ->
                            UiText.StringResource(R.string.error_invalid_email)
                        is AppError ->
                            e.toUiText()
                        else ->
                            UiText.StringResource(R.string.error_unknown)
                    }
                    uiState = uiState.copy(changeEmailError = error)
                }
            uiState = uiState.copy(isChangingEmail = false)
        }
    }

    // Change password
    fun showChangePasswordDialog() {
        uiState = uiState.copy(
            showChangePasswordDialog = true,
            newPassword = "",
            confirmPassword = "",
            changePasswordError = null,
            changePasswordSuccess = null
        )
    }

    fun dismissChangePasswordDialog() {
        uiState = uiState.copy(showChangePasswordDialog = false)
    }

    fun onNewPasswordChange(value: String) {
        uiState = uiState.copy(newPassword = value, changePasswordError = null)
    }

    fun onConfirmPasswordChange(value: String) {
        uiState = uiState.copy(confirmPassword = value, changePasswordError = null)
    }

    fun changePassword() {
        if (uiState.isChangingPassword) return

        uiState = uiState.copy(isChangingPassword = true, changePasswordError = null, changePasswordSuccess = null)

        viewModelScope.launch {
            changePasswordUseCase(uiState.newPassword, uiState.confirmPassword)
                .onSuccess {
                    uiState = uiState.copy(
                        changePasswordSuccess = UiText.StringResource(R.string.profile_change_password_success),
                        showChangePasswordDialog = false
                    )
                }
                .onFailure { e ->
                    val error = when (e) {
                        is ValidationError.EmptyPassword ->
                            UiText.StringResource(R.string.error_empty_password)
                        is ValidationError.PasswordTooShort ->
                            UiText.StringResource(R.string.error_password_too_short)
                        is ValidationError.PasswordsMismatch ->
                            UiText.StringResource(R.string.error_passwords_dont_match)
                        is AppError ->
                            e.toUiText()
                        else ->
                            UiText.StringResource(R.string.error_unknown)
                    }
                    uiState = uiState.copy(changePasswordError = error)
                }
            uiState = uiState.copy(isChangingPassword = false)
        }
    }
}
