import { useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import { getDifficultyColor } from '@/utils/difficultyColors';
import ExerciseList from '@/components/workouts/ExerciseList';

type WorkoutPreviewPhaseProps = {
	workout: WorkoutDetail;
	onBack: () => void;
	onMarkAsDone: () => void;
	onStart: () => void;
};

export default function WorkoutPreviewPhase({
	workout,
	onBack,
	onMarkAsDone,
	onStart,
}: WorkoutPreviewPhaseProps) {
	const t = useTranslations('WorkoutRunner');
	const difficultyClass = getDifficultyColor(workout.difficulty);

	return (
		<div className="max-w-4xl mx-auto">
			<div className="bg-surface rounded-xl p-6 mt-4">
				<div className="mb-6">
					<h1 className="text-3xl font-bold text-foreground">{workout.name}</h1>
				</div>

				{workout.description && (
					<div className="mb-6">
						<p className="text-foreground/70">{workout.description}</p>
					</div>
				)}

				<div className="mb-6 flex justify-between items-start gap-6">
					<div className="flex gap-4">
						{workout.difficulty && (
							<span className={`px-3 py-1 rounded-full border ${difficultyClass}`}>
								{workout.difficulty}
							</span>
						)}
						{workout.duration && (
							<span className="px-3 py-1 bg-tertiary-500/20 text-tertiary-400 rounded-full border border-tertiary-500/30">
								{workout.duration} min
							</span>
						)}
					</div>

					{workout.tags && workout.tags.length > 0 && (
						<div className="flex flex-wrap gap-2 justify-end">
							{workout.tags.map((tag) => (
								<span
									key={tag}
									className="px-2 py-1 bg-primary-500/10 text-primary-400 text-xs rounded-full border border-primary-500/20"
								>
									#{tag}
								</span>
							))}
						</div>
					)}
				</div>

				{workout.exercises && workout.exercises.length > 0 && (
					<div className="mb-6">
						<ExerciseList exercises={workout.exercises.map((ex) => ({
							id: String(ex.id),
							name: ex.name,
							sets: ex.sets,
							reps: ex.reps,
							rest: ex.rest,
							image: ex.image,
						}))} />
					</div>
				)}

				<div className="flex items-center justify-between gap-3 flex-wrap">
					<button
						onClick={onBack}
						className="flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
						</svg>
						{t('goBack')}
					</button>

					<div className="flex items-center gap-3">
						<button
							onClick={onMarkAsDone}
							className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 px-4 py-2 rounded-lg transition-colors border border-green-500/30 font-medium"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
							</svg>
							{t('markAsDone')}
						</button>
						<button
							onClick={onStart}
							className="flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors font-medium"
						>
							<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
								<path d="M8 5v14l11-7z" />
							</svg>
							{t('startWorkout')}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
