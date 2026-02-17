package com.opencalisthenics.domain.usecase.auth

import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.repository.AuthRepository
import com.opencalisthenics.domain.validation.isValidEmail

class SignInUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<Unit> {
        if (!isValidEmail(email)) return Result.failure(ValidationError.InvalidEmail)
        if (password.isBlank()) return Result.failure(ValidationError.EmptyPassword)
        return authRepository.signIn(email.trim(), password)
    }
}
