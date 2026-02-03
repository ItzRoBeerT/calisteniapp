'use client';

import { useMemo, useCallback } from 'react';
import ReactFlow, {
	Background,
	BackgroundVariant,
	Node,
	Edge,
	Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getExerciseProgressionData, getDifficultyColor } from '@/utils/exerciseProgressionUtils';
import { createSlug } from '@/utils/slugs';
import type { Exercise } from '@/types/supabase';

interface ExerciseProgressionTreeProps {
	exerciseId: number;
	exerciseName: string;
}

interface ExerciseNodeData {
	exercise: Exercise & { difficulty?: number };
	isCurrent: boolean;
	type: 'prerequisite' | 'current' | 'variation' | 'progression';
}

const NODE_WIDTH = 140;
const NODE_HEIGHT = 50;
const VERTICAL_GAP = 65;
const HORIZONTAL_GAP = 155;

function ExerciseNode({ data }: { data: ExerciseNodeData }) {
	const params = useParams();
	const locale = (params.locale as string) || 'es';
	const { exercise, isCurrent, type } = data;
	const difficultyColor = getDifficultyColor(exercise.difficulty ?? 0);

	const getBorderStyle = () => {
		if (isCurrent) {
			return 'ring-2 ring-primary-500 ring-offset-2 ring-offset-background';
		}
		return '';
	};

	const getTypeLabel = () => {
		switch (type) {
			case 'prerequisite':
				return '↑ Prerreq.';
			case 'progression':
				return '↓ Progr.';
			case 'variation':
				return '↔ Var.';
			default:
				return '';
		}
	};

	return (
		<Link
			href={`/${locale}/exercises/${createSlug(exercise.name)}`}
			className={`
				block w-full h-full p-2 rounded-lg bg-surface border border-foreground/10
				hover:border-primary-500/50 hover:bg-surface-hover transition-all
				${getBorderStyle()}
				${isCurrent ? 'shadow-lg shadow-primary-500/20' : ''}
			`}
		>
			<div className="flex flex-col h-full justify-center">
				<span
					className={`text-xs font-semibold truncate ${isCurrent ? 'text-primary-400' : 'text-foreground'}`}
					title={exercise.name}
				>
					{exercise.name}
				</span>
				<div className="flex items-center justify-between mt-1">
					<span
						className="text-[10px] px-1.5 py-0.5 rounded-full"
						style={{ backgroundColor: `${difficultyColor}20`, color: difficultyColor }}
					>
						{exercise.difficulty}/5
					</span>
					{!isCurrent && <span className="text-[9px] text-foreground/50">{getTypeLabel()}</span>}
					{isCurrent && <span className="text-[9px] text-primary-400 font-medium">★ Actual</span>}
				</div>
			</div>
		</Link>
	);
}

const nodeTypes = {
	exercise: ExerciseNode,
};

