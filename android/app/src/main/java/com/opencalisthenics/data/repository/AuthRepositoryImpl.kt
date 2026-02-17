package com.opencalisthenics.data.repository

import com.opencalisthenics.data.SupabaseClient
import com.opencalisthenics.domain.model.AppError
import com.opencalisthenics.domain.repository.AuthRepository
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.exceptions.RestException
import io.ktor.client.plugins.HttpRequestTimeoutException
import java.net.UnknownHostException

class AuthRepositoryImpl : AuthRepository {

    override suspend fun signIn(email: String, password: String): Result<Unit> = try {
        SupabaseClient.client.auth.signInWith(Email) {
            this.email = email
            this.password = password
        }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun signUp(email: String, password: String): Result<Unit> = try {
        SupabaseClient.client.auth.signUpWith(Email) {
            this.email = email
            this.password = password
        }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun signOut(): Result<Unit> = try {
        SupabaseClient.client.auth.signOut()
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun updateEmail(newEmail: String): Result<Unit> = try {
        SupabaseClient.client.auth.updateUser { email = newEmail }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    override suspend fun updatePassword(newPassword: String): Result<Unit> = try {
        SupabaseClient.client.auth.updateUser { password = newPassword }
        Result.success(Unit)
    } catch (e: Exception) {
        Result.failure(e.toAppError())
    }

    private fun Exception.toAppError(): AppError = when (this) {
        is RestException -> mapRestException()
        is UnknownHostException -> AppError.NetworkError
        is HttpRequestTimeoutException -> AppError.NetworkError
        else -> AppError.Unknown(message)
    }

    private fun RestException.mapRestException(): AppError {
        val errorBody = message?.lowercase() ?: ""
        return when {
            "invalid_credentials" in errorBody || "invalid login" in errorBody ->
                AppError.InvalidCredentials
            "user_already_exists" in errorBody || "already registered" in errorBody ->
                AppError.UserAlreadyExists
            "email_not_confirmed" in errorBody ->
                AppError.EmailNotConfirmed
            "weak_password" in errorBody || "password" in errorBody && "short" in errorBody ->
                AppError.WeakPassword
            "rate_limit" in errorBody || "too many requests" in errorBody ->
                AppError.TooManyRequests
            else -> AppError.Unknown(message)
        }
    }
}
