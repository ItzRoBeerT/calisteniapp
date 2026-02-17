package com.opencalisthenics.presentation.user.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import com.opencalisthenics.R
import com.opencalisthenics.ui.theme.Background
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.OpenCalisthenicsTheme
import com.opencalisthenics.ui.theme.Primary400
import com.opencalisthenics.ui.theme.Primary600
import com.opencalisthenics.ui.theme.Primary500
import com.opencalisthenics.ui.theme.Surface

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
            .verticalScroll(rememberScrollState())
            .padding(horizontal = 16.dp, vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // Profile header card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = Surface.copy(alpha = 0.7f)
            )
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Avatar
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.linearGradient(
                                colors = listOf(Primary400, Primary600)
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = uiState.initials,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Email
                Text(
                    text = uiState.email.ifEmpty { "..." },
                    style = MaterialTheme.typography.titleMedium,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                // Member since chip
                if (uiState.memberSince != null) {
                    Spacer(modifier = Modifier.height(8.dp))
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(50))
                            .background(Color.White.copy(alpha = 0.06f))
                            .padding(horizontal = 16.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = stringResource(R.string.profile_member_since, uiState.memberSince),
                            fontSize = 12.sp,
                            color = GrayText
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Action buttons row
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    // Change email button
                    TextButton(
                        onClick = { viewModel.showChangeEmailDialog() },
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .clip(RoundedCornerShape(50))
                            .background(Primary500.copy(alpha = 0.15f)),
                        shape = RoundedCornerShape(50)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = Primary400
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = stringResource(R.string.profile_change_email),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = Primary400,
                            maxLines = 1
                        )
                    }

                    // Change password button
                    TextButton(
                        onClick = { viewModel.showChangePasswordDialog() },
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .clip(RoundedCornerShape(50))
                            .background(Color.White.copy(alpha = 0.06f)),
                        shape = RoundedCornerShape(50)
                    ) {
                        Icon(
                            imageVector = Icons.Default.Lock,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp),
                            tint = GrayText
                        )
                        Spacer(modifier = Modifier.width(6.dp))
                        Text(
                            text = stringResource(R.string.profile_change_password),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            color = GrayText,
                            maxLines = 1
                        )
                    }
                }
            }
        }

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

        // Account section card
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(
                containerColor = Surface.copy(alpha = 0.7f)
            )
        ) {
            Column(
                modifier = Modifier.fillMaxWidth()
            ) {
                // Section header
                Text(
                    text = stringResource(R.string.profile_account_section),
                    style = MaterialTheme.typography.labelLarge,
                    color = GrayText,
                    modifier = Modifier.padding(start = 20.dp, top = 20.dp, bottom = 8.dp)
                )

                // Email row
                ProfileListItem(
                    icon = Icons.Default.Settings,
                    label = stringResource(R.string.profile_email),
                    value = uiState.email.ifEmpty { "..." }
                )

                HorizontalDivider(
                    modifier = Modifier.padding(horizontal = 20.dp),
                    color = Color.White.copy(alpha = 0.06f)
                )

                // Logout row
                TextButton(
                    onClick = { viewModel.logout(onLogout) },
                    enabled = !uiState.isLoading,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        if (uiState.isLoading) {
                            CircularProgressIndicator(
                                modifier = Modifier.size(20.dp),
                                strokeWidth = 2.dp,
                                color = ErrorRed
                            )
                        } else {
                            Icon(
                                imageVector = Icons.AutoMirrored.Filled.ExitToApp,
                                contentDescription = null,
                                modifier = Modifier.size(20.dp),
                                tint = ErrorRed
                            )
                        }
                        Spacer(modifier = Modifier.width(16.dp))
                        Text(
                            text = stringResource(R.string.profile_logout),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium,
                            color = ErrorRed
                        )
                    }
                }

                // Error message
                if (uiState.errorMessage != null) {
                    Text(
                        text = uiState.errorMessage!!.asString(),
                        color = ErrorRed,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))
            }
        }
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

