'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from '@/i18n/navigation';
import { WorkoutDetail, ExerciseWorkout } from '@/types/Workout';
import { saveWorkoutCompletion, getUserWorkouts, getFavoriteWorkoutsWithDetails } from '@/actions/workout';

export type Phase = 'select' | 'preview' | 'exercise' | 'rest' | 'complete';

type Step = {
  exerciseIndex: number;
  set: number;
  skipRestAfter: boolean; // true = no rest before next step (superset transition)
};

function computeSteps(exercises: ExerciseWorkout[]): Step[] {
  const steps: Step[] = [];
  let i = 0;

  while (i < exercises.length) {
    const ex = exercises[i];
    const groupId = ex.superset_group;

    if (groupId) {
      // Collect consecutive exercises in the same superset group
      const groupIndices: number[] = [i];
      while (
        i + 1 < exercises.length &&
        exercises[i + 1].superset_group === groupId
      ) {
        i++;
        groupIndices.push(i);
      }

      const maxSets = Math.max(...groupIndices.map(idx => exercises[idx].sets));

      for (let set = 1; set <= maxSets; set++) {
        for (let k = 0; k < groupIndices.length; k++) {
          const exIdx = groupIndices[k];
          if (set <= exercises[exIdx].sets) {
            const isLastInGroup = k === groupIndices.length - 1;
            steps.push({ exerciseIndex: exIdx, set, skipRestAfter: !isLastInGroup });
          }
        }
      }
    } else {
      for (let set = 1; set <= ex.sets; set++) {
        steps.push({ exerciseIndex: i, set, skipRestAfter: false });
      }
    }

    i++;
  }

  return steps;
}

export function useWorkoutRunner(workouts: WorkoutDetail[], initialWorkoutId?: number) {
	const router = useRouter();

	const initialWorkout = initialWorkoutId
		? workouts.find((w) => w.id === initialWorkoutId) || null
		: null;

	const [phase, setPhase] = useState<Phase>(initialWorkout ? 'preview' : 'select');
	const [selectedWorkout, setSelectedWorkout] = useState<WorkoutDetail | null>(initialWorkout);
	const [currentStepIndex, setCurrentStepIndex] = useState(0);
	const [restTimeRemaining, setRestTimeRemaining] = useState(0);
	const [startTime, setStartTime] = useState<Date | null>(null);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [showCancelConfirm, setShowCancelConfirm] = useState(false);
	const [userWorkouts, setUserWorkouts] = useState<WorkoutDetail[]>([]);
	const [likedWorkouts, setLikedWorkouts] = useState<WorkoutDetail[]>([]);
	const [loadingUserData, setLoadingUserData] = useState(false);
	const timerRef = useRef<NodeJS.Timeout | null>(null);
	const completionSavedRef = useRef(false);

	const steps = useMemo(
		() => (selectedWorkout ? computeSteps(selectedWorkout.exercises) : []),
		[selectedWorkout]
	);

	const currentStep = steps[currentStepIndex];
	const currentExerciseIndex = currentStep?.exerciseIndex ?? 0;
	const currentSet = currentStep?.set ?? 1;
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
		setCurrentStepIndex(0);
		setPhase('preview');
	}, []);

	const startWorkout = useCallback(() => {
		setStartTime(new Date());
		setElapsedTime(0);
		setCurrentStepIndex(0);
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
		if (!currentExercise || !currentStep) return;

		const restDuration = currentExercise.rest || 60;
		const isLastStep = currentStepIndex >= steps.length - 1;

		if (isLastStep) {
			setPhase('complete');
		} else if (currentStep.skipRestAfter) {
			// Superset: go directly to next exercise without rest
			setCurrentStepIndex((prev) => prev + 1);
			setPhase('exercise');
		} else {
			setCurrentStepIndex((prev) => prev + 1);
			setRestTimeRemaining(restDuration);
			setPhase('rest');
		}
	}, [currentExercise, currentStep, currentStepIndex, steps.length]);

	const skipRest = useCallback(() => {
		setRestTimeRemaining(0);
		setPhase('exercise');
	}, []);

	const resetToSelection = useCallback(() => {
		completionSavedRef.current = false;
		setPhase('select');
		setSelectedWorkout(null);
		setCurrentStepIndex(0);
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
		if (!steps.length) return 0;
		return (currentStepIndex / steps.length) * 100;
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
	};
}
