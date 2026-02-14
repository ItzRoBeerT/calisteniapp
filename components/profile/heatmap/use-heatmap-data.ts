import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { getDayKey } from './utils';
import type { Completion, DayData, MonthLabel, MonthActivity } from './types';

type HeatmapData = {
	weeks: DayData[][];
	monthLabels: MonthLabel[];
	maxCount: number;
	totalCount: number;
	currentStreak: number;
	longestStreak: number;
	activeDays: number;
};

export function useHeatmapData(
	completions: Completion[],
	selectedYear: number | null,
): HeatmapData {
	const t = useTranslations('Profile');
	const isRolling = selectedYear === null;

	return useMemo(() => {
		const now = new Date();

		let startDate: Date;
		let endDate: Date;

		if (isRolling) {
			endDate = now;
			startDate = new Date(now);
			startDate.setDate(startDate.getDate() - 360);
		} else {
			const isCurrentYear = selectedYear === now.getFullYear();
			endDate = isCurrentYear ? now : new Date(selectedYear, 11, 31);
			startDate = new Date(selectedYear, 0, 1);
		}

		const startDay = startDate.getDay();
		if (startDay !== 0) {
			startDate.setDate(startDate.getDate() - startDay);
		}

		const completionMap = new Map<string, Completion[]>();
		completions.forEach((c) => {
			const key = getDayKey(new Date(c.completed_at));
			if (!completionMap.has(key)) completionMap.set(key, []);
			completionMap.get(key)!.push(c);
		});

		const weeks: DayData[][] = [];
		let currentWeek: DayData[] = [];
		const current = new Date(startDate);
		let maxCount = 0;
		let totalCount = 0;
		let activeDays = 0;

		const rangeStart = isRolling
			? new Date(new Date().getTime() - 360 * 24 * 60 * 60 * 1000)
			: new Date(selectedYear!, 0, 1);

		while (current <= endDate) {
			const key = getDayKey(current);
			const dayCompletions = completionMap.get(key) || [];
			const count = dayCompletions.length;

			if (current >= rangeStart) {
				totalCount += count;
				if (count > 0) activeDays++;
			}
			if (count > maxCount) maxCount = count;

			currentWeek.push({
				date: new Date(current),
				key,
				count,
				completions: dayCompletions,
				row: current.getDay(),
			});

			if (current.getDay() === 6) {
				weeks.push(currentWeek);
				currentWeek = [];
			}

			current.setDate(current.getDate() + 1);
		}

		if (currentWeek.length > 0) {
			weeks.push(currentWeek);
		}

		const monthKeys = [
			'monthJan', 'monthFeb', 'monthMar', 'monthApr', 'monthMay', 'monthJun',
			'monthJul', 'monthAug', 'monthSep', 'monthOct', 'monthNov', 'monthDec',
		] as const;
		const allMonthLabels: MonthLabel[] = [];
		let lastMonth = -1;
		weeks.forEach((week, weekIdx) => {
			const firstDayOfWeek = week[0];
			if (firstDayOfWeek) {
				const month = firstDayOfWeek.date.getMonth();
				if (month !== lastMonth) {
					allMonthLabels.push({ label: t(monthKeys[month]), col: weekIdx });
					lastMonth = month;
				}
			}
		});
		const MIN_COL_GAP = 4;
		const monthLabels = allMonthLabels.filter((label, i) => {
			const next = allMonthLabels[i + 1];
			if (next && next.col - label.col < MIN_COL_GAP) {
				return false;
			}
			return true;
		});

		// Current streak
		let currentStreak = 0;
		const streakDate = new Date(now);
		if (!completionMap.has(getDayKey(streakDate))) {
			streakDate.setDate(streakDate.getDate() - 1);
		}
		while (completionMap.has(getDayKey(streakDate))) {
			currentStreak++;
			streakDate.setDate(streakDate.getDate() - 1);
		}

		// Longest streak
		let longestStreak = 0;
		let tempStreak = 0;
		const sortedDays = Array.from(completionMap.keys()).sort();
		for (let i = 0; i < sortedDays.length; i++) {
			if (i === 0) {
				tempStreak = 1;
			} else {
				const prev = new Date(sortedDays[i - 1]);
				const curr = new Date(sortedDays[i]);
				const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
				tempStreak = diff === 1 ? tempStreak + 1 : 1;
			}
			if (tempStreak > longestStreak) longestStreak = tempStreak;
		}

		return { weeks, monthLabels, maxCount, totalCount, currentStreak, longestStreak, activeDays };
	}, [completions, selectedYear, isRolling, t]);
}

export function useActivityByMonth(
	completions: Completion[],
	selectedYear: number | null,
): MonthActivity[] {
	const t = useTranslations('Profile');
	const isRolling = selectedYear === null;

	return useMemo(() => {
		const cutoff = isRolling
			? new Date(new Date().getTime() - 360 * 24 * 60 * 60 * 1000)
			: null;
		const filtered = completions.filter((c) => {
			const d = new Date(c.completed_at);
			return isRolling ? d >= cutoff! : d.getFullYear() === selectedYear;
		});

		const monthFullKeys = [
			'monthFullJan', 'monthFullFeb', 'monthFullMar', 'monthFullApr', 'monthFullMay', 'monthFullJun',
			'monthFullJul', 'monthFullAug', 'monthFullSep', 'monthFullOct', 'monthFullNov', 'monthFullDec',
		] as const;

		const grouped = new Map<string, { monthLabel: string; year: number; days: Map<string, Completion[]> }>();
		filtered.forEach((c) => {
			const d = new Date(c.completed_at);
			const monthKey = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
			const dayKey = getDayKey(d);
			if (!grouped.has(monthKey)) {
				grouped.set(monthKey, {
					monthLabel: t(monthFullKeys[d.getMonth()]),
					year: d.getFullYear(),
					days: new Map(),
				});
			}
			const month = grouped.get(monthKey)!;
			if (!month.days.has(dayKey)) month.days.set(dayKey, []);
			month.days.get(dayKey)!.push(c);
		});

		return Array.from(grouped.entries())
			.sort(([a], [b]) => b.localeCompare(a))
			.map(([, data]) => ({
				...data,
				sortedDays: Array.from(data.days.entries()).sort(([a], [b]) => b.localeCompare(a)),
			}));
	}, [completions, selectedYear, isRolling, t]);
}
