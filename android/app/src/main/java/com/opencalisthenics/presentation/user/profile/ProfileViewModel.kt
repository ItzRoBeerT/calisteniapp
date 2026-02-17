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
    val errorMessage: UiText? = null
)

class ProfileViewModel(
    private val signOutUseCase: SignOutUseCase = SignOutUseCase(AuthRepositoryImpl())
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
}
