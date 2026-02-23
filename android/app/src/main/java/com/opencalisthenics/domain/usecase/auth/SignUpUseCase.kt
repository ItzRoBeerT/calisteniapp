package com.opencalisthenics.domain.usecase.auth

import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.repository.AuthRepository
import com.opencalisthenics.domain.validation.isValidEmail

class SignUpUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String, confirmPassword: String): Result<Unit> {
        if (!isValidEmail(email)) return Result.failure(ValidationError.InvalidEmail)
        if (password.length < 6) return Result.failure(ValidationError.PasswordTooShort)
        if (password != confirmPassword) return Result.failure(ValidationError.PasswordsMismatch)
        return authRepository.signUp(email.trim(), password)
    }
}
