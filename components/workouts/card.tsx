'use client';
import { useRouter } from 'next/navigation';
import { Workout } from '@/types/supabase';

export default function WorkoutCard({
	workout,
	currentUserId,
}: {
	workout: Workout;
	currentUserId: string | null;
}) {
	const router = useRouter();
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
			onClick={() => router.push(`/workouts/${workout.id}`)}
		>
			<div className="p-5">
				<div className="flex justify-between items-start mb-2">
					<h2 className="text-xl font-semibold">{workout.name}</h2>
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
						{workout.tags && workout.tags.length > 0 && (
							<span className="bg-tertiary-900 text-tertiary-200 px-2 py-1 rounded text-xs">
								{workout.tags[0]}
							</span>
						)}
					</div>
					<span>Duración: {formattedDuration}</span>
				</div>
			</div>
		</div>
	);
}
