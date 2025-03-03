import { getWorkout } from '@/actions/workout';
import { getUserById } from '@/actions/user';
import { desSlugify } from '@/utils/slugs';
import { formatTime } from '@/utils/formatters';
import Link from 'next/link';
import ExerciseHelp from '@/components/workouts/ExerciseHelp';
import WorkoutStats from '@/components/workouts/WorkoutStats';

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

	// Obtener información del usuario
	let userData = null;
	if (workout.user_id) {
		userData = await getUserById(workout.user_id);
	}

	// Calcular estadísticas
	const totalSets =
		workout.exercises?.reduce((total, ex) => total + ex.sets, 0) || 0;
	const totalReps =
		workout.exercises?.reduce(
			(total, ex) => total + ex.sets * ex.reps,
			0
		) || 0;

	// Datos para el gráfico
	const exerciseData =
		workout.exercises && workout.exercises.length > 0
			? workout.exercises.map((ex) => ({
					name: ex.name || 'Ejercicio sin nombre',
					sets: ex.sets || 0,
					reps: ex.reps || 0,
					volume: (ex.sets || 0) * (ex.reps || 0),
			  }))
			: [];

	return (
		<div className="container mx-auto px-4 py-6">
			{/* Lista de ejercicios - Ahora es el componente principal */}
			<div className="bg-surface rounded-2xl shadow-lg overflow-hidden mb-8">
				<div className="bg-gradient-to-r from-primary-800 to-primary-600 p-6">
					<div className="flex flex-col md:flex-row justify-between items-start gap-4">
						<div>
							<h1 className="text-3xl md:text-4xl font-bold">
								{workout.name}
							</h1>

							<div className="flex flex-wrap gap-3 mt-2">
								<span className="bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
									{workout.difficulty}
								</span>
								<span className="bg-secondary-500 text-white text-sm font-medium px-3 py-1 rounded-full">
									{workout.duration} min
								</span>
							</div>
						</div>

						<div className="flex flex-wrap gap-3 mt-3 md:mt-0">
							{workout.tags &&
								workout.tags.length > 0 &&
								workout.tags.map((tag, index) => (
									<span
										key={index}
										className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-300 text-primary-900"
									>
										{tag}
									</span>
								))}
						</div>
					</div>

					{workout.description && (
						<div className="mt-4 bg-primary-800 bg-opacity-50 p-3 rounded-lg">
							<p className="text-sm">{workout.description}</p>
						</div>
					)}
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

			{/* Información y estadísticas en grid de 2 columnas */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="bg-surface rounded-xl p-6 shadow-lg">
					<div className="flex justify-between items-start mb-4">
						<h3 className="text-xl font-bold">Información</h3>
						{userData && (
							<Link
								href={`/users/${userData.username}`}
								className="flex items-center gap-2 bg-primary-700 hover:bg-primary-600 transition-colors p-2 rounded-lg"
							>
								{userData.avatar_url && (
									<div className="w-6 h-6 rounded-full overflow-hidden bg-gray-600">
										<img
											src={userData.avatar_url}
											alt={userData.username}
											className="w-full h-full object-cover"
										/>
									</div>
								)}
								<span className="text-sm font-medium">
									@{userData.username}
								</span>
							</Link>
						)}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div>
							<p className="text-sm text-gray-400">Dificultad</p>
							<p className="font-medium">{workout.difficulty}</p>
						</div>
						<div>
							<p className="text-sm text-gray-400">Duración</p>
							<p className="font-medium">
								{workout.duration} minutos
							</p>
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
					{exerciseData.length > 0 ? (
						<WorkoutStats exerciseData={exerciseData} />
					) : (
						<div className="flex items-center justify-center h-64 bg-surface-dark rounded-lg">
							<p className="text-gray-400">
								No hay datos suficientes para mostrar
								estadísticas
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
