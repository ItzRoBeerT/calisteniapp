package com.opencalisthenics.domain.model

sealed class AppError : Exception() {

    // Auth errors
    data object InvalidCredentials : AppError()
    data object UserAlreadyExists : AppError()
    data object EmailNotConfirmed : AppError()
    data object WeakPassword : AppError()
    data object TooManyRequests : AppError()

    // General errors
    data object NetworkError : AppError()
    data object NotFound : AppError()
    data class Unknown(override val message: String?) : AppError()
}
