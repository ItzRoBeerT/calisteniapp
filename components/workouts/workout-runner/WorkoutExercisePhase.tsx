import { useTranslations } from 'next-intl';
import Image from 'next/image';
import DefaultImage from '@/public/images/default_image.webp';
import { WorkoutDetail } from '@/types/Workout';
import CancelConfirmModal from './CancelConfirmModal';

type WorkoutExercisePhaseProps = {
	currentExercise: WorkoutDetail['exercises'][number];
	currentExerciseIndex: number;
	currentSet: number;
	totalExercises: number;
	progress: number;
	elapsedTime: number;
	showCancelConfirm: boolean;
	isInSuperset?: boolean;
	onSetDone: () => void;
	onCancelRequest: () => void;
	onCancelConfirm: () => void;
	onCancelDismiss: () => void;
	formatTime: (seconds: number) => string;
};

export default function WorkoutExercisePhase({
	currentExercise,
	currentExerciseIndex,
	currentSet,
	totalExercises,
	progress,
	elapsedTime,
	showCancelConfirm,
	isInSuperset,
	onSetDone,
	onCancelRequest,
	onCancelConfirm,
	onCancelDismiss,
	formatTime,
}: WorkoutExercisePhaseProps) {
	const t = useTranslations('WorkoutRunner');

	return (
		<div className="max-w-lg mx-auto py-4">
			{/* Progress bar */}
			<div className="w-full bg-background rounded-full h-2 mb-6">
				<div
					className="bg-primary-500 h-2 rounded-full transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className="flex items-center justify-center gap-2 mb-2">
				{isInSuperset && (
					<span className="text-xs font-semibold text-secondary-400 bg-secondary-500/15 border border-secondary-500/30 px-2 py-0.5 rounded-full">
						{t('superset')}
					</span>
				)}
				<p className="text-foreground/40 text-sm text-center">
					{t('exercise')} {currentExerciseIndex + 1} {t('of')} {totalExercises}
				</p>
			</div>

			<div className={`bg-surface rounded-xl p-6 mb-6 ${isInSuperset ? 'border-l-4 border-secondary-500' : ''}`}>
				{currentExercise.image && (
					<div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
						<Image
							src={currentExercise.image || DefaultImage}
							alt={currentExercise.name}
							fill
							className="object-cover"
						/>
					</div>
				)}

				<h2 className="text-2xl font-heading font-bold text-foreground text-center mb-6">
					{currentExercise.name}
				</h2>

				<div className="flex justify-center gap-6 mb-8">
					<div className="text-center">
						<p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t('set')}</p>
						<p className="text-3xl font-heading font-bold text-primary-400">
							{currentSet}<span className="text-foreground/30 text-lg">/{currentExercise.sets}</span>
						</p>
					</div>
					<div className="w-px bg-white/10" />
					{currentExercise.rir != null ? (
						<div className="text-center">
							<p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t('rir')}</p>
							<p className="text-3xl font-heading font-bold text-orange-400">
								{currentExercise.rir === 0
									? <span className="text-lg">{t('rirToFailure')}</span>
									: currentExercise.rir}
							</p>
						</div>
					) : (
						<div className="text-center">
							<p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t('reps')}</p>
							<p className="text-3xl font-heading font-bold text-secondary-400">
								{currentExercise.reps}
							</p>
						</div>
					)}
				</div>

				<button
					onClick={onSetDone}
					className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
				>
					{t('setDone')}
				</button>
			</div>

			<div className="flex items-center justify-between mt-2">
				<button
					onClick={onCancelRequest}
					className="text-red-400 hover:text-red-300 text-sm transition-colors"
				>
					{t('cancelWorkout')}
				</button>
				<p className="text-foreground/30 text-sm">{formatTime(elapsedTime)}</p>
			</div>

			{showCancelConfirm && (
				<CancelConfirmModal
					onConfirm={onCancelConfirm}
					onCancel={onCancelDismiss}
					confirmText={t('cancelConfirm')}
					yesText={t('cancelYes')}
					noText={t('cancelNo')}
				/>
			)}
		</div>
	);
}
