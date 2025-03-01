'use client';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function ExerciseItem({
	exercise,
	index,
	isFocused,
	onFocus,
	onBlur,
	savedExercises,
	onChange,
	onMoveUp,
	onMoveDown,
	onAddAfter,
	onRemove,
	canMoveUp,
	canMoveDown,
	canRemove,
	disabled = false,
}) {
	const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
	const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
	const suggestionsRef = useRef(null);
	const inputRef = useRef(null);

	// Añadimos console.log para debug
	useEffect(() => {
		console.log('Exercises for autocomplete:', savedExercises);
	}, [savedExercises]);

	// Configuración para drag and drop con dnd-kit
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({
		id: exercise.id,
		disabled: disabled,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
		zIndex: isDragging ? 999 : 1,
	};

	// Manejar el cambio de nombre y mostrar sugerencias
	const handleNameChange = (e) => {
		if (disabled) return;

		const value = e.target.value;
		onChange('name', value);

		// Filtrar sugerencias - Añadimos logs para depuración
		if (value.length > 0) {
			console.log('Input value:', value);
			console.log('Filtering from exercises:', savedExercises);

			const filtered = savedExercises.filter((ex) =>
				ex.toLowerCase().includes(value.toLowerCase())
			);

			console.log('Filtered suggestions:', filtered);
			setAutocompleteSuggestions(filtered);
			setSelectedSuggestionIndex(filtered.length > 0 ? 0 : -1);

			// Siempre mostrar las sugerencias si hay input y sugerencias filtradas
			if (filtered.length > 0) {
				// Forzamos muestra de sugerencias aunque no esté enfocado
				onFocus();
			}
		} else {
			setAutocompleteSuggestions([]);
		}
	};

	// Manejar navegación de teclado en sugerencias
	const handleKeyDown = (e) => {
		if (disabled) return;

		const hasSuggestions = autocompleteSuggestions.length > 0;

		switch (e.key) {
			case 'Enter':
				if (selectedSuggestionIndex >= 0 && hasSuggestions) {
					e.preventDefault();
					selectSuggestion(
						autocompleteSuggestions[selectedSuggestionIndex]
					);
				}
				break;

			case 'ArrowDown':
				if (hasSuggestions) {
					e.preventDefault();
					setSelectedSuggestionIndex((prevIndex) =>
						prevIndex < autocompleteSuggestions.length - 1
							? prevIndex + 1
							: 0
					);
				}
				break;

			case 'ArrowUp':
				if (hasSuggestions) {
					e.preventDefault();
					setSelectedSuggestionIndex((prevIndex) =>
						prevIndex > 0
							? prevIndex - 1
							: autocompleteSuggestions.length - 1
					);
				}
				break;

			case 'Escape':
				setAutocompleteSuggestions([]);
				break;
		}
	};

	// Seleccionar una sugerencia
	const selectSuggestion = (suggestion) => {
		if (disabled) return;

		console.log('Selected suggestion:', suggestion);
		onChange('name', suggestion);
		setAutocompleteSuggestions([]);
		inputRef.current?.blur();
	};

	// Manejar foco en el input para mostrar sugerencias
	const handleInputFocus = () => {
		if (disabled) return;

		onFocus();

		// Mostrar sugerencias basadas en el texto actual
		if (exercise.name) {
			console.log('Showing suggestions for:', exercise.name);
			const filtered = savedExercises.filter((ex) =>
				ex.toLowerCase().includes(exercise.name.toLowerCase())
			);
			console.log('Suggestions on focus:', filtered);

			if (filtered.length > 0) {
				setAutocompleteSuggestions(filtered);
				setSelectedSuggestionIndex(0);
			}
		}
	};

	// Cerrar sugerencias al hacer clic fuera
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				suggestionsRef.current &&
				!suggestionsRef.current.contains(event.target) &&
				!inputRef.current?.contains(event.target)
			) {
				setAutocompleteSuggestions([]);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={`bg-background border border-gray-800 rounded-lg mb-4 relative transition-colors ${
				isDragging ? 'border-primary-500' : ''
			} ${disabled ? 'opacity-75' : ''}`}
		>
			{/* Drag handle */}
			{!disabled && (
				<div
					{...attributes}
					{...listeners}
					className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-full cursor-grab active:cursor-grabbing text-gray-400 hover:text-primary-400"
					title="Arrastrar para reordenar"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="h-6 w-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 9l4-4 4 4m0 6l-4 4-4-4"
						/>
					</svg>
				</div>
			)}

			<div className="flex justify-between items-start p-4 pb-0 pl-12">
				<h3 className="font-medium text-primary-300">
					Ejercicio {index + 1}
				</h3>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 pl-12">
				<div className="relative md:col-span-2">
					<label
						className="block text-gray-300 text-sm mb-1"
						htmlFor={`exercise-name-${exercise.id}`}
					>
						Nombre
					</label>
					<input
						ref={inputRef}
						type="text"
						id={`exercise-name-${exercise.id}`}
						name="name"
						value={exercise.name}
						onChange={handleNameChange}
						onKeyDown={handleKeyDown}
						onFocus={handleInputFocus}
						onBlur={onBlur}
						className={`w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm ${
							disabled ? 'cursor-not-allowed' : ''
						}`}
						required
						autoComplete="off"
						disabled={disabled}
					/>

					{/* Añadimos un mensaje cuando no hay sugerencias pero hay texto */}
					{!disabled &&
						exercise.name &&
						isFocused &&
						autocompleteSuggestions.length === 0 && (
							<div className="absolute z-10 mt-1 w-full bg-surface border border-gray-700 rounded-md shadow-lg p-3 text-sm text-gray-300">
								No se encontraron ejercicios que coincidan.
								Escribe el nombre exacto de un ejercicio
								existente.
							</div>
						)}

					{!disabled &&
						isFocused &&
						autocompleteSuggestions.length > 0 && (
							<div
								ref={suggestionsRef}
								className="absolute z-10 mt-1 w-full bg-surface border border-gray-700 rounded-md shadow-lg max-h-60 overflow-auto"
							>
								{autocompleteSuggestions.map(
									(suggestion, i) => (
										<div
											key={i}
											className={`px-4 py-2 cursor-pointer text-white text-sm ${
												i === selectedSuggestionIndex
													? 'bg-primary-900'
													: 'hover:bg-background'
											}`}
											onClick={() =>
												selectSuggestion(suggestion)
											}
										>
											{suggestion}
										</div>
									)
								)}
							</div>
						)}
				</div>

				<div>
					<label
						className="block text-gray-300 text-sm mb-1"
						htmlFor={`exercise-sets-${exercise.id}`}
					>
						Series{' '}
						<span className="text-gray-500">(afecta duración)</span>
					</label>
					<input
						type="number"
						id={`exercise-sets-${exercise.id}`}
						name="sets"
						value={exercise.sets}
						onChange={(e) =>
							!disabled && onChange('sets', e.target.value)
						}
						className={`w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm ${
							disabled ? 'cursor-not-allowed' : ''
						}`}
						min="1"
						required
						disabled={disabled}
					/>
				</div>

				<div>
					<div className="flex justify-between items-center">
						<label
							className="block text-gray-300 text-sm mb-1"
							htmlFor={`exercise-reps-${exercise.id}`}
						>
							Repeticiones
						</label>
					</div>
					<input
						type="number"
						id={`exercise-reps-${exercise.id}`}
						name="reps"
						value={exercise.reps}
						onChange={(e) =>
							!disabled && onChange('reps', e.target.value)
						}
						className={`w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm ${
							disabled ? 'cursor-not-allowed' : ''
						}`}
						min="1"
						required
						disabled={disabled}
					/>
				</div>
			</div>

			{/* Segunda fila para descanso */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 pl-12 pt-0">
				<div className="md:col-span-2">
					{/* Espacio vacío para alinear con la columna de nombre */}
				</div>
				<div>
					<label
						className="block text-gray-300 text-sm mb-1"
						htmlFor={`exercise-rest-${exercise.id}`}
					>
						Descanso (seg)
						<span className="text-gray-500 ml-1">
							(entre series)
						</span>
					</label>
					<input
						type="number"
						id={`exercise-rest-${exercise.id}`}
						name="rest"
						value={exercise.rest || 60}
						onChange={(e) =>
							!disabled && onChange('rest', e.target.value)
						}
						className={`w-full px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm ${
							disabled ? 'cursor-not-allowed' : ''
						}`}
						min="0"
						disabled={disabled}
					/>
				</div>
				<div>
					{/* Espacio para posible campo futuro o información */}
				</div>
			</div>

			{/* Controls para manipular el ejercicio */}
			{!disabled && (
				<div className="absolute top-4 right-4 flex space-x-1">
					<button
						type="button"
						onClick={onMoveUp}
						disabled={!canMoveUp}
						className={`p-1 rounded ${
							!canMoveUp
								? 'text-gray-600 cursor-not-allowed'
								: 'text-primary-400 hover:bg-surface hover:text-primary-300'
						}`}
						title="Mover arriba"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={onMoveDown}
						disabled={!canMoveDown}
						className={`p-1 rounded ${
							!canMoveDown
								? 'text-gray-600 cursor-not-allowed'
								: 'text-primary-400 hover:bg-surface hover:text-primary-300'
						}`}
						title="Mover abajo"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={onAddAfter}
						className="p-1 text-secondary-500 hover:bg-surface hover:text-secondary-400 rounded"
						title="Añadir ejercicio después"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
					<button
						type="button"
						onClick={onRemove}
						disabled={!canRemove}
						className={`p-1 rounded ${
							!canRemove
								? 'text-gray-600 cursor-not-allowed'
								: 'text-red-500 hover:bg-surface hover:text-red-400'
						}`}
						title="Eliminar ejercicio"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-5 w-5"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
								clipRule="evenodd"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
