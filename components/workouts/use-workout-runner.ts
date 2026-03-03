'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from '@/i18n/navigation';
import { WorkoutDetail } from '@/types/Workout';
import { saveWorkoutCompletion, getUserWorkouts, getFavoriteWorkoutsWithDetails } from '@/actions/workout';

export type Phase = 'select' | 'preview' | 'exercise' | 'rest' | 'complete';

export function useWorkoutRunner(workouts: WorkoutDetail[], initialWorkoutId?: number) {
	const router = useRouter();

	const initialWorkout = initialWorkoutId
		? workouts.find((w) => w.id === initialWorkoutId) || null
		: null;

	const [phase, setPhase] = useState<Phase>(initialWorkout ? 'preview' : 'select');
	const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(initialWorkout);
	const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
	const [currentSet, setCurrentSet] = useState(1);
	const [restTimeRemaining, setRestTimeRemaining] = useState(0);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [userWorkouts, setUserWorkouts] = useState<WorkoutDetail[]>([]);
	const [likedWorkouts, setLikedWorkouts] = useState<WorkoutDetail[]>([]);
	const [loadingUserData, setLoadingUserData] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const completionSavedRef = useRef(false);

	const currentExercise = selectedWorkout?.exercises[currentExerciseIndex];
	const totalExercises = selectedWorkout?.exercises.length || 0;

	// Load user workouts and liked workouts
	useEffect(() => {
		const loadUserData = async () => {
			setLoadingUserData(true);
			try {
				const [userWkts, likedWkts] = await Promise.all([
					getUserWorkouts(),
					getFavoriteWorkoutsWithDetails(),
				]);
				setUserWorkouts(userWkts);
				setLikedWorkouts(likedWkts);
			} catch (error) {
				console.error('Error loading user data:', error);
			} finally {
				setLoadingUserData(false);
			}
		};

		if (phase === 'select') {
			loadUserData();
		}
	}, [phase]);

	// Elapsed time counter
	useEffect(() => {
		if (startTime && phase !== 'complete' && phase !== 'select' && phase !== 'preview') {
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
		if (phase === 'complete' && selectedWorkout && !completionSavedRef.current) {
			completionSavedRef.current = true;
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
		setPhase('preview');
	}, []);

	const startWorkout = useCallback(() => {
		setStartTime(new Date());
		setElapsedTime(0);
		setCurrentExerciseIndex(0);
		setCurrentSet(1);
		setPhase('exercise');
	}, []);

	const handleMarkAsDone = useCallback(async () => {
		if (!selectedWorkout) return;
		completionSavedRef.current = true;
		await saveWorkoutCompletion({
			workoutId: selectedWorkout.id,
			workoutName: selectedWorkout.name,
			durationSeconds: 0,
			exercisesCount: selectedWorkout.exercises.length,
		});
		setPhase('complete');
	}, [selectedWorkout]);

	const handlePreviewBack = useCallback(() => {
		if (initialWorkoutId) {
			router.back();
		} else {
			setPhase('select');
			setSelectedWorkout(null);
		}
	}, [initialWorkoutId, router]);

	const handleSetDone = useCallback(() => {
		if (!currentExercise) return;

		if (currentSet < currentExercise.sets) {
			setCurrentSet((prev) => prev + 1);
			setRestTimeRemaining(currentExercise.rest || 60);
			setPhase('rest');
		} else if (currentExerciseIndex < totalExercises - 1) {
			setCurrentExerciseIndex((prev) => prev + 1);
			setCurrentSet(1);
			setRestTimeRemaining(currentExercise.rest || 60);
			setPhase('rest');
		} else {
			setPhase('complete');
		}
	}, [currentExercise, currentSet, currentExerciseIndex, totalExercises]);

	const skipRest = useCallback(() => {
		setRestTimeRemaining(0);
		setPhase('exercise');
	}, []);

	const resetToSelection = useCallback(() => {
		completionSavedRef.current = false;
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

	const formatDate = (dateString?: string) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
	};

	return {
		phase,
		selectedWorkout,
		currentExercise,
		currentExerciseIndex,
		currentSet,
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
	};
}
