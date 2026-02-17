package com.opencalisthenics.domain.model

sealed class ValidationError : Exception() {
    data object InvalidEmail : ValidationError()
    data object EmptyPassword : ValidationError()
    data object PasswordTooShort : ValidationError()
    data object PasswordsMismatch : ValidationError()
}
