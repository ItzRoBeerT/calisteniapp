'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ExerciseList from './ExerciseList';
import TagInput from '@/components/workouts/TagInput';
import { createWorkout } from '@/actions/workout';
import { getExercises } from '@/actions/exercise';

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
				const exercises = await getExercises();
				const exerciseNames =
					exercises?.map(
						(exercise: { name: string }) => exercise.name
					) || [];
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
			const exerciseTime = exercise.sets * exercise.reps * 6;
			const restTime = exercise.sets * (exercise.rest || 60);
			console.log(exercise.sets * exercise.reps * 10);
			return total + exerciseTime + restTime;
		}, 0);

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
			<div className="min-h-screen text-white p-4 md:p-8 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-r-transparent mb-4"></div>
					<p className="text-white">Cargando ejercicios...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white p-4 md:p-8">
			<h1 className="text-3xl font-bold mb-6">Añadir Nuevo Workout</h1>

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
						disabled={isSubmitting}
					></textarea>
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
						{Number.isFinite(workout.duration) &&
							workout.duration > 0 && (
								<div className="text-gray-400 text-sm">
									Duración final:{' '}
									<span className="font-bold text-white">
										{workout.duration} minutos
									</span>
								</div>
							)}

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
