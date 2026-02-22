package com.opencalisthenics.presentation.user.profile

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.Language
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.R
import com.opencalisthenics.presentation.common.LanguageSwitcher
import com.opencalisthenics.presentation.common.UiText
import com.opencalisthenics.ui.theme.ErrorRed
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Surface

@Composable
fun ProfileAccountSection(
    email: String,
    isLoading: Boolean,
    errorMessage: UiText?,
    onLogoutClick: () -> Unit
) {
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
                value = email.ifEmpty { "..." }
            )

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 20.dp),
                color = Color.White.copy(alpha = 0.06f)
            )

            // Language row
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 4.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.Language,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = GrayText
                )
                Spacer(modifier = Modifier.width(16.dp))
                Text(
                    text = stringResource(R.string.profile_language),
                    fontSize = 14.sp,
                    color = Color.White,
                    modifier = Modifier.weight(1f)
                )
                LanguageSwitcher()
            }

            HorizontalDivider(
                modifier = Modifier.padding(horizontal = 20.dp),
                color = Color.White.copy(alpha = 0.06f)
            )

            // Logout row
            TextButton(
                onClick = onLogoutClick,
                enabled = !isLoading,
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
                    if (isLoading) {
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
            if (errorMessage != null) {
                Text(
                    text = errorMessage.asString(),
                    color = ErrorRed,
                    fontSize = 12.sp,
                    modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))
        }
    }
}

@Composable
fun ProfileListItem(
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
