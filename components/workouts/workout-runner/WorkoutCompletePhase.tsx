import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type WorkoutCompletePhaseProps = {
	workoutName?: string;
	elapsedTime: number;
	totalExercises: number;
	onStartAnother: () => void;
	formatTime: (seconds: number) => string;
};

export default function WorkoutCompletePhase({
	workoutName,
	elapsedTime,
	totalExercises,
	onStartAnother,
	formatTime,
}: WorkoutCompletePhaseProps) {
	const t = useTranslations('WorkoutRunner');

	return (
		<div className="max-w-lg mx-auto text-center py-12">
			<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
				<svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
				</svg>
			</div>

			<h1 className="text-4xl font-heading font-bold text-foreground mb-4">
				{t('workoutComplete')}
			</h1>
			<p className="text-foreground/60 text-lg mb-2">{workoutName}</p>

			<div className="bg-surface rounded-xl p-6 my-8 space-y-4">
				<div className="flex justify-between">
					<span className="text-foreground/60">{t('totalTime')}</span>
					<span className="text-foreground font-semibold font-heading">{formatTime(elapsedTime)}</span>
				</div>
				<div className="flex justify-between">
					<span className="text-foreground/60">{t('exercisesCompleted')}</span>
					<span className="text-foreground font-semibold">{totalExercises}</span>
				</div>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				<button
					onClick={onStartAnother}
					className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
				>
					{t('startAnother')}
				</button>
				<Link
					href="/workouts"
					className="bg-surface hover:bg-surface/80 text-foreground px-6 py-3 rounded-xl transition-colors border border-white/10"
				>
					{t('backToWorkouts')}
				</Link>
			</div>
		</div>
	);
}
