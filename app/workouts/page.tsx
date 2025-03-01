'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getWorkouts } from '@/actions/workout';

type Exercise = {
	id: string;
	name: string;
	sets: number;
	reps: number;
	rest: number;
	position: number;
	exerciseDetails: any;
};

type Workout = {
	id: number;
	name: string;
	difficulty: string;
	duration: number;
	description: string;
	tags: string[];
	exercises: Exercise[];
	created_at: string;
	user_id: string;
};

export default function WorkoutList() {
	const [workouts, setWorkouts] = useState<Workout[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentUserId, setCurrentUserId] = useState<string | null>(null);
	const router = useRouter();

	useEffect(() => {
		async function fetchData() {
			try {
				setLoading(true);

				const { createClient } = await import(
					'@/utils/supabase/client'
				);
				const supabase = createClient();

				const {
					data: { user },
				} = await supabase.auth.getUser();
				if (user) {
					setCurrentUserId(user.id);
				}

				const data = await getWorkouts();
				setWorkouts(data);
			} catch (error) {
				console.error('Error fetching data:', error);
			} finally {
				setLoading(false);
			}
		}

		fetchData();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen flex justify-center items-center text-white">
				<div className="text-xl">Cargando entrenamientos...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen text-white p-4 md:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Entrenamientos</h1>
				{currentUserId && (
					<button
						onClick={() => router.push('/workouts/new')}
						className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded"
					>
						Añadir Workout
					</button>
				)}
			</div>

			{workouts.length === 0 ? (
				<div className="text-center py-12">
					<p className="text-xl text-gray-400 mb-4">
						No hay entrenamientos disponibles
					</p>
					{currentUserId ? (
						<button
							onClick={() => router.push('/workouts/new')}
							className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded"
						>
							Crear tu primer entrenamiento
						</button>
					) : (
						<p className="text-gray-400">
							Inicia sesión para crear entrenamientos
						</p>
					)}
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{workouts.map((workout) => {
						const formattedDuration = `${workout.duration} min`;

						const isCurrentUser = currentUserId
							? workout.user_id === currentUserId
							: false;

						return (
							<div
								key={workout.id}
								className={`rounded-lg shadow-lg transition-transform duration-300 cursor-pointer hover:scale-105 
                  ${
						isCurrentUser
							? 'bg-gray-900 border border-primary-500'
							: 'bg-gray-800'
					}`}
								onClick={() =>
									router.push(`/workouts/${workout.id}`)
								}
							>
								<div className="p-5">
									<div className="flex justify-between items-start mb-2">
										<h2 className="text-xl font-semibold">
											{workout.name}
										</h2>
										{isCurrentUser && (
											<span className="bg-primary-900 text-primary-200 px-2 py-1 rounded text-xs">
												Tu workout
											</span>
										)}
									</div>
									<div className="flex justify-between text-gray-400">
										<div className="justify-start">
											<span className="bg-secondary-900 text-secondary-200 px-2 py-1 rounded text-xs mr-2">
												{workout.difficulty}
											</span>
											{workout.tags &&
												workout.tags.length > 0 && (
													<span className="bg-tertiary-900 text-tertiary-200 px-2 py-1 rounded text-xs">
														{workout.tags[0]}
													</span>
												)}
										</div>
										<span>
											Duración: {formattedDuration}
										</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
