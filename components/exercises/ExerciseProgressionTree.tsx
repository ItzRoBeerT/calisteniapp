'use client';

import { useEffect, useRef, useMemo } from 'react';
import cytoscape from 'cytoscape';
import { useRouter, useParams } from 'next/navigation';
import { getExerciseProgressionData, getDifficultyColor } from '@/utils/exerciseProgressionUtils';
import { getProgressionByExerciseId } from '@/data/exerciseProgressions';
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

	const progressionData = useMemo(
		() => getExerciseProgressionData(exerciseId, locale),
		[exerciseId, locale]
	);

	const { elements, hasAnyProgression, prereqGroupCount, progLevelCount } = useMemo(() => {
		if (!progressionData) {
			return { elements: [], hasAnyProgression: false, prereqGroupCount: 0, progLevelCount: 0 };
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

		// Agregar progresiones organizadas por niveles según sus prerrequisitos
		const progressionIds = new Set(progressions.map((p) => p.id));

		// Función para determinar de qué ejercicio depende una progresión
		const getParentInProgressions = (progExerciseId: number): number | null => {
			const progData = getProgressionByExerciseId(progExerciseId);
			if (!progData) return null;

			// Buscar el prerrequisito que esté en la lista de progresiones
			// (el más cercano en la cadena)
			for (const prereqId of [...progData.prerequisites].reverse()) {
				if (progressionIds.has(prereqId)) {
					return prereqId;
				}
			}
			return null; // Es una progresión directa del ejercicio actual
		};

		// Agrupar progresiones por niveles
		type ProgressionLevel = { exerciseId: number; parentId: number | null }[];
		const levels: ProgressionLevel[] = [];
		const placed = new Set<number>();

		// Nivel 0: progresiones directas (sin padre en la lista de progresiones)
		const directProgressions = progressions.filter(
			(p) => getParentInProgressions(p.id) === null
		);
		if (directProgressions.length > 0) {
			levels.push(directProgressions.map((p) => ({ exerciseId: p.id, parentId: null })));
			directProgressions.forEach((p) => placed.add(p.id));
		}

		// Siguientes niveles: progresiones que dependen de las anteriores
		let remainingProgressions = progressions.filter((p) => !placed.has(p.id));
		while (remainingProgressions.length > 0) {
			const nextLevel: ProgressionLevel = [];

			for (const prog of remainingProgressions) {
				const parentId = getParentInProgressions(prog.id);
				if (parentId !== null && placed.has(parentId)) {
					nextLevel.push({ exerciseId: prog.id, parentId });
					placed.add(prog.id);
				}
			}

			if (nextLevel.length === 0) {
				// Evitar bucle infinito - agregar los restantes como nivel final
				remainingProgressions.forEach((p) => {
					nextLevel.push({ exerciseId: p.id, parentId: null });
				});
				levels.push(nextLevel);
				break;
			}

			levels.push(nextLevel);
			remainingProgressions = progressions.filter((p) => !placed.has(p.id));
		}

		// Mapa para guardar las posiciones X de cada nodo de progresión
		const nodePositions = new Map<number, number>();

		// Calcular posiciones para cada nivel de progresiones
		levels.forEach((level, levelIndex) => {
			const levelY = currentY + VERTICAL_GAP + levelIndex * VERTICAL_GAP;

			// Separar items directos (sin padre) de items con padre
			const directItems = level.filter((item) => item.parentId === null);
			const childItems = level.filter((item) => item.parentId !== null);

			// Posicionar items directos (nivel 0) centrados
			if (directItems.length > 0) {
				const levelWidth = (directItems.length - 1) * HORIZONTAL_GAP;
				const startX = centerX - levelWidth / 2;

				directItems.forEach((item, itemIndex) => {
					const xPos =
						directItems.length === 1 ? centerX : startX + itemIndex * HORIZONTAL_GAP;
					nodePositions.set(item.exerciseId, xPos);
				});
			}

			// Posicionar items con padre debajo de su padre
			childItems.forEach((item) => {
				const parentX = nodePositions.get(item.parentId!);
				if (parentX !== undefined) {
					nodePositions.set(item.exerciseId, parentX);
				} else {
					// Fallback si no se encuentra el padre
					nodePositions.set(item.exerciseId, centerX);
				}
			});

			// Crear nodos para este nivel
			level.forEach((item) => {
				const exercise = progressions.find((p) => p.id === item.exerciseId);
				if (!exercise) return;

				const xPos = nodePositions.get(item.exerciseId) ?? centerX;

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
					position: { x: xPos, y: levelY },
				});

				// Determinar el origen del edge
				const sourceId =
					item.parentId !== null ? `prog-${item.parentId}` : 'current';

				edges.push({
					data: {
						id: `edge-prog-${exercise.id}`,
						source: sourceId,
						target: `prog-${exercise.id}`,
						type: 'progression',
					},
				});
			});
		});

		return {
			elements: [...nodes, ...edges],
			hasAnyProgression: hasAny,
			prereqGroupCount,
			progLevelCount: levels.length,
		};
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

	const prereqHeight = prereqGroupCount * VERTICAL_GAP;
	const progHeight = progLevelCount * VERTICAL_GAP;
	const currentHeight = VERTICAL_GAP;
	const totalHeight = Math.max(300, prereqHeight + currentHeight + progHeight + 60);

	// Calcular proporciones para el gradiente de fondo centrado con los nodos
	const padding = 30;
	const totalSlots = prereqGroupCount + 1 + progLevelCount;
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

	if (progLevelCount > 0) {
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