export default function ExerciseProgressionTree({ exerciseId }: ExerciseProgressionTreeProps) {
	const progressionData = useMemo(() => getExerciseProgressionData(exerciseId), [exerciseId]);

	const { nodes, edges } = useMemo(() => {
		if (!progressionData) {
			return { nodes: [], edges: [] };
		}

		const nodes: Node<ExerciseNodeData>[] = [];
		const edges: Edge[] = [];

		const { prerequisites, current, variations, progressions } = progressionData;

		// Layout vertical:
		// Prerrequisitos arriba → Actual en el centro → Progresiones abajo
		// Variaciones a los lados del actual

		const prereqCount = prerequisites.length;
		const varCount = variations.length;

		// Posición Y del ejercicio actual (centro vertical)
		const currentY = prereqCount * VERTICAL_GAP;
		// Centro horizontal para el nodo actual
		const centerX = varCount > 0 ? HORIZONTAL_GAP / 2 : 0;

		// Agregar prerrequisitos arriba (de más fácil a más difícil, de arriba a abajo)
		prerequisites.forEach((exercise, index) => {
			const y = index * VERTICAL_GAP;
			nodes.push({
				id: `prereq-${exercise.id}`,
				type: 'exercise',
				position: { x: centerX, y },
				data: { exercise, isCurrent: false, type: 'prerequisite' },
				style: { width: NODE_WIDTH, height: NODE_HEIGHT },
				sourcePosition: Position.Bottom,
				targetPosition: Position.Top,
			});

			// Edge al siguiente prerrequisito o al actual
			if (index < prereqCount - 1) {
				edges.push({
					id: `edge-prereq-${index}`,
					source: `prereq-${exercise.id}`,
					target: `prereq-${prerequisites[index + 1].id}`,
					type: 'smoothstep',
					animated: false,
					style: { stroke: '#64748b', strokeWidth: 2 },
				});
			} else {
				// Último prerrequisito conecta al actual
				edges.push({
					id: `edge-prereq-to-current`,
					source: `prereq-${exercise.id}`,
					target: 'current',
					type: 'smoothstep',
					animated: true,
					style: { stroke: '#BB86FC', strokeWidth: 2 },
				});
			}
		});

		// Agregar nodo actual en el centro
		nodes.push({
			id: 'current',
			type: 'exercise',
			position: { x: centerX, y: currentY },
			data: { exercise: current, isCurrent: true, type: 'current' },
			style: { width: NODE_WIDTH, height: NODE_HEIGHT },
			sourcePosition: Position.Bottom,
			targetPosition: Position.Top,
		});

		// Agregar variaciones a los lados del actual
		variations.forEach((exercise, index) => {
			const xOffset = (index % 2 === 0 ? 1 : -1) * HORIZONTAL_GAP;
			const yOffset = Math.floor(index / 2) * (NODE_HEIGHT + 10);

			nodes.push({
				id: `var-${exercise.id}`,
				type: 'exercise',
				position: { x: centerX + xOffset, y: currentY + yOffset },
				data: { exercise, isCurrent: false, type: 'variation' },
				style: { width: NODE_WIDTH, height: NODE_HEIGHT },
				sourcePosition: Position.Bottom,
				targetPosition: Position.Top,
			});

			// Edge horizontal al actual
			edges.push({
				id: `edge-var-${exercise.id}`,
				source: 'current',
				target: `var-${exercise.id}`,
				type: 'straight',
				animated: false,
				style: { stroke: '#64748b', strokeWidth: 1, strokeDasharray: '4 4' },
			});
		});

		// Agregar progresiones abajo (de más fácil a más difícil)
		progressions.forEach((exercise, index) => {
			const y = currentY + VERTICAL_GAP + index * VERTICAL_GAP;

			nodes.push({
				id: `prog-${exercise.id}`,
				type: 'exercise',
				position: { x: centerX, y },
				data: { exercise, isCurrent: false, type: 'progression' },
				style: { width: NODE_WIDTH, height: NODE_HEIGHT },
				sourcePosition: Position.Bottom,
				targetPosition: Position.Top,
			});

			// Edge desde el anterior
			const sourceId = index === 0 ? 'current' : `prog-${progressions[index - 1].id}`;
			edges.push({
				id: `edge-prog-${index}`,
				source: sourceId,
				target: `prog-${exercise.id}`,
				type: 'smoothstep',
				animated: false,
				style: { stroke: '#64748b', strokeWidth: 2 },
			});
		});

		return { nodes, edges };
	}, [progressionData]);

	const onInit = useCallback((reactFlowInstance: { fitView: () => void }) => {
		setTimeout(() => {
			reactFlowInstance.fitView();
		}, 100);
	}, []);

	if (!progressionData) {
		return (
			<div className="flex items-center justify-center h-32 text-foreground/50 text-sm">
				No hay datos de progresión disponibles
			</div>
		);
	}

	const hasAnyProgression =
		progressionData.prerequisites.length > 0 ||
		progressionData.variations.length > 0 ||
		progressionData.progressions.length > 0;

	if (!hasAnyProgression) {
		return (
			<div className="flex items-center justify-center h-32 text-foreground/50 text-sm">
				Este ejercicio no tiene progresiones definidas
			</div>
		);
	}

	// Calcular altura dinámica basada en el contenido
	const prereqHeight = progressionData.prerequisites.length * VERTICAL_GAP;
	const progHeight = progressionData.progressions.length * VERTICAL_GAP;
	const totalHeight = Math.max(280, prereqHeight + NODE_HEIGHT + progHeight + 80);

	return (
		<div
			className="w-full rounded-lg overflow-hidden border border-foreground/10"
			style={{ height: totalHeight }}
		>
			<ReactFlow
				nodes={nodes}
				edges={edges}
				nodeTypes={nodeTypes}
				onInit={onInit}
				fitView
				fitViewOptions={{ padding: 0.2 }}
				nodesDraggable={false}
				nodesConnectable={false}
				elementsSelectable={false}
				zoomOnScroll={false}
				zoomOnPinch={false}
				panOnDrag={true}
				panOnScroll={true}
				preventScrolling={false}
				minZoom={0.4}
				maxZoom={1}
				proOptions={{ hideAttribution: true }}
			>
				<Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(100, 116, 139, 0.2)" />
			</ReactFlow>
		</div>
	);
}
