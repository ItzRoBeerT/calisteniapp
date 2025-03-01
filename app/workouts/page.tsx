'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WorkoutList() {
	const [workouts, setWorkouts] = useState([
		{
			id: 1,
			name: 'Entrenamiento de fuerza',
			difficulty: 'Intermedio',
			duration: '45 min',
			isCreator: true,
		},
		{
			id: 2,
			name: 'Cardio intenso',
			difficulty: 'Avanzado',
			duration: '30 min',
			isCreator: false,
		},
		{
			id: 3,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 4,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 5,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 6,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 7,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 8,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 9,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 10,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
		{
			id: 11,
			name: 'Yoga para principiantes',
			difficulty: 'Principiante',
			duration: '60 min',
			isCreator: true,
		},
	]);
	const router = useRouter();

	return (
		<div className="min-h-screen text-white p-4 md:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold">Entrenamientos</h1>
				<button
					onClick={() => router.push('/workouts/new')}
					className="bg-primary-600 hover:bg-primary-700 text-white font-medium px-4 py-2 rounded"
				>
					Añadir Workout
				</button>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{workouts.map((workout) => (
					<div
						key={workout.id}
						className={`rounded-lg shadow-lg transition-transform duration-300 cursor-pointer hover:scale-105 
              ${
					workout.isCreator
						? 'bg-gray-900 border border-primary-500'
						: 'bg-gray-800'
				}`}
						onClick={() => router.push(`/workouts/${workout.id}`)}
					>
						<div className="p-5">
							<div className="flex justify-between items-start mb-2">
								<h2 className="text-xl font-semibold">
									{workout.name}
								</h2>
								{workout.isCreator && (
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
									<span className="bg-tertiary-900 text-tertiary-200 px-2 py-1 rounded text-xs">
										{workout.duration}
									</span>
								</div>
								<span>Duración: {workout.duration}</span>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
