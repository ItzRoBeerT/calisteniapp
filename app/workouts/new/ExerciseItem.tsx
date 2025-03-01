'use client';
import { useState, useRef, useEffect } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Definimos tiempos de descanso predefinidos en segundos fuera del componente
const REST_TIMES = [30, 60, 90, 120, 180];

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
	const [showCustomRest, setShowCustomRest] = useState(() => {
		// Inicializar comprobando si el valor actual no está en los predefinidos
		const currentRest = Number(exercise.rest || 60);
		return !REST_TIMES.includes(currentRest);
	});
	const suggestionsRef = useRef(null);
	const inputRef = useRef(null);

	// Verificamos si el descanso actual es uno de los predefinidos al cargar
	useEffect(() => {
		const currentRest = Number(exercise.rest || 60);
		if (!REST_TIMES.includes(currentRest)) {
			setShowCustomRest(true);
		}
	}, []);

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

		// Filtrar sugerencias
		if (value.length > 0) {
			const filtered = savedExercises.filter((ex) =>
				ex.toLowerCase().includes(value.toLowerCase())
			);

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
			const filtered = savedExercises.filter((ex) =>
				ex.toLowerCase().includes(exercise.name.toLowerCase())
			);

			if (filtered.length > 0) {
				setAutocompleteSuggestions(filtered);
				setSelectedSuggestionIndex(0);
			}
		}
	};

	// Establecer tiempo de descanso predefinido
	const handleRestButtonClick = (time) => {
		if (disabled) return;
		onChange('rest', time);
		setShowCustomRest(false);
	};

	// Manejar clic en el botón "Otro"
	const handleCustomButtonClick = () => {
		if (disabled) return;
		setShowCustomRest(true);
	};

	// Manejar cambio en tiempo de descanso personalizado
	const handleCustomRestChange = (e) => {
		if (disabled) return;
		onChange('rest', e.target.value);
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

					{/* Mensaje cuando no hay sugerencias pero hay texto */}
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

			{/* Nueva fila para descanso con botones */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 pl-12 pt-0">
				<div className="md:col-span-2">
					<label className="block text-gray-300 text-sm mb-1">
						Descanso (seg)
						<span className="text-gray-500 ml-1">
							(entre series)
						</span>
					</label>
					<div className="flex items-center flex-wrap gap-2">
						{REST_TIMES.map((time) => (
							<button
								key={time}
								type="button"
								onClick={() => handleRestButtonClick(time)}
								className={`px-3 py-2 rounded-lg border text-sm ${
									Number(exercise.rest) === time
										? 'bg-primary-700 border-primary-500 text-white'
										: 'bg-surface border-gray-700 text-gray-300 hover:bg-gray-800'
								} ${
									disabled
										? 'opacity-50 cursor-not-allowed'
										: ''
								}`}
								disabled={disabled}
							>
								{time}s
							</button>
						))}
						<button
							type="button"
							onClick={handleCustomButtonClick}
							className={`px-3 py-2 rounded-lg border text-sm ${
								showCustomRest
									? 'bg-primary-700 border-primary-500 text-white'
									: 'bg-surface border-gray-700 text-gray-300 hover:bg-gray-800'
							} ${
								disabled ? 'opacity-50 cursor-not-allowed' : ''
							}`}
							disabled={disabled}
						>
							Otro
						</button>

						{showCustomRest && (
							<div className="flex items-center ml-2">
								<input
									type="number"
									value={exercise.rest || 60}
									onChange={handleCustomRestChange}
									className={`w-20 px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm ${
										disabled ? 'cursor-not-allowed' : ''
									}`}
									min="0"
									disabled={disabled}
								/>
								<span className="ml-2 text-gray-400 text-sm">
									segundos
								</span>
							</div>
						)}
					</div>
				</div>

				<div>
					{/* Espacio para posible campo futuro o información */}
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
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M5 15l7-7 7 7"
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
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 9l-7 7-7-7"
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
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M12 4v16m8-8H4"
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
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth="2"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			)}
		</div>
	);
}
