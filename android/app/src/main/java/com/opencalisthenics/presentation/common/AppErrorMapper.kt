package com.opencalisthenics.presentation.common

import com.opencalisthenics.R
import com.opencalisthenics.domain.model.AppError

fun AppError.toUiText(): UiText = when (this) {
    is AppError.InvalidCredentials -> UiText.StringResource(R.string.error_invalid_credentials)
    is AppError.UserAlreadyExists -> UiText.StringResource(R.string.error_user_already_exists)
    is AppError.EmailNotConfirmed -> UiText.StringResource(R.string.error_email_not_confirmed)
    is AppError.WeakPassword -> UiText.StringResource(R.string.error_weak_password)
    is AppError.TooManyRequests -> UiText.StringResource(R.string.error_too_many_requests)
    is AppError.NetworkError -> UiText.StringResource(R.string.error_network)
    is AppError.NotFound -> UiText.StringResource(R.string.error_not_found)
    is AppError.Unknown -> UiText.StringResource(R.string.error_unknown)
}
