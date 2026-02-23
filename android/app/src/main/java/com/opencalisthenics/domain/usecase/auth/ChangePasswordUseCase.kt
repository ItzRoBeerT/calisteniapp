package com.opencalisthenics.domain.usecase.auth

import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.repository.AuthRepository

class ChangePasswordUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(newPassword: String, confirmPassword: String): Result<Unit> {
        if (newPassword.isBlank()) return Result.failure(ValidationError.EmptyPassword)
        if (newPassword.length < 6) return Result.failure(ValidationError.PasswordTooShort)
        if (newPassword != confirmPassword) return Result.failure(ValidationError.PasswordsMismatch)
        return authRepository.updatePassword(newPassword)
    }
}