@Composable
private fun ChangeEmailDialog(
    newEmail: String,
    onNewEmailChange: (String) -> Unit,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    isLoading: Boolean,
    error: com.opencalisthenics.presentation.common.UiText?
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Surface,
        title = {
            Text(
                text = stringResource(R.string.profile_change_email),
                color = Color.White
            )
        },
        text = {
            Column {
                OutlinedTextField(
                    value = newEmail,
                    onValueChange = onNewEmailChange,
                    label = { Text(stringResource(R.string.profile_new_email)) },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    isError = error != null,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Primary400,
                        unfocusedBorderColor = GrayText,
                        focusedLabelColor = Primary400,
                        unfocusedLabelColor = GrayText,
                        cursorColor = Primary400
                    )
                )
                if (error != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = error.asString(),
                        color = ErrorRed,
                        fontSize = 12.sp
                    )
                }
            }
        },
        confirmButton = {
            TextButton(
                onClick = onConfirm,
                enabled = !isLoading && newEmail.isNotBlank()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp,
                        color = Primary400
                    )
                } else {
                    Text(
                        text = stringResource(R.string.profile_save),
                        color = Primary400
                    )
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(
                    text = stringResource(R.string.profile_cancel),
                    color = GrayText
                )
            }
        }
    )
}

@Composable
private fun ChangePasswordDialog(
    newPassword: String,
    confirmPassword: String,
    onNewPasswordChange: (String) -> Unit,
    onConfirmPasswordChange: (String) -> Unit,
    onConfirm: () -> Unit,
    onDismiss: () -> Unit,
    isLoading: Boolean,
    error: com.opencalisthenics.presentation.common.UiText?
) {
    AlertDialog(
        onDismissRequest = onDismiss,
        containerColor = Surface,
        title = {
            Text(
                text = stringResource(R.string.profile_change_password),
                color = Color.White
            )
        },
        text = {
            Column {
                OutlinedTextField(
                    value = newPassword,
                    onValueChange = onNewPasswordChange,
                    label = { Text(stringResource(R.string.profile_new_password)) },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    isError = error != null,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Primary400,
                        unfocusedBorderColor = GrayText,
                        focusedLabelColor = Primary400,
                        unfocusedLabelColor = GrayText,
                        cursorColor = Primary400
                    )
                )
                Spacer(modifier = Modifier.height(12.dp))
                OutlinedTextField(
                    value = confirmPassword,
                    onValueChange = onConfirmPasswordChange,
                    label = { Text(stringResource(R.string.profile_confirm_password)) },
                    singleLine = true,
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    isError = error != null,
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedTextColor = Color.White,
                        unfocusedTextColor = Color.White,
                        focusedBorderColor = Primary400,
                        unfocusedBorderColor = GrayText,
                        focusedLabelColor = Primary400,
                        unfocusedLabelColor = GrayText,
                        cursorColor = Primary400
                    )
                )
                if (error != null) {
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = error.asString(),
                        color = ErrorRed,
                        fontSize = 12.sp
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(
                    text = stringResource(R.string.register_password_hint),
                    color = GrayText,
                    fontSize = 11.sp
                )
            }
        },
        confirmButton = {
            TextButton(
                onClick = onConfirm,
                enabled = !isLoading && newPassword.isNotBlank() && confirmPassword.isNotBlank()
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(16.dp),
                        strokeWidth = 2.dp,
                        color = Primary400
                    )
                } else {
                    Text(
                        text = stringResource(R.string.profile_save),
                        color = Primary400
                    )
                }
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text(
                    text = stringResource(R.string.profile_cancel),
                    color = GrayText
                )
            }
        }
    )
}

@Composable
private fun ProfileListItem(
    icon: ImageVector,
    label: String,
    value: String
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 20.dp, vertical = 14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            modifier = Modifier.size(20.dp),
            tint = GrayText
        )
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Text(
                text = label,
                fontSize = 12.sp,
                color = GrayText
            )
            Text(
                text = value,
                fontSize = 14.sp,
                color = Color.White
            )
        }
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
