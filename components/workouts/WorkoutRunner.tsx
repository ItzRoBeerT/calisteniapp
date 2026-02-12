'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { WorkoutDetail } from '@/types/Workout';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import DefaultImage from '@/public/images/default_image.webp';
import { getDifficultyColor } from '@/utils/difficultyColors';
import { saveWorkoutCompletion } from '@/actions/workout';

type Phase = 'select' | 'exercise' | 'rest' | 'complete';

type WorkoutRunnerProps = {
	workouts: WorkoutDetail[];
	initialWorkoutId?: number;
};

export default function WorkoutRunner({ workouts, initialWorkoutId }: WorkoutRunnerProps) {
	const t = useTranslations('WorkoutRunner');

	const initialWorkout = initialWorkoutId
		? workouts.find((w) => w.id === initialWorkoutId) || null
		: null;

	const [phase, setPhase] = useState<Phase>(initialWorkout ? 'exercise' : 'select');
	const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(initialWorkout);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [currentSet, setCurrentSet] = useState(1);
	const [restTimeRemaining, setRestTimeRemaining] = useState(0);
	const [startTime, setStartTime] = useState<Date | null>(initialWorkout ? new Date() : null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);

	const currentExercise = selectedWorkout?.exercises[currentExerciseIndex];
	const totalExercises = selectedWorkout?.exercises.length || 0;

	// Elapsed time counter
	useEffect(() => {
		if (startTime && phase !== 'complete' && phase !== 'select') {
			const interval = setInterval(() => {
				setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [startTime, phase]);

	// Rest countdown timer
	useEffect(() => {
		if (phase === 'rest' && restTimeRemaining > 0) {
			timerRef.current = setTimeout(() => {
				setRestTimeRemaining((prev) => prev - 1);
			}, 1000);
			return () => {
				if (timerRef.current) clearTimeout(timerRef.current);
			};
		} else if (phase === 'rest' && restTimeRemaining === 0) {
			setPhase('exercise');
		}
	}, [phase, restTimeRemaining]);

	// Save workout completion to Supabase when workout finishes
	useEffect(() => {
		if (phase === 'complete' && selectedWorkout) {
			saveWorkoutCompletion({
				workoutId: selectedWorkout.id,
				workoutName: selectedWorkout.name,
				durationSeconds: elapsedTime,
				exercisesCount: totalExercises,
			});
		}
	}, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

	const selectWorkout = useCallback((workout: WorkoutDetail) => {
		setSelectedWorkout(workout);
		setCurrentExerciseIndex(0);
		setCurrentSet(1);
		setStartTime(new Date());
		setElapsedTime(0);
		setPhase('exercise');
	}, []);

	const handleSetDone = useCallback(() => {
		if (!currentExercise) return;

		if (currentSet < currentExercise.sets) {
			// More sets remaining - go to rest
			setCurrentSet((prev) => prev + 1);
			setRestTimeRemaining(currentExercise.rest || 60);
			setPhase('rest');
		} else if (currentExerciseIndex < totalExercises - 1) {
			// More exercises remaining - go to rest then next exercise
			setCurrentExerciseIndex((prev) => prev + 1);
			setCurrentSet(1);
			setRestTimeRemaining(currentExercise.rest || 60);
			setPhase('rest');
		} else {
			// Workout complete
			setPhase('complete');
		}
	}, [currentExercise, currentSet, currentExerciseIndex, totalExercises]);

	const skipRest = useCallback(() => {
		setRestTimeRemaining(0);
		setPhase('exercise');
	}, []);

	const resetToSelection = useCallback(() => {
		setPhase('select');
		setSelectedWorkout(null);
		setCurrentExerciseIndex(0);
		setCurrentSet(1);
		setRestTimeRemaining(0);
		setStartTime(null);
		setElapsedTime(0);
	}, []);

	const formatTime = (seconds: number) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
	};

	// Calculate overall progress
	const calculateProgress = () => {
		if (!selectedWorkout) return 0;
		let totalSets = 0;
		let completedSets = 0;

		selectedWorkout.exercises.forEach((ex, i) => {
			totalSets += ex.sets;
			if (i < currentExerciseIndex) {
				completedSets += ex.sets;
			} else if (i === currentExerciseIndex) {
				completedSets += currentSet - 1;
			}
		});

		return totalSets > 0 ? (completedSets / totalSets) * 100 : 0;
	};

	// Phase: Select workout
	if (phase === 'select') {
		return (
			<div className="max-w-4xl mx-auto">
				<h1 className="text-3xl font-heading font-bold text-foreground mb-8">
					{t('selectWorkout')}
				</h1>
				{workouts.length === 0 ? (
					<p className="text-foreground/50 text-center py-12">{t('noWorkouts')}</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
						{workouts.map((workout) => (
							<button
								key={workout.id}
								onClick={() => selectWorkout(workout)}
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
										{workout.exercises.length} {t('exercise')}{workout.exercises.length !== 1 ? 's' : ''}
									</span>
								</div>
							</button>
						))}
					</div>
				)}
			</div>
		);
	}

	// Cancel confirmation modal
	const cancelConfirmModal = showCancelConfirm && (
		<div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
			<div className="bg-surface rounded-xl p-6 max-w-sm w-full text-center">
				<p className="text-foreground text-lg font-medium mb-6">
					{t('cancelConfirm')}
				</p>
				<div className="flex gap-3 justify-center">
					<button
						onClick={() => {
							setShowCancelConfirm(false);
							resetToSelection();
						}}
						className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl transition-colors font-medium"
					>
						{t('cancelYes')}
					</button>
					<button
						onClick={() => setShowCancelConfirm(false)}
						className="bg-surface hover:bg-surface/80 text-foreground px-6 py-3 rounded-xl transition-colors border border-white/10"
					>
						{t('cancelNo')}
					</button>
				</div>
			</div>
		</div>
	);

	// Phase: Rest
	if (phase === 'rest') {
		const nextExerciseName = currentSet <= (currentExercise?.sets || 0)
			? currentExercise?.name
			: selectedWorkout?.exercises[currentExerciseIndex + 1]?.name;

		return (
			<div className="max-w-lg mx-auto text-center py-12">
				{/* Progress bar */}
				<div className="w-full bg-background rounded-full h-2 mb-8">
					<div
						className="bg-primary-500 h-2 rounded-full transition-all duration-500"
						style={{ width: `${calculateProgress()}%` }}
					/>
				</div>

				<p className="text-foreground/50 text-sm mb-2 uppercase tracking-wider">
					{t('resting')}
				</p>

				{/* Circular timer */}
				<div className="relative w-48 h-48 mx-auto mb-8">
					<svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
						<circle
							cx="50" cy="50" r="45"
							fill="none"
							stroke="currentColor"
							strokeWidth="4"
							className="text-background"
						/>
						<circle
							cx="50" cy="50" r="45"
							fill="none"
							stroke="currentColor"
							strokeWidth="4"
							className="text-primary-500"
							strokeDasharray={`${2 * Math.PI * 45}`}
							strokeDashoffset={`${2 * Math.PI * 45 * (1 - restTimeRemaining / (currentExercise?.rest || 60))}`}
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
						onClick={skipRest}
						className="bg-surface hover:bg-surface/80 text-foreground px-8 py-3 rounded-xl transition-colors border border-white/10"
					>
						{t('skipRest')}
					</button>
					<button
						onClick={() => setShowCancelConfirm(true)}
						className="bg-surface hover:bg-red-500/20 text-red-400 px-8 py-3 rounded-xl transition-colors border border-red-500/30"
					>
						{t('cancelWorkout')}
					</button>
				</div>

				{/* Elapsed time */}
				<p className="text-foreground/30 text-sm mt-6">{formatTime(elapsedTime)}</p>
				{cancelConfirmModal}
			</div>
		);
	}

	// Phase: Complete
	if (phase === 'complete') {
		return (
			<div className="max-w-lg mx-auto text-center py-12">
				{/* Checkmark */}
				<div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary-500/20 flex items-center justify-center">
					<svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				</div>

				<h1 className="text-4xl font-heading font-bold text-foreground mb-4">
					{t('workoutComplete')}
				</h1>
				<p className="text-foreground/60 text-lg mb-2">
					{selectedWorkout?.name}
				</p>

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
						onClick={resetToSelection}
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

	// Phase: Exercise
	return (
		<div className="max-w-lg mx-auto py-4">
			{/* Progress bar */}
			<div className="w-full bg-background rounded-full h-2 mb-6">
				<div
					className="bg-primary-500 h-2 rounded-full transition-all duration-500"
					style={{ width: `${calculateProgress()}%` }}
				/>
			</div>

			{/* Exercise counter */}
			<p className="text-foreground/40 text-sm text-center mb-2">
				{t('exercise')} {currentExerciseIndex + 1} {t('of')} {totalExercises}
			</p>

			{/* Exercise card */}
			<div className="bg-surface rounded-xl p-6 mb-6">
				{currentExercise?.image && (
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
					{currentExercise?.name}
				</h2>

				{/* Set and rep info */}
				<div className="flex justify-center gap-6 mb-8">
					<div className="text-center">
						<p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t('set')}</p>
						<p className="text-3xl font-heading font-bold text-primary-400">
							{currentSet}<span className="text-foreground/30 text-lg">/{currentExercise?.sets}</span>
						</p>
					</div>
					<div className="w-px bg-white/10" />
					<div className="text-center">
						<p className="text-foreground/40 text-xs uppercase tracking-wider mb-1">{t('reps')}</p>
						<p className="text-3xl font-heading font-bold text-secondary-400">
							{currentExercise?.reps}
						</p>
					</div>
				</div>

				{/* Set Done button */}
				<button
					onClick={handleSetDone}
					className="w-full bg-primary-500 hover:bg-primary-600 text-white py-4 rounded-xl text-lg font-semibold transition-colors"
				>
					{t('setDone')}
				</button>
			</div>

			{/* Cancel and elapsed time */}
			<div className="flex items-center justify-between mt-2">
				<button
					onClick={() => setShowCancelConfirm(true)}
					className="text-red-400 hover:text-red-300 text-sm transition-colors"
				>
					{t('cancelWorkout')}
				</button>
				<p className="text-foreground/30 text-sm">{formatTime(elapsedTime)}</p>
			</div>
			{cancelConfirmModal}
		</div>
	);
}
