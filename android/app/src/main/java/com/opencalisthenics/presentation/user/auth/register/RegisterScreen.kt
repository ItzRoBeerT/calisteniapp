package com.opencalisthenics.presentation.user.auth.register

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.AppButton
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.OpenCalisthenicsTheme
import com.opencalisthenics.ui.theme.Primary500
import com.opencalisthenics.ui.theme.Surface

@Composable
fun RegisterScreen(
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit,
    viewModel: RegisterViewModel = viewModel()
) {
    val uiState = viewModel.uiState

    val textFieldColors = OutlinedTextFieldDefaults.colors(
        unfocusedBorderColor = Color.White.copy(alpha = 0.3f),
        focusedBorderColor = Primary500,
        unfocusedLabelColor = GrayText,
        focusedLabelColor = Primary500,
        cursorColor = Primary500,
        unfocusedTextColor = Color.White,
        focusedTextColor = Color.White
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .imePadding()
            .verticalScroll(rememberScrollState()),
        contentAlignment = Alignment.Center
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp, vertical = 32.dp)
                .clip(RoundedCornerShape(12.dp))
                .background(Surface)
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = stringResource(R.string.register_title),
                fontSize = 28.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = stringResource(R.string.register_subtitle),
                fontSize = 16.sp,
                color = GrayText,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            OutlinedTextField(
                value = uiState.email,
                onValueChange = viewModel::onEmailChange,
                label = { Text(stringResource(R.string.register_email_label)) },
                singleLine = true,
                isError = uiState.emailError != null,
                supportingText = uiState.emailError?.let { error ->
                    { Text(text = error.asString(), color = ErrorRed) }
                },
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Email,
                    imeAction = ImeAction.Next
                ),
                colors = textFieldColors,
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = uiState.password,
                onValueChange = viewModel::onPasswordChange,
                label = { Text(stringResource(R.string.register_password_label)) },
                isError = uiState.passwordError != null,
                supportingText = {
                    Text(
                        text = if (uiState.passwordError != null) uiState.passwordError!!.asString()
                            else stringResource(R.string.register_password_hint),
                        color = if (uiState.passwordError != null) ErrorRed else GrayText
                    )
                },
                singleLine = true,
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Next
                ),
                colors = textFieldColors,
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(16.dp))

            OutlinedTextField(
                value = uiState.confirmPassword,
                onValueChange = viewModel::onConfirmPasswordChange,
                label = { Text(stringResource(R.string.register_confirm_password_label)) },
                singleLine = true,
                isError = uiState.confirmPasswordError != null,
                supportingText = uiState.confirmPasswordError?.let { error ->
                    { Text(text = error.asString(), color = ErrorRed) }
                },
                visualTransformation = PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(
                    keyboardType = KeyboardType.Password,
                    imeAction = ImeAction.Done
                ),
                colors = textFieldColors,
                shape = RoundedCornerShape(8.dp),
                modifier = Modifier.fillMaxWidth()
            )

            if (uiState.errorMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = uiState.errorMessage!!.asString(),
                    color = ErrorRed,
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            if (uiState.successMessage != null) {
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = uiState.successMessage!!.asString(),
                    color = Primary500,
                    fontSize = 14.sp,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth()
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            AppButton(
                text = stringResource(R.string.register_button),
                onClick = { viewModel.submit(onRegisterSuccess) },
                enabled = uiState.email.isNotBlank() && uiState.password.isNotBlank() && uiState.confirmPassword.isNotBlank(),
                isLoading = uiState.isLoading
            )

            Spacer(modifier = Modifier.height(16.dp))

            TextButton(onClick = onNavigateToLogin) {
                Text(
                    text = stringResource(R.string.register_has_account),
                    color = GrayText,
                    fontSize = 14.sp
                )
                Spacer(modifier = Modifier.width(4.dp))
                Text(
                    text = stringResource(R.string.register_login_link),
                    color = Primary500,
                    fontWeight = FontWeight.Medium,
                    fontSize = 14.sp
                )
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun RegisterScreenPreview() {
    OpenCalisthenicsTheme {
        RegisterScreen(
            onRegisterSuccess = {},
            onNavigateToLogin = {},
            viewModel = RegisterViewModel()
        )
    }
}
