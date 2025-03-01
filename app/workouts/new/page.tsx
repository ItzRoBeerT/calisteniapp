'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseList from './ExerciseList';
import TagInput from './TagInput';
import { createWorkout } from '@/actions/workout';
import { getExercisesByNames } from '@/actions/exercise';

// Sugerencias predefinidas para tags
const DEFAULT_TAG_SUGGESTIONS = [
	'Fuerza',
	'Resistencia',
	'Cardio',
	'HIIT',
	'Full Body',
	'Tren Superior',
	'Tren Inferior',
	'Core',
	'Sin Equipamiento',
	'Peso Corporal',
	'Mancuernas',
	'Recuperación',
	'Rápido',
];

export default function AddWorkout() {
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');
	const [exercises, setExercises] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	const [workout, setWorkout] = useState({
		name: '',
		difficulty: 'Principiante',
		duration: 0,
		description: '',
		exercises: [{ name: '', sets: 3, reps: 10, rest: 60, id: '1' }],
		tags: [],
	});

	// Cargar ejercicios desde Supabase al iniciar
	useEffect(() => {
		const loadExercises = async () => {
			setIsLoading(true);
			try {
				const exerciseNames = await getExercisesByNames();
				console.log('Loaded exercises:', exerciseNames);
				setExercises(exerciseNames || []);
			} catch (error) {
				console.error('Error al cargar ejercicios:', error);
				setErrorMessage(
					'No se pudieron cargar los ejercicios. Intenta de nuevo más tarde.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		loadExercises();
	}, []);

	useEffect(() => {
		// Calcular la duración total basada en las series, repeticiones y descanso
		const totalDuration = workout.exercises.reduce((total, exercise) => {
			// Tiempo por serie (aproximadamente 30 segundos por serie) + tiempo de descanso entre series
			const exerciseTime = exercise.sets * 30;
			const restTime = (exercise.sets - 1) * (exercise.rest || 60);
			return total + exerciseTime + restTime;
		}, 0);

		// Convertir segundos a minutos redondeando hacia arriba
		const durationInMinutes = Math.ceil(totalDuration / 60);

		setWorkout((prev) => ({
			...prev,
			duration: durationInMinutes,
		}));
	}, [workout.exercises]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setWorkout({
			...workout,
			[name]: value,
		});
	};

	const handleAddTag = (tag) => {
		if (tag && !workout.tags.includes(tag)) {
			setWorkout({
				...workout,
				tags: [...workout.tags, tag],
			});
			return true; // Tag añadido exitosamente
		}
		return false; // No se pudo añadir el tag (duplicado o vacío)
	};

	const handleRemoveTag = (tagToRemove) => {
		setWorkout({
			...workout,
			tags: workout.tags.filter((tag) => tag !== tagToRemove),
		});
	};

	const handleExerciseChange = (updatedExercises) => {
		setWorkout({
			...workout,
			exercises: updatedExercises,
		});
	};

	const handleGlobalRestChange = (seconds) => {
		// Actualizar el descanso de todos los ejercicios
		const updatedExercises = workout.exercises.map((exercise) => ({
			...exercise,
			rest: parseInt(seconds),
		}));

		setWorkout({
			...workout,
			exercises: updatedExercises,
		});
	};

	const validateWorkout = () => {
		// Verificar nombre
		if (!workout.name.trim()) {
			setErrorMessage('El nombre del workout es obligatorio');
			return false;
		}

		// Verificar que haya al menos un ejercicio con nombre
		if (workout.exercises.length === 0) {
			setErrorMessage('Debes añadir al menos un ejercicio');
			return false;
		}

		// Verificar que todos los ejercicios tengan nombre
		for (const exercise of workout.exercises) {
			if (!exercise.name.trim()) {
				setErrorMessage('Todos los ejercicios deben tener un nombre');
				return false;
			}

			// Verificar que el ejercicio exista en nuestra base de datos
			if (!exercises.includes(exercise.name)) {
				setErrorMessage(
					`El ejercicio "${exercise.name}" no existe en nuestra base de datos`
				);
				return false;
			}
		}

		// Verificar descripción
		if (!workout.description.trim()) {
			setErrorMessage('La descripción es obligatoria');
			return false;
		}

		return true;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Validar formulario
		if (!validateWorkout()) {
			return;
		}

		// Restablecer mensajes de error
		setErrorMessage('');
		setIsSubmitting(true);

		try {
			// Preparar data para enviar
			const workoutData = {
				name: workout.name,
				difficulty: workout.difficulty,
				duration: workout.duration,
				description: workout.description,
				exercises: workout.exercises.map(({ id, ...rest }) => rest), // Excluir el id temporal
				tags: workout.tags,
			};

			console.log('Submitting workout data:', workoutData);

			// Guardar workout en Supabase
			const result = await createWorkout(workoutData);
			console.log('Create workout result:', result);

			if (result.success) {
				alert('Workout guardado con éxito!');
				router.push('/workouts');
			} else {
				setErrorMessage(result.error || 'Error al guardar el workout');
			}
		} catch (error) {
			console.error('Error al guardar el workout:', error);
			setErrorMessage('Ocurrió un error al guardar el workout');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Para fines de depuración, verificamos si hay ejercicios cargados
	useEffect(() => {
		if (!isLoading) {
			console.log('Loaded exercises count:', exercises.length);
			if (exercises.length === 0) {
				console.warn('No se han cargado ejercicios desde Supabase');
				// Podemos poner un mensaje para el usuario
				setErrorMessage(
					'No se encontraron ejercicios en la base de datos. Por favor, asegúrate de que existan ejercicios en la tabla Exercise.'
				);
			}
		}
	}, [isLoading, exercises]);

	if (isLoading) {
		return (
			<div className="min-h-screen bg-background text-white p-4 md:p-8 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent mb-4"></div>
					<p className="text-white">Cargando ejercicios...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background text-white p-4 md:p-8">
			<button
				onClick={() => router.back()}
				className="mb-4 text-primary-400 hover:text-primary-300"
				disabled={isSubmitting}
			>
				← Volver
			</button>

			<h1 className="text-3xl font-bold mb-6">Añadir Nuevo Workout</h1>

			{/* Debug información */}
			<div className="mb-4 bg-gray-900 p-3 rounded-lg text-xs">
				<p className="text-gray-300">
					Ejercicios disponibles: {exercises.length}
				</p>
				<details>
					<summary className="cursor-pointer text-primary-400">
						Ver lista de ejercicios
					</summary>
					<div className="mt-2 max-h-40 overflow-auto p-2 bg-gray-800 rounded">
						{exercises.length > 0 ? (
							exercises.map((ex, i) => (
								<div key={i} className="text-gray-300 mb-1">
									{ex}
								</div>
							))
						) : (
							<p className="text-red-400">
								No hay ejercicios disponibles
							</p>
						)}
					</div>
				</details>
			</div>

			{errorMessage && (
				<div className="bg-red-900 text-white p-3 rounded-lg mb-4">
					{errorMessage}
				</div>
			)}

			<form
				onSubmit={handleSubmit}
				className="bg-surface rounded-lg shadow-lg p-6"
			>
				<div className="mb-4">
					<label
						className="block text-white font-medium mb-2"
						htmlFor="name"
					>
						Nombre del Workout
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={workout.name}
						onChange={handleChange}
						className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
						required
						disabled={isSubmitting}
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
					<div>
						<label
							className="block text-white font-medium mb-2"
							htmlFor="difficulty"
						>
							Dificultad
						</label>
						<select
							id="difficulty"
							name="difficulty"
							value={workout.difficulty}
							onChange={handleChange}
							className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
							disabled={isSubmitting}
						>
							<option value="Principiante">Principiante</option>
							<option value="Intermedio">Intermedio</option>
							<option value="Avanzado">Avanzado</option>
						</select>
					</div>

					<div>
						<label
							className="block text-white font-medium mb-2"
							htmlFor="tags"
						>
							Tags
						</label>
						<TagInput
							tags={workout.tags}
							suggestions={DEFAULT_TAG_SUGGESTIONS}
							onAddTag={handleAddTag}
							onRemoveTag={handleRemoveTag}
							disabled={isSubmitting}
						/>
						<div className="text-xs text-gray-400 mt-1">
							Duración estimada: {workout.duration} minutos
						</div>
					</div>
				</div>

				<div className="mb-6">
					<label
						className="block text-white font-medium mb-2"
						htmlFor="description"
					>
						Descripción
					</label>
					<textarea
						id="description"
						name="description"
						value={workout.description}
						onChange={handleChange}
						rows="4"
						className="w-full px-3 py-2 bg-background border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
						required
						disabled={isSubmitting}
					></textarea>
				</div>

				{/* Configuración global de descanso */}
				<div className="mb-6 p-4 bg-background border border-gray-800 rounded-lg">
					<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
						<div>
							<h3 className="font-medium text-primary-300 mb-1">
								Configuración global de descanso
							</h3>
							<p className="text-sm text-gray-400">
								Establece el tiempo de descanso entre series
								para todos los ejercicios
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="grid grid-cols-4 gap-2">
								{[30, 45, 60, 90].map((seconds) => (
									<button
										key={seconds}
										type="button"
										onClick={() =>
											handleGlobalRestChange(seconds)
										}
										className={`px-3 py-2 rounded-md text-center border ${
											workout.exercises.every(
												(ex) =>
													(ex.rest || 60) === seconds
											)
												? 'bg-primary-900 border-primary-700 text-primary-300'
												: 'bg-surface border-gray-700 text-gray-300 hover:border-primary-700'
										}`}
										disabled={isSubmitting}
									>
										{seconds}s
									</button>
								))}
							</div>
							<div className="relative">
								<input
									type="number"
									value={workout.exercises[0]?.rest || 60}
									onChange={(e) =>
										handleGlobalRestChange(e.target.value)
									}
									className="w-24 px-3 py-2 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white text-sm"
									min="0"
									step="5"
									disabled={isSubmitting}
								/>
								<span className="absolute right-3 top-2 text-gray-400">
									s
								</span>
							</div>
						</div>
					</div>
				</div>

				<ExerciseList
					exercises={workout.exercises}
					savedExercisesList={exercises}
					onChange={handleExerciseChange}
					disabled={isSubmitting}
				/>

				<div className="flex justify-between items-center pt-4 border-t border-gray-800">
					<button
						type="button"
						onClick={() => router.push('/workouts')}
						className="bg-surface hover:bg-background text-white font-medium px-6 py-2 rounded border border-gray-700"
						disabled={isSubmitting}
					>
						Cancelar
					</button>

					<div className="flex items-center space-x-2">
						<div className="text-gray-400 text-sm">
							Duración final:{' '}
							<span className="font-bold text-white">
								{workout.duration} minutos
							</span>
						</div>
						<button
							type="submit"
							className={`bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-2 rounded 
                ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
							disabled={isSubmitting}
						>
							{isSubmitting ? 'Guardando...' : 'Guardar Workout'}
						</button>
					</div>
				</div>
			</form>
		</div>
	);
}
