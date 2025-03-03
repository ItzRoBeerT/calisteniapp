import { getWorkout } from '@/actions/workout';
import { desSlugify } from '@/utils/slugs';
import Link from 'next/link';
import ExerciseHelp from '@/components/workouts/ExerciseHelp';

export default async function WorkoutDetail({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const slug = (await params).slug;
	const workout = await getWorkout(desSlugify(slug));

	if (!workout) {
		return (
			<div className="flex justify-center items-center h-screen">
				<div className="bg-surface p-8 rounded-xl shadow-xl">
					<h2 className="text-2xl font-bold text-center">
						Workout no encontrado
					</h2>
					<p className="text-center mt-4">
						El entrenamiento que buscas no existe o ha sido
						eliminado.
					</p>
					<div className="mt-6 text-center">
						<Link
							href="/workouts"
							className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
						>
							Volver a Entrenamientos
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-10">
			{/* Header con información principal */}
			<div className="bg-gradient-to-r from-primary-900 to-primary-700 rounded-2xl shadow-lg p-8 mb-8">
				<div className="flex flex-col md:flex-row justify-between items-start gap-6">
					<div>
						<h1 className="text-3xl md:text-4xl font-bold">
							{workout.name}
						</h1>

						<div className="flex flex-wrap gap-3 mt-4">
							<span className="bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
								{workout.difficulty}
							</span>
							<span className="bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
								{workout.duration} min
							</span>
						</div>

						{workout.tags && workout.tags.length > 0 && (
							<div className="mt-6">
								<div className="flex flex-wrap gap-2">
									{workout.tags.map((tag, index) => (
										<span
											key={index}
											className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-300 text-primary-900"
										>
											{tag}
										</span>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="flex flex-wrap gap-4 mt-4 md:mt-0">
						<div className="bg-primary-800 rounded-xl p-4 text-center min-w-28">
							<p className="text-sm text-gray-300">Ejercicios</p>
							<p className="text-2xl font-bold">
								{workout.exercises?.length || 0}
							</p>
						</div>

						<div className="bg-primary-800 rounded-xl p-4 text-center min-w-28">
							<p className="text-sm text-gray-300">Duración</p>
							<p className="text-2xl font-bold">
								{workout.duration} min
							</p>
						</div>
					</div>
				</div>

				{workout.description && (
					<div className="mt-6 bg-primary-800 bg-opacity-50 p-4 rounded-lg">
						<h3 className="text-lg font-semibold mb-2">
							Descripción
						</h3>
						<p>{workout.description}</p>
					</div>
				)}
			</div>

			{/* Lista de ejercicios */}
			<div className="bg-surface rounded-2xl shadow-lg overflow-hidden">
				<div className="p-6 border-b border-gray-700">
					<h2 className="text-2xl font-bold">Ejercicios</h2>
				</div>

				{workout.exercises && workout.exercises.length > 0 ? (
					<div className="divide-y divide-gray-700">
						{workout.exercises.map((exercise, index) => (
							<ExerciseHelp
								key={index}
								exercise={exercise}
								index={index}
							/>
						))}
					</div>
				) : (
					<div className="p-8 text-center">
						<p className="text-xl">
							Este workout no tiene ejercicios asignados.
						</p>
					</div>
				)}
			</div>

			{/* Información adicional */}
			<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-surface rounded-xl p-6 shadow-lg">
					<h3 className="text-xl font-bold mb-4">Información</h3>
					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-400">Dificultad</p>
							<p className="font-medium">{workout.difficulty}</p>
						</div>
						<div>
							<p className="text-sm text-gray-400">Creado</p>
							<p className="font-medium">
								{new Date(
									workout.created_at
								).toLocaleDateString()}
							</p>
						</div>
						<div>
							<p className="text-sm text-gray-400">
								Última actualización
							</p>
							<p className="font-medium">
								{new Date(
									workout.updated_at
								).toLocaleDateString()}
							</p>
						</div>
					</div>
				</div>

				<div className="bg-surface rounded-xl p-6 shadow-lg">
					<h3 className="text-xl font-bold mb-4">Estadísticas</h3>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div className="bg-primary-900 rounded-lg p-4 text-center">
							<p className="text-gray-300 text-sm">
								Series totales
							</p>
							<p className="text-2xl font-bold">
								{workout.exercises?.reduce(
									(total, ex) => total + ex.sets,
									0
								) || 0}
							</p>
						</div>
						<div className="bg-primary-900 rounded-lg p-4 text-center">
							<p className="text-gray-300 text-sm">
								Repeticiones
							</p>
							<p className="text-2xl font-bold">
								{workout.exercises?.reduce(
									(total, ex) => total + ex.sets * ex.reps,
									0
								) || 0}
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
