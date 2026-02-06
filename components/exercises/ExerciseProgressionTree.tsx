'use client';

import { useEffect, useRef, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { useRouter, useParams } from 'next/navigation';
import { getExerciseProgressionData, getDifficultyColor } from '@/utils/exerciseProgressionUtils';
import { createSlug } from '@/utils/slugs';

interface ExerciseProgressionTreeProps {
	exerciseId: number;
	exerciseName: string;
}

const VERTICAL_GAP = 80;
const HORIZONTAL_GAP = 160;

export default function ExerciseProgressionTree({ exerciseId }: ExerciseProgressionTreeProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const cyRef = useRef<cytoscape.Core | null>(null);
	const router = useRouter();
	const params = useParams();
	const locale = (params.locale as string) || 'es';

	const progressionData = useMemo(() => getExerciseProgressionData(exerciseId), [exerciseId]);

	const { elements, hasAnyProgression, prereqGroupCount } = useMemo(() => {
		if (!progressionData) {
			return { elements: [], hasAnyProgression: false, prereqGroupCount: 0 };
		}

		const nodes: cytoscape.ElementDefinition[] = [];
		const edges: cytoscape.ElementDefinition[] = [];

		const { prerequisiteGroups, current, variations, progressions } = progressionData;

		const hasAny =
			prerequisiteGroups.length > 0 || variations.length > 0 || progressions.length > 0;

		const prereqGroupCount = prerequisiteGroups.length;
		const varCount = variations.length;
		// Check if any prerequisite group has more than 1 item (variations)
		const hasPrereqVariations = prerequisiteGroups.some((g) => g.length > 1);
		const centerX = varCount > 0 || hasPrereqVariations ? HORIZONTAL_GAP / 2 : 0;
		const currentY = prereqGroupCount * VERTICAL_GAP;

		// Agregar nodos de prerrequisitos agrupados por variaciones
		prerequisiteGroups.forEach((group, groupIndex) => {
			const groupY = groupIndex * VERTICAL_GAP;

			group.forEach((exercise, exerciseIndex) => {
				// If there are multiple exercises in the group, spread them horizontally
				const xOffset = group.length > 1
					? (exerciseIndex - (group.length - 1) / 2) * HORIZONTAL_GAP
					: 0;

				nodes.push({
					data: {
						id: `prereq-${exercise.id}`,
						label: exercise.name,
						difficulty: exercise.difficulty ?? 0,
						color: getDifficultyColor(exercise.difficulty ?? 0),
						type: group.length > 1 ? 'prerequisite-variation' : 'prerequisite',
						exerciseId: exercise.id,
						exerciseName: exercise.name,
					},
					position: { x: centerX + xOffset, y: groupY },
				});
			});

			// Add edges between variation nodes in the same group
			if (group.length > 1) {
				for (let i = 0; i < group.length - 1; i++) {
					edges.push({
						data: {
							id: `edge-prereq-var-${groupIndex}-${i}`,
							source: `prereq-${group[i].id}`,
							target: `prereq-${group[i + 1].id}`,
							type: 'prereq-variation',
						},
					});
				}
			}

			// Add edges to next group or to current node
			const isLastGroup = groupIndex === prerequisiteGroups.length - 1;
			const sourceIds = group.map((e) => `prereq-${e.id}`);

			if (isLastGroup) {
				// Connect all exercises in last group to current
				sourceIds.forEach((sourceId, idx) => {
					edges.push({
						data: {
							id: `edge-prereq-to-current-${idx}`,
							source: sourceId,
							target: 'current',
							type: 'progression-current',
						},
					});
				});
			} else {
				// Connect to the next group (from center of current group to center of next)
				const nextGroup = prerequisiteGroups[groupIndex + 1];
				// Connect from each node in current group to each node in next group would be messy
				// Instead, connect from each node to the first node of the next group
				sourceIds.forEach((sourceId, idx) => {
					edges.push({
						data: {
							id: `edge-prereq-${groupIndex}-${idx}`,
							source: sourceId,
							target: `prereq-${nextGroup[0].id}`,
							type: 'progression',
						},
					});
				});
			}
		});

		// Agregar nodo actual con posición
		nodes.push({
			data: {
				id: 'current',
				label: current.name,
				difficulty: current.difficulty ?? 0,
				color: getDifficultyColor(current.difficulty ?? 0),
				type: 'current',
				exerciseId: current.id,
				exerciseName: current.name,
			},
			position: { x: centerX, y: currentY },
		});

		// Agregar variaciones con posiciones
		variations.forEach((exercise, index) => {
			const xOffset = (index % 2 === 0 ? 1 : -1) * HORIZONTAL_GAP;
			const yOffset = Math.floor(index / 2) * 60;

			nodes.push({
				data: {
					id: `var-${exercise.id}`,
					label: exercise.name,
					difficulty: exercise.difficulty ?? 0,
					color: getDifficultyColor(exercise.difficulty ?? 0),
					type: 'variation',
					exerciseId: exercise.id,
					exerciseName: exercise.name,
				},
				position: { x: centerX + xOffset, y: currentY + yOffset },
			});

			edges.push({
				data: {
					id: `edge-var-${exercise.id}`,
					source: 'current',
					target: `var-${exercise.id}`,
					type: 'variation',
				},
			});
		});

		// Agregar progresiones con posiciones
		progressions.forEach((exercise, index) => {
			nodes.push({
				data: {
					id: `prog-${exercise.id}`,
					label: exercise.name,
					difficulty: exercise.difficulty ?? 0,
					color: getDifficultyColor(exercise.difficulty ?? 0),
					type: 'progression',
					exerciseId: exercise.id,
					exerciseName: exercise.name,
				},
				position: { x: centerX, y: currentY + VERTICAL_GAP + index * VERTICAL_GAP },
			});

			const sourceId = index === 0 ? 'current' : `prog-${progressions[index - 1].id}`;
			edges.push({
				data: {
					id: `edge-prog-${index}`,
					source: sourceId,
					target: `prog-${exercise.id}`,
					type: 'progression',
				},
			});
		});

		return { elements: [...nodes, ...edges], hasAnyProgression: hasAny, prereqGroupCount };
	}, [progressionData]);

	useEffect(() => {
		if (!containerRef.current || !progressionData || !hasAnyProgression) return;

		if (cyRef.current) {
			cyRef.current.destroy();
		}

		const cy = cytoscape({
			container: containerRef.current,
			elements,
			style: [
				{
					selector: 'node',
					style: {
						'background-color': '#1e1e1e',
						'border-width': 2,
						'border-color': 'data(color)',
						label: 'data(label)',
						'text-valign': 'center',
						'text-halign': 'center',
						'font-size': 11,
						'font-weight': 500,
						color: '#e0e0e0',
						'text-wrap': 'wrap',
						'text-max-width': '100px',
						width: 120,
						height: 45,
						shape: 'round-rectangle',
						'text-outline-color': '#1e1e1e',
						'text-outline-width': 2,
					},
				},
				{
					selector: 'node[type="current"]',
					style: {
						'background-color': '#2d1f4e',
						'border-width': 3,
						'border-color': '#BB86FC',
						color: '#BB86FC',
						'font-weight': 600,
						width: 130,
						height: 50,
					},
				},
				{
					selector: 'node[type="variation"]',
					style: {
						'border-style': 'dashed',
					},
				},
				{
					selector: 'node[type="prerequisite-variation"]',
					style: {
						'border-style': 'dashed',
					},
				},
				{
					selector: 'node:active, node:grabbed',
					style: {
						'border-width': 4,
						'background-color': '#2a2a2a',
					},
				},
				{
					selector: 'edge',
					style: {
						width: 2,
						'line-color': '#64748b',
						'target-arrow-color': '#64748b',
						'target-arrow-shape': 'triangle',
						'curve-style': 'bezier',
						'arrow-scale': 0.8,
					},
				},
				{
					selector: 'edge[type="progression-current"]',
					style: {
						'line-color': '#BB86FC',
						'target-arrow-color': '#BB86FC',
						width: 3,
					},
				},
				{
					selector: 'edge[type="variation"]',
					style: {
						'line-style': 'dashed',
						'line-color': '#64748b',
						width: 1.5,
					},
				},
				{
					selector: 'edge[type="prereq-variation"]',
					style: {
						'line-style': 'dashed',
						'line-color': '#64748b',
						width: 1.5,
						'target-arrow-shape': 'none',
					},
				},
			],
			layout: {
				name: 'preset',
			},
			userZoomingEnabled: false,
			userPanningEnabled: false,
			boxSelectionEnabled: false,
			autoungrabify: true,
		});

		cy.on('tap', 'node', (event) => {
			const node = event.target;
			const data = node.data();
			if (data.type !== 'current' && data.exerciseName) {
				router.push(`/${locale}/exercises/${createSlug(data.exerciseName)}`);
			}
		});

		cy.on('mouseover', 'node', (event) => {
			const node = event.target;
			if (node.data('type') !== 'current' && containerRef.current) {
				containerRef.current.style.cursor = 'pointer';
			}
		});

		cy.on('mouseout', 'node', () => {
			if (containerRef.current) {
				containerRef.current.style.cursor = 'default';
			}
		});

		setTimeout(() => {
			cy.fit(undefined, 30);
			cy.center();
		}, 50);

		cyRef.current = cy;

		return () => {
			if (cyRef.current) {
				cyRef.current.destroy();
				cyRef.current = null;
			}
		};
	}, [elements, hasAnyProgression, progressionData, router, locale]);

	if (!progressionData) {
		return (
			<div className="flex items-center justify-center h-32 text-foreground/50 text-sm">
				No hay datos de progresión disponibles
			</div>
		);
	}

	if (!hasAnyProgression) {
		return (
			<div className="flex items-center justify-center h-32 text-foreground/50 text-sm">
				Este ejercicio no tiene progresiones definidas
			</div>
		);
	}

	const progCount = progressionData.progressions.length;
	const prereqHeight = prereqGroupCount * VERTICAL_GAP;
	const progHeight = progCount * VERTICAL_GAP;
	const currentHeight = VERTICAL_GAP;
	const totalHeight = Math.max(300, prereqHeight + currentHeight + progHeight + 60);

	// Calcular proporciones para el gradiente de fondo centrado con los nodos
	const padding = 30;
	const totalSlots = prereqGroupCount + 1 + progCount;
	const paddingPct = (padding / totalHeight) * 100;
	const contentPct = 100 - 2 * paddingPct;
	const slotPct = contentPct / totalSlots;

	const prereqEndPct = paddingPct + prereqGroupCount * slotPct;
	const currentEndPct = prereqEndPct + slotPct;

	// Crear gradiente de fondo con las zonas centradas
	const gradientStops: string[] = [];

	if (prereqGroupCount > 0) {
		gradientStops.push(`rgba(34, 197, 94, 0.08) ${paddingPct}%`);
		gradientStops.push(`rgba(34, 197, 94, 0.08) ${prereqEndPct}%`);
	}

	const currentStart = prereqGroupCount > 0 ? prereqEndPct : paddingPct;
	gradientStops.push(`rgba(187, 134, 252, 0.12) ${currentStart}%`);
	gradientStops.push(`rgba(187, 134, 252, 0.12) ${currentEndPct}%`);

	if (progCount > 0) {
		gradientStops.push(`rgba(239, 68, 68, 0.08) ${currentEndPct}%`);
		gradientStops.push(`rgba(239, 68, 68, 0.08) ${100 - paddingPct}%`);
	}

	const backgroundGradient = `linear-gradient(to bottom, ${gradientStops.join(', ')})`;

	return (
		<div className="relative w-full rounded-lg border border-foreground/10 overflow-hidden">
			<div
				ref={containerRef}
				className="w-full"
				style={{
					height: totalHeight,
					background: backgroundGradient,
				}}
			/>
		</div>
	);
}
