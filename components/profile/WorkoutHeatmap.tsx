'use client';

import { useMemo, useState } from 'react';
import { useHeatmapData, useActivityByMonth } from './heatmap/use-heatmap-data';
import { useHeatmapInteractions } from './heatmap/use-heatmap-interactions';
import StatsCards from './heatmap/StatsCards';
import HeatmapGrid from './heatmap/HeatmapGrid';
import ActivityTimeline from './heatmap/ActivityTimeline';
import EmptyState from './heatmap/EmptyState';
import type { Completion } from './heatmap/types';

type WorkoutHeatmapProps = {
	completions: Completion[];
};

export default function WorkoutHeatmap({ completions }: WorkoutHeatmapProps) {
	const [selectedYear, setSelectedYear] = useState<number | null>(null);

	const { weeks, monthLabels, maxCount, totalCount, currentStreak, longestStreak, activeDays } =
		useHeatmapData(completions, selectedYear);

	const activityByMonth = useActivityByMonth(completions, selectedYear);

	const {
		selectedDay,
		clearSelectedDay,
		tooltip,
		cellSize,
		containerRef,
		gridRef,
		activityRef,
		handleCellHover,
		handleCellClick,
		handleCellLeave,
	} = useHeatmapInteractions(weeks.length);

	const availableYears = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const years = new Set<number>([currentYear]);
		completions.forEach((c) => {
			years.add(new Date(c.completed_at).getFullYear());
		});
		return Array.from(years).sort((a, b) => b - a);
	}, [completions]);

	if (completions.length === 0) {
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
				weeks={weeks}
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
				/>
			)}
		</div>
	);
}
