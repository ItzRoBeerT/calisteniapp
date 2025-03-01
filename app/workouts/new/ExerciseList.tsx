'use client';
import { useState } from 'react';
import ExerciseItem from './ExerciseItem';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';

export default function ExerciseList({
	exercises,
	savedExercisesList,
	onChange,
}) {
	const [focusedExerciseIndex, setFocusedExerciseIndex] = useState(null);

	// Sensores para drag and drop
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8, // 8px de distancia antes de iniciar el drag
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Generar ID único para nuevos ejercicios
	const generateUniqueId = () => {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	};

	// Manejar cambios en un ejercicio específico
	const handleExerciseChange = (index, field, value) => {
		const updatedExercises = [...exercises];
		updatedExercises[index] = {
			...updatedExercises[index],
			[field]:
				field === 'sets' || field === 'reps' ? parseInt(value) : value,
		};
		onChange(updatedExercises);
	};

	// Añadir nuevo ejercicio después del índice especificado
	const addExerciseAfter = (index) => {
		const updatedExercises = [...exercises];
		const newExercise = {
			name: '',
			sets: 3,
			reps: 10,
			id: generateUniqueId(),
		};
		updatedExercises.splice(index + 1, 0, newExercise);
		onChange(updatedExercises);
	};

	// Eliminar ejercicio en el índice especificado
	const removeExercise = (index) => {
		if (exercises.length > 1) {
			const updatedExercises = [...exercises];
			updatedExercises.splice(index, 1);
			onChange(updatedExercises);
		}
	};

	// Manejar evento de drag end para reordenar ejercicios
	const handleDragEnd = (event) => {
		const { active, over } = event;

		if (active.id !== over.id) {
			const oldIndex = exercises.findIndex(
				(exercise) => exercise.id === active.id
			);
			const newIndex = exercises.findIndex(
				(exercise) => exercise.id === over.id
			);

			const updatedExercises = arrayMove(exercises, oldIndex, newIndex);
			onChange(updatedExercises);
		}
	};

	return (
		<div className="mb-6">
			<h2 className="text-xl font-semibold text-white mb-4">
				Ejercicios
			</h2>

			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
			>
				<SortableContext
					items={exercises.map((exercise) => exercise.id)}
					strategy={verticalListSortingStrategy}
				>
					{exercises.map((exercise, index) => (
						<ExerciseItem
							key={exercise.id}
							exercise={exercise}
							index={index}
							isFocused={focusedExerciseIndex === index}
							onFocus={() => setFocusedExerciseIndex(index)}
							onBlur={() => setFocusedExerciseIndex(null)}
							savedExercises={savedExercisesList}
							onChange={(field, value) =>
								handleExerciseChange(index, field, value)
							}
							onMoveUp={() => {
								if (index > 0) {
									const updatedExercises = arrayMove(
										exercises,
										index,
										index - 1
									);
									onChange(updatedExercises);
								}
							}}
							onMoveDown={() => {
								if (index < exercises.length - 1) {
									const updatedExercises = arrayMove(
										exercises,
										index,
										index + 1
									);
									onChange(updatedExercises);
								}
							}}
							onAddAfter={() => addExerciseAfter(index)}
							onRemove={() => removeExercise(index)}
							canMoveUp={index > 0}
							canMoveDown={index < exercises.length - 1}
							canRemove={exercises.length > 1}
						/>
					))}
				</SortableContext>
			</DndContext>
		</div>
	);
}
