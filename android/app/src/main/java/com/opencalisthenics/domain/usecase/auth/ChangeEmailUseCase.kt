package com.opencalisthenics.domain.usecase.auth

import com.opencalisthenics.domain.model.ValidationError
import com.opencalisthenics.domain.repository.AuthRepository
import com.opencalisthenics.domain.validation.isValidEmail

class ChangeEmailUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(newEmail: String): Result<Unit> {
        if (!isValidEmail(newEmail)) return Result.failure(ValidationError.InvalidEmail)
        return authRepository.updateEmail(newEmail.trim())
    }
}
