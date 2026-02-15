package com.opencalisthenics.presentation.common

import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.EditNote
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material3.DropdownMenu
import androidx.compose.material3.DropdownMenuItem
import androidx.compose.material3.FloatingActionButton
import androidx.compose.material3.FloatingActionButtonDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun WorkoutFabMenu(
    onDoWorkout: () -> Unit,
    onAddWorkout: () -> Unit,
    modifier: Modifier = Modifier
) {
    var showMenu by remember { mutableStateOf(false) }

    FloatingActionButton(
        onClick = { showMenu = !showMenu },
        shape = CircleShape,
        containerColor = MaterialTheme.colorScheme.primary,
        contentColor = MaterialTheme.colorScheme.onPrimary,
        elevation = FloatingActionButtonDefaults.elevation(
            defaultElevation = 8.dp,
            pressedElevation = 12.dp
        ),
        modifier = modifier
            .offset(y = (-28).dp)
            .size(64.dp)
    ) {
        Icon(
            imageVector = Icons.Default.Add,
            contentDescription = "Crear workout",
            modifier = Modifier.size(32.dp)
        )
    }

    DropdownMenu(
        expanded = showMenu,
        onDismissRequest = { showMenu = false },
        containerColor = MaterialTheme.colorScheme.surface
    ) {
        DropdownMenuItem(
            text = {
                Text(
                    text = "Hacer workout",
                    color = MaterialTheme.colorScheme.onSurface
                )
            },
            onClick = {
                showMenu = false
                onDoWorkout()
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Filled.PlayArrow,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        )
        DropdownMenuItem(
            text = {
                Text(
                    text = "Añadir workout",
                    color = MaterialTheme.colorScheme.onSurface
                )
            },
            onClick = {
                showMenu = false
                onAddWorkout()
            },
            leadingIcon = {
                Icon(
                    imageVector = Icons.Filled.EditNote,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary
                )
            }
        )
    }
}
