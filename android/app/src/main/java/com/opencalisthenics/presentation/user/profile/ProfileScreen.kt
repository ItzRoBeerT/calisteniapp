package com.opencalisthenics.presentation.user.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.OpenCalisthenicsTheme
import com.opencalisthenics.ui.theme.Primary400

@Composable
fun ProfileScreen(
    onLogout: () -> Unit,
    viewModel: ProfileViewModel = viewModel()
) {
    val uiState = viewModel.uiState

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Background)
            .statusBarsPadding()
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        ProfileHeaderCard(
            email = uiState.email,
            initials = uiState.initials,
            memberSince = uiState.memberSince,
            onChangeEmailClick = viewModel::showChangeEmailDialog,
            onChangePasswordClick = viewModel::showChangePasswordDialog
        )

        // Success messages
        if (uiState.changeEmailSuccess != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = uiState.changeEmailSuccess!!.asString(),
                color = Primary400,
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }
        if (uiState.changePasswordSuccess != null) {
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = uiState.changePasswordSuccess!!.asString(),
                color = Primary400,
                fontSize = 12.sp,
                textAlign = TextAlign.Center,
                modifier = Modifier.fillMaxWidth()
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        ProfileAccountSection(
            email = uiState.email,
            isLoading = uiState.isLoading,
            errorMessage = uiState.errorMessage,
            onLogoutClick = { viewModel.logout(onLogout) }
        )
    }

    // Change email dialog
    if (uiState.showChangeEmailDialog) {
        ChangeEmailDialog(
            newEmail = uiState.newEmail,
            onNewEmailChange = viewModel::onNewEmailChange,
            onConfirm = viewModel::changeEmail,
            onDismiss = viewModel::dismissChangeEmailDialog,
            isLoading = uiState.isChangingEmail,
            error = uiState.changeEmailError
        )
    }

    // Change password dialog
    if (uiState.showChangePasswordDialog) {
        ChangePasswordDialog(
            newPassword = uiState.newPassword,
            confirmPassword = uiState.confirmPassword,
            onNewPasswordChange = viewModel::onNewPasswordChange,
            onConfirmPasswordChange = viewModel::onConfirmPasswordChange,
            onConfirm = viewModel::changePassword,
            onDismiss = viewModel::dismissChangePasswordDialog,
            isLoading = uiState.isChangingPassword,
            error = uiState.changePasswordError
        )
    }
}

@Preview(showBackground = true)
@Composable
fun ProfileScreenPreview() {
    OpenCalisthenicsTheme {
        ProfileScreen(
            onLogout = {},
            viewModel = ProfileViewModel()
        )
    }
}
