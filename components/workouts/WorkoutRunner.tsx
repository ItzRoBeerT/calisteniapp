'use client';

import { WorkoutDetail } from '@/types/Workout';
import { useWorkoutRunner } from './use-workout-runner';
import WorkoutSelectPhase from './workout-runner/WorkoutSelectPhase';
import WorkoutPreviewPhase from './workout-runner/WorkoutPreviewPhase';
import WorkoutRestPhase from './workout-runner/WorkoutRestPhase';
import WorkoutExercisePhase from './workout-runner/WorkoutExercisePhase';
import WorkoutCompletePhase from './workout-runner/WorkoutCompletePhase';

type WorkoutRunnerProps = {
	workouts: WorkoutDetail[];
	initialWorkoutId?: number;
};

export default function WorkoutRunner({ workouts, initialWorkoutId }: WorkoutRunnerProps) {
	const {
		phase,
		selectedWorkout,
		currentExercise,
		currentExerciseIndex,
		currentSet,
		currentStep,
		restTimeRemaining,
		elapsedTime,
		showCancelConfirm,
		setShowCancelConfirm,
		userWorkouts,
		likedWorkouts,
		loadingUserData,
		totalExercises,
		selectWorkout,
		startWorkout,
		handleMarkAsDone,
		handlePreviewBack,
		handleSetDone,
		skipRest,
		resetToSelection,
		formatTime,
		calculateProgress,
		formatDate,
	} = useWorkoutRunner(workouts, initialWorkoutId);

	if (phase === 'select') {
		return (
			<WorkoutSelectPhase
				workouts={workouts}
				userWorkouts={userWorkouts}
				likedWorkouts={likedWorkouts}
				loadingUserData={loadingUserData}
				onSelect={selectWorkout}
				formatDate={formatDate}
			/>
		);
	}

	if (phase === 'preview' && selectedWorkout) {
		return (
			<WorkoutPreviewPhase
				workout={selectedWorkout}
				onBack={handlePreviewBack}
				onMarkAsDone={handleMarkAsDone}
				onStart={startWorkout}
			/>
		);
	}

	if (phase === 'rest') {
		const nextExerciseName = currentSet <= (currentExercise?.sets || 0)
			? currentExercise?.name
			: selectedWorkout?.exercises[currentExerciseIndex + 1]?.name;

		return (
			<WorkoutRestPhase
				restTimeRemaining={restTimeRemaining}
				restTotal={currentExercise?.rest || 60}
				nextExerciseName={nextExerciseName}
				progress={calculateProgress()}
				elapsedTime={elapsedTime}
				showCancelConfirm={showCancelConfirm}
				onSkipRest={skipRest}
				onCancelRequest={() => setShowCancelConfirm(true)}
				onCancelConfirm={() => { setShowCancelConfirm(false); resetToSelection(); }}
				onCancelDismiss={() => setShowCancelConfirm(false)}
				formatTime={formatTime}
			/>
		);
	}

	if (phase === 'complete') {
		return (
			<WorkoutCompletePhase
				workoutName={selectedWorkout?.name}
				elapsedTime={elapsedTime}
				totalExercises={totalExercises}
				onStartAnother={resetToSelection}
				formatTime={formatTime}
			/>
		);
	}

	// Phase: exercise (default)
	if (!currentExercise) return null;

	return (
		<WorkoutExercisePhase
			currentExercise={currentExercise}
			currentExerciseIndex={currentExerciseIndex}
			currentSet={currentSet}
			totalExercises={totalExercises}
			progress={calculateProgress()}
			elapsedTime={elapsedTime}
			showCancelConfirm={showCancelConfirm}
			isInSuperset={!!currentExercise.superset_group}
			onSetDone={handleSetDone}
			onCancelRequest={() => setShowCancelConfirm(true)}
			onCancelConfirm={() => { setShowCancelConfirm(false); resetToSelection(); }}
			onCancelDismiss={() => setShowCancelConfirm(false)}
			formatTime={formatTime}
		/>
	);
}
