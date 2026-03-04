import { useTranslations } from 'next-intl';
import CancelConfirmModal from './CancelConfirmModal';

type WorkoutRestPhaseProps = {
	restTimeRemaining: number;
	restTotal: number;
	nextExerciseName?: string;
	progress: number;
	elapsedTime: number;
	showCancelConfirm: boolean;
	onSkipRest: () => void;
	onCancelRequest: () => void;
	onCancelConfirm: () => void;
	onCancelDismiss: () => void;
	formatTime: (seconds: number) => string;
};

export default function WorkoutRestPhase({
	restTimeRemaining,
	restTotal,
	nextExerciseName,
	progress,
	elapsedTime,
	showCancelConfirm,
	onSkipRest,
	onCancelRequest,
	onCancelConfirm,
	onCancelDismiss,
	formatTime,
}: WorkoutRestPhaseProps) {
	const t = useTranslations('WorkoutRunner');
	const circumference = 2 * Math.PI * 45;
	const dashOffset = circumference * (1 - restTimeRemaining / (restTotal || 60));

	return (
		<div className="max-w-lg mx-auto text-center py-12">
			{/* Progress bar */}
			<div className="w-full bg-background rounded-full h-2 mb-8">
				<div
					className="bg-primary-500 h-2 rounded-full transition-all duration-500"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<p className="text-foreground/50 text-sm mb-2 uppercase tracking-wider">
				{t('resting')}
			</p>

			{/* Circular timer */}
			<div className="relative w-48 h-48 mx-auto mb-8">
				<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
					<circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" className="text-background" />
					<circle
						cx="50" cy="50" r="45"
						fill="none" stroke="currentColor" strokeWidth="4"
						className="text-primary-500"
						strokeDasharray={circumference}
						strokeDashoffset={dashOffset}
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex items-center justify-center">
					<span className="text-5xl font-heading font-bold text-foreground">
						{restTimeRemaining}
					</span>
				</div>
			</div>

			{nextExerciseName && (
				<p className="text-foreground/60 mb-6">
					{t('nextExercise')}: <span className="text-foreground font-medium">{nextExerciseName}</span>
				</p>
			)}

			<div className="flex gap-3 justify-center">
				<button
					onClick={onSkipRest}
					className="bg-surface hover:bg-surface/80 text-foreground px-8 py-3 rounded-xl transition-colors border border-white/10"
				>
					{t('skipRest')}
				</button>
				<button
					onClick={onCancelRequest}
					className="bg-surface hover:bg-red-500/20 text-red-400 px-8 py-3 rounded-xl transition-colors border border-red-500/30"
				>
					{t('cancelWorkout')}
				</button>
			</div>

			<p className="text-foreground/30 text-sm mt-6">{formatTime(elapsedTime)}</p>

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
