package com.opencalisthenics.presentation.common

import android.app.Activity
import android.content.Context
import android.content.res.Configuration
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.ui.theme.GrayText
import com.opencalisthenics.ui.theme.Primary500
import java.util.Locale

object LanguageManager {
    private const val PREFS_NAME = "app_prefs"
    private const val KEY_LANGUAGE = "language"

    fun getLanguage(context: Context): String {
        val saved = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_LANGUAGE, null)
        return saved ?: context.resources.configuration.locales[0].language.let { lang ->
            if (lang == "en") "en" else "es"
        }
    }

    fun setLanguage(context: Context, language: String) {
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_LANGUAGE, language)
            .apply()
    }

    fun applyLanguage(context: Context): Context {
        val saved = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .getString(KEY_LANGUAGE, null) ?: return context
        val locale = Locale(saved)
        Locale.setDefault(locale)
        val config = Configuration(context.resources.configuration)
        config.setLocale(locale)
        return context.createConfigurationContext(config)
    }
}

@Composable
fun LanguageSwitcher(modifier: Modifier = Modifier) {
    val context = LocalContext.current
    val current = remember { LanguageManager.getLanguage(context) }

    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically
    ) {
        listOf("es" to "ES", "en" to "EN").forEach { (code, label) ->
            val isSelected = code == current
            TextButton(
                onClick = {
                    if (!isSelected) {
                        LanguageManager.setLanguage(context, code)
                        (context as? Activity)?.recreate()
                    }
                },
                contentPadding = PaddingValues(horizontal = 6.dp, vertical = 0.dp)
            ) {
                Text(
                    text = label,
                    color = if (isSelected) Primary500 else GrayText,
                    fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal,
                    fontSize = 13.sp,
                    modifier = Modifier.padding(horizontal = 2.dp)
                )
            }
        }
    }
}
