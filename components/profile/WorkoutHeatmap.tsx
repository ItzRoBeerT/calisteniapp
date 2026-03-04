'use client';

import { useMemo, useState, useTransition, useCallback } from 'react';
import { useHeatmapData, useActivityByMonth } from './heatmap/use-heatmap-data';
import { useHeatmapInteractions } from './heatmap/use-heatmap-interactions';
import StatsCards from './heatmap/StatsCards';
import HeatmapGrid from './heatmap/HeatmapGrid';
import ActivityTimeline from './heatmap/ActivityTimeline';
import EmptyState from './heatmap/EmptyState';
import { getDayKey } from './heatmap/utils';
import { getCompletionDetailsPaginated, getCompletionDetailsBetween } from '@/actions/workout';
import type { Completion, DayData } from './heatmap/types';

type WorkoutHeatmapProps = {
	summaryDates: { completed_at: string }[];
	initialDetails: Completion[];
	initialHasMore: boolean;
};

export default function WorkoutHeatmap({
	summaryDates,
	initialDetails,
	initialHasMore,
}: WorkoutHeatmapProps) {
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [loadedDetails, setLoadedDetails] = useState<Completion[]>(initialDetails);
	const [hasMore, setHasMore] = useState(initialHasMore);
	// Cursor for sequential pagination: completed_at of the oldest sequentially loaded completion
	const [sequentialCursor, setSequentialCursor] = useState<string | undefined>(
		initialDetails.length > 0 ? initialDetails[initialDetails.length - 1].completed_at : undefined,
	);
	const [isPending, startTransition] = useTransition();

	const { weeks, monthLabels, maxCount, totalCount, currentStreak, longestStreak, activeDays } =
		useHeatmapData(summaryDates, selectedYear);

	const activityByMonth = useActivityByMonth(loadedDetails, selectedYear);

	const loadedDateKeys = useMemo(
		() => new Set(loadedDetails.map((c) => getDayKey(new Date(c.completed_at)))),
		[loadedDetails],
	);

	// Enrich heatmap weeks with loaded completion details (for tooltip)
	const enrichedWeeks = useMemo(() => {
		const detailMap = new Map<string, Completion[]>();
		loadedDetails.forEach((c) => {
			const key = getDayKey(new Date(c.completed_at));
			if (!detailMap.has(key)) detailMap.set(key, []);
			detailMap.get(key)!.push(c);
		});
		return weeks.map((week) =>
			week.map((day) => ({
				...day,
				completions: detailMap.get(day.key) ?? [],
			})),
		);
	}, [weeks, loadedDetails]);

	const mergeDetails = useCallback((incoming: Completion[]) => {
		setLoadedDetails((prev) => {
			const existing = new Set(prev.map((c) => c.completed_at + c.workout_name));
			const fresh = incoming.filter((c) => !existing.has(c.completed_at + c.workout_name));
			return [...prev, ...fresh].sort((a, b) => b.completed_at.localeCompare(a.completed_at));
		});
	}, []);

	const loadMore = useCallback(() => {
		startTransition(async () => {
			const { completions, hasMore: newHasMore } = await getCompletionDetailsPaginated(
				sequentialCursor,
				5,
			);
			mergeDetails(completions);
			setHasMore(newHasMore);
			if (completions.length > 0) {
				setSequentialCursor(completions[completions.length - 1].completed_at);
			}
		});
	}, [sequentialCursor, mergeDetails]);

	const loadDay = useCallback(
		(dateKey: string) => {
			if (loadedDateKeys.has(dateKey)) return;
			const localMidnight = new Date(dateKey + 'T00:00:00');
			const nextMidnight = new Date(localMidnight);
			nextMidnight.setDate(nextMidnight.getDate() + 1);
			startTransition(async () => {
				const completions = await getCompletionDetailsBetween(
					localMidnight.toISOString(),
					nextMidnight.toISOString(),
				);
				mergeDetails(completions);
			});
		},
		[loadedDateKeys, mergeDetails],
	);

	const {
		selectedDay,
		setSelectedDay,
		clearSelectedDay,
		tooltip,
		cellSize,
		containerRef,
		gridRef,
		activityRef,
		handleCellHover,
		handleCellLeave,
	} = useHeatmapInteractions(weeks.length);

	const handleCellClick = useCallback(
		(day: DayData) => {
			const newKey = selectedDay === day.key ? null : day.key;
			setSelectedDay(newKey);
			if (newKey && !loadedDateKeys.has(newKey)) {
				loadDay(newKey);
			}
		},
		[selectedDay, setSelectedDay, loadedDateKeys, loadDay],
	);

	const availableYears = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const years = new Set<number>([currentYear]);
		summaryDates.forEach((c) => {
			years.add(new Date(c.completed_at).getFullYear());
		});
		return Array.from(years).sort((a, b) => b - a);
	}, [summaryDates]);

	if (summaryDates.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="space-y-6">
			<StatsCards
				totalCount={totalCount}
				currentStreak={currentStreak}
				longestStreak={longestStreak}
				activeDays={activeDays}
			/>

			<HeatmapGrid
				weeks={enrichedWeeks}
				monthLabels={monthLabels}
				maxCount={maxCount}
				totalCount={totalCount}
				currentStreak={currentStreak}
				selectedYear={selectedYear}
				selectedDay={selectedDay}
				cellSize={cellSize}
				tooltip={tooltip}
				containerRef={containerRef}
				gridRef={gridRef}
				onCellHover={handleCellHover}
				onCellLeave={handleCellLeave}
				onCellClick={handleCellClick}
				onYearChange={setSelectedYear}
				availableYears={availableYears}
			/>

			{(selectedDay || activityByMonth.length > 0) && (
				<ActivityTimeline
					activityByMonth={activityByMonth}
					selectedDay={selectedDay}
					onClearSelection={clearSelectedDay}
					activityRef={activityRef}
					hasMore={hasMore}
					isPending={isPending}
					onLoadMore={loadMore}
				/>
			)}
		</div>
	);
}
