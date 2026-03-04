import { useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import { getDifficultyColor } from '@/utils/difficultyColors';
import WorkoutCard from './WorkoutCard';

type WorkoutSelectPhaseProps = {
	workouts: WorkoutDetail[];
	userWorkouts: WorkoutDetail[];
	likedWorkouts: WorkoutDetail[];
	loadingUserData: boolean;
	onSelect: (workout: WorkoutDetail) => void;
	formatDate: (date?: string) => string;
};

export default function WorkoutSelectPhase({
	workouts,
	userWorkouts,
	likedWorkouts,
	loadingUserData,
	onSelect,
	formatDate,
}: WorkoutSelectPhaseProps) {
	const t = useTranslations('WorkoutRunner');

	const exerciseLabel = (count: number) =>
		`${count} ${t('exercise')}${count !== 1 ? 's' : ''}`;

	return (
		<div className="max-w-6xl mx-auto">
			<h1 className="text-3xl font-heading font-bold text-foreground mb-8">
				{t('selectWorkout')}
			</h1>

			{/* My Workouts Section */}
			{userWorkouts.length > 0 && (
				<div className="mb-12">
					<h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
						<svg className="w-6 h-6 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
							<path d="M13 10V3L4 14h7v7l9-11h-7z" />
						</svg>
						{t('myWorkouts')}
					</h2>
					{loadingUserData ? (
						<p className="text-foreground/50 text-center py-8">{t('loading')}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							{userWorkouts.map((workout) => (
								<WorkoutCard
									key={workout.id}
									workout={workout}
									onSelect={onSelect}
									variant="default"
									dateLabel="Created"
									formattedDate={formatDate(workout.created_at)}
									exerciseLabel={exerciseLabel(workout.exercises.length)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{/* Liked Workouts Section */}
			{likedWorkouts.length > 0 && (
				<div className="mb-12">
					<h2 className="text-2xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
						<svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
							<path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
						</svg>
						{t('likedWorkouts')}
					</h2>
					{loadingUserData ? (
						<p className="text-foreground/50 text-center py-8">{t('loading')}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							{likedWorkouts.map((workout) => (
								<WorkoutCard
									key={workout.id}
									workout={workout}
									onSelect={onSelect}
									variant="liked"
									dateLabel="Liked"
									formattedDate={formatDate(workout.favorited_at)}
									exerciseLabel={exerciseLabel(workout.exercises.length)}
								/>
							))}
						</div>
					)}
				</div>
			)}

			{/* All Workouts Section (when no user workouts or liked workouts) */}
			{userWorkouts.length === 0 && likedWorkouts.length === 0 && (
				<div>
					<h2 className="text-2xl font-heading font-bold text-foreground mb-4">
						{t('allWorkouts')}
					</h2>
					{workouts.length === 0 ? (
						<p className="text-foreground/50 text-center py-12">{t('noWorkouts')}</p>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
							{workouts.map((workout) => (
								<button
									key={workout.id}
									onClick={() => onSelect(workout)}
									className="bg-surface rounded-xl p-5 text-left hover:ring-2 hover:ring-primary-500 transition-all group"
								>
									<h3 className="text-lg font-semibold text-foreground group-hover:text-primary-400 transition-colors mb-2">
										{workout.name}
									</h3>
									{workout.description && (
										<p className="text-foreground/60 text-sm mb-3 line-clamp-2">
											{workout.description}
										</p>
									)}
									<div className="flex flex-wrap gap-2">
										{workout.difficulty && (
											<span className={`px-2 py-1 text-xs rounded-full border ${getDifficultyColor(workout.difficulty)}`}>
												{workout.difficulty}
											</span>
										)}
										{workout.duration && (
											<span className="px-2 py-1 text-xs bg-tertiary-500/20 text-tertiary-400 rounded-full border border-tertiary-500/30">
												{workout.duration} min
											</span>
										)}
										<span className="px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full border border-primary-500/30">
											{exerciseLabel(workout.exercises.length)}
										</span>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
