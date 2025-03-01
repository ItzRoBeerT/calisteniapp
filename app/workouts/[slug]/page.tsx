'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkoutDetail({ params }) {
	const router = useRouter();
	const { id } = params;
	const [workout, setWorkout] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isCreator, setIsCreator] = useState(false);

	useEffect(() => {
		// En una aplicación real, aquí harías una petición a tu API
		// y comprobarías si el usuario actual es el creador
		// Simulamos la carga de datos de un workout específico
		setTimeout(() => {
			// Simulamos que el usuario es creador de los workouts con ID 1 y 3
			const userIsCreator = id === '1' || id === '3';
			setIsCreator(userIsCreator);

			setWorkout({
				id: parseInt(id),
				name:
					id === '1'
						? 'Entrenamiento de fuerza'
						: id === '2'
						? 'Cardio intenso'
						: 'Yoga para principiantes',
				difficulty:
					id === '1'
						? 'Intermedio'
						: id === '2'
						? 'Avanzado'
						: 'Principiante',
				duration:
					id === '1' ? '45 min' : id === '2' ? '30 min' : '60 min',
				description:
					'Este es un entrenamiento completo que te ayudará a mejorar tu condición física. Incluye una serie de ejercicios diseñados para maximizar tus resultados.',
				createdBy: userIsCreator ? 'Tú' : 'Otro usuario',
				exercises: [
					{ name: 'Ejercicio 1', sets: 3, reps: 12 },
					{ name: 'Ejercicio 2', sets: 4, reps: 10 },
					{ name: 'Ejercicio 3', sets: 3, reps: 15 },
				],
			});
			setLoading(false);
		}, 500);
	}, [id]);

	const handleEdit = () => {
		router.push(`/workouts/editar/${id}`);
	};

	const handleDelete = () => {
		if (confirm('¿Estás seguro de que quieres eliminar este workout?')) {
			// Aquí irían las llamadas a la API para eliminar el workout
			alert('Workout eliminado con éxito');
			router.push('/workouts');
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen text-white p-8">
				<p className="text-center">Cargando...</p>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white p-4 md:p-8">
			<div
				className={`rounded-lg shadow-lg p-6 ${
					isCreator
						? 'bg-gray-900 border border-blue-500'
						: 'bg-gray-800'
				}`}
			>
				<div className="flex justify-between items-start mb-4">
					<h1 className="text-3xl font-bold">{workout.name}</h1>

					{isCreator && (
						<div className="flex space-x-2">
							<button
								onClick={handleEdit}
								className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
							>
								Editar
							</button>
							<button
								onClick={handleDelete}
								className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
							>
								Eliminar
							</button>
						</div>
					)}
				</div>

				{isCreator && (
					<div className="bg-blue-900 text-blue-200 px-4 py-2 rounded-md mb-4 text-sm">
						Este es tu workout. Puedes editarlo o eliminarlo.
					</div>
				)}

				<div className="flex justify-between mb-6">
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							isCreator
								? 'bg-primary-800 text-primary-200'
								: 'bg-gray-700 text-gray-200'
						}`}
					>
						Dificultad: {workout.difficulty}
					</span>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${
							isCreator
								? 'bg-blue-800 text-blue-200'
								: 'bg-gray-700 text-gray-200'
						}`}
					>
						Duración: {workout.duration}
					</span>
				</div>

				<div className="mb-6">
					<div className="flex justify-between items-center mb-2">
						<h2 className="text-xl font-semibold">Descripción</h2>
						<span
							className={`text-sm ${
								isCreator ? 'text-blue-400' : 'text-gray-400'
							}`}
						>
							Creado por: {workout.createdBy}
						</span>
					</div>
					<p className="text-gray-300">{workout.description}</p>
				</div>

				<div>
					<h2 className="text-xl font-semibold mb-2">Ejercicios</h2>
					<div className="space-y-4">
						{workout.exercises.map((exercise, index) => (
							<div
								key={index}
								className={`p-4 rounded-lg ${
									isCreator ? 'bg-gray-800' : 'bg-gray-700'
								}`}
							>
								<h3 className="font-medium">{exercise.name}</h3>
								<div className="flex space-x-4 mt-2 text-sm text-gray-400">
									<span>{exercise.sets} series</span>
									<span>{exercise.reps} repeticiones</span>
								</div>
							</div>
						))}
					</div>
				</div>

				{isCreator && (
					<div className="mt-6 pt-4 border-t border-gray-700">
						<h3 className="text-lg font-semibold mb-2">
							Opciones adicionales
						</h3>
						<div className="flex flex-wrap gap-2">
							<button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm">
								Compartir
							</button>
							<button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm">
								Duplicar
							</button>
							<button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded-md text-sm">
								Ver estadísticas
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
