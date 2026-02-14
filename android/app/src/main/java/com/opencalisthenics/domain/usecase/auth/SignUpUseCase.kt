package com.opencalisthenics.domain.usecase.auth

import com.opencalisthenics.domain.repository.AuthRepository

class SignUpUseCase(
    private val authRepository: AuthRepository
) {
    suspend operator fun invoke(email: String, password: String): Result<Unit> {
        if (password.length < 6) {
            return Result.failure(IllegalArgumentException("La contrasena debe tener al menos 6 caracteres"))
        }
        return authRepository.signUp(email, password)
    }
}
