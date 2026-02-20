package com.opencalisthenics.presentation.exercise.exercise

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.absoluteOffset
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.opencalisthenics.domain.model.Exercise
import com.opencalisthenics.presentation.exercise.difficultyColor
import kotlin.math.sqrt

private data class GraphNode(
    val exercise: Exercise,
    val role: String, // "prerequisite" | "current" | "variation" | "progression"
    val x: Dp,
    val y: Dp
)

@Composable
fun ExerciseProgressionGraph(
    current: Exercise,
    prerequisites: List<Exercise>,
    variations: List<Exercise>,
    progressions: List<Exercise>,
    onNodeClick: (Int) -> Unit,
    modifier: Modifier = Modifier
) {
    val nodeWidth = 120.dp
    val nodeHeight = 44.dp
    val vGap = 72.dp
    val hGap = 136.dp
    val pad = 12.dp

    val maxRowItems = maxOf(
        prerequisites.size.coerceAtLeast(1),
        1 + variations.size,
        progressions.size.coerceAtLeast(1)
    )
    val canvasWidth = hGap * (maxRowItems - 1) + nodeWidth + pad * 2
    val centerX = (canvasWidth - nodeWidth) / 2

    // X position of the leftmost node in a centered row of `count` nodes
    fun rowLeft(count: Int): Dp =
        (canvasWidth - nodeWidth - hGap * (count - 1).coerceAtLeast(0)) / 2

    val prereqY = pad
    val currentY = if (prerequisites.isNotEmpty()) pad + nodeHeight + vGap else pad
    val progY = currentY + nodeHeight + vGap

    val nodes: List<GraphNode> = buildList {
        prerequisites.forEachIndexed { i, ex ->
            add(GraphNode(ex, "prerequisite", rowLeft(prerequisites.size) + hGap * i, prereqY))
        }
        add(GraphNode(current, "current", centerX, currentY))
        variations.forEachIndexed { i, ex ->
            add(GraphNode(ex, "variation", centerX + hGap * (i + 1), currentY))
        }
        progressions.forEachIndexed { i, ex ->
            add(GraphNode(ex, "progression", rowLeft(progressions.size) + hGap * i, progY))
        }
    }

    val totalHeight =
        if (progressions.isNotEmpty()) progY + nodeHeight + pad else currentY + nodeHeight + pad

    // Edges: Triple(fromExerciseId, toExerciseId, edgeType)
    val edges: List<Triple<Int, Int, String>> = buildList {
        prerequisites.forEach { add(Triple(it.id, current.id, "prerequisite")) }
        variations.forEach { add(Triple(current.id, it.id, "variation")) }
        progressions.forEach { add(Triple(current.id, it.id, "progression")) }
    }

    Box(
        modifier = modifier
            .clip(RoundedCornerShape(8.dp))
            .horizontalScroll(rememberScrollState())
    ) {
        Box(Modifier.size(canvasWidth, totalHeight)) {
            // Draw edges behind nodes
            Canvas(Modifier.fillMaxSize()) {
                val halfW = nodeWidth.toPx() / 2
                val halfH = nodeHeight.toPx() / 2

                val centers = nodes.associate { n ->
                    n.exercise.id to Offset(n.x.toPx() + halfW, n.y.toPx() + halfH)
                }

                for ((fromId, toId, type) in edges) {
                    val from = centers[fromId] ?: continue
                    val to = centers[toId] ?: continue
                    val edgeColor = Color(0xFF64748B)

                    drawLine(
                        color = edgeColor,
                        start = from,
                        end = to,
                        strokeWidth = 2f,
                        pathEffect = if (type == "variation") {
                            PathEffect.dashPathEffect(floatArrayOf(10f, 5f))
                        } else null
                    )

                    // Arrowhead at the 'to' end
                    val dx = to.x - from.x
                    val dy = to.y - from.y
                    val len = sqrt(dx * dx + dy * dy)
                    if (len > 0f) {
                        val ux = dx / len
                        val uy = dy / len
                        val arrowLen = 10f
                        val arrowHalf = 5f
                        val bx = to.x - ux * arrowLen
                        val by = to.y - uy * arrowLen
                        drawPath(
                            Path().apply {
                                moveTo(to.x, to.y)
                                lineTo(bx - uy * arrowHalf, by + ux * arrowHalf)
                                lineTo(bx + uy * arrowHalf, by - ux * arrowHalf)
                                close()
                            },
                            color = edgeColor,
                            style = Fill
                        )
                    }
                }
            }

            // Draw clickable node cards on top of the edges
            nodes.forEach { node ->
                NodeCard(
                    exercise = node.exercise,
                    isCurrent = node.role == "current",
                    isVariation = node.role == "variation",
                    modifier = Modifier
                        .absoluteOffset(x = node.x, y = node.y)
                        .size(nodeWidth, nodeHeight),
                    onClick = { if (node.role != "current") onNodeClick(node.exercise.id) }
                )
            }
        }
    }
}

@Composable
private fun NodeCard(
    exercise: Exercise,
    isCurrent: Boolean,
    isVariation: Boolean,
    modifier: Modifier = Modifier,
    onClick: () -> Unit
) {
    val diffColor = difficultyColor(exercise.difficulty)
    val bgColor = if (isCurrent) {
        MaterialTheme.colorScheme.primaryContainer.copy(alpha = 0.5f)
    } else {
        MaterialTheme.colorScheme.surface
    }
    val textColor = if (isCurrent) {
        MaterialTheme.colorScheme.primary
    } else {
        MaterialTheme.colorScheme.onSurface
    }

    Surface(
        modifier = modifier.clickable(enabled = !isCurrent) { onClick() },
        shape = RoundedCornerShape(8.dp),
        color = bgColor,
        border = BorderStroke(
            width = if (isCurrent) 2.dp else 1.dp,
            color = if (isVariation) diffColor.copy(alpha = 0.6f) else diffColor
        )
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxSize()
                .padding(4.dp)
        ) {
            Text(
                text = exercise.name,
                fontSize = 10.sp,
                fontWeight = if (isCurrent) FontWeight.Bold else FontWeight.Normal,
                color = textColor,
                textAlign = TextAlign.Center,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
        }
    }
}
