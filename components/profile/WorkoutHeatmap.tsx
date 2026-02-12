'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';

type Completion = {
	completed_at: string;
	workout_name: string;
	workout_id: number | null;
	duration_seconds: number | null;
	exercises_count: number | null;
};

type WorkoutHeatmapProps = {
	completions: Completion[];
};

type DayData = {
	date: Date;
	key: string;
	count: number;
	completions: Completion[];
};

function getDayKey(date: Date): string {
	return date.toISOString().split('T')[0];
}

function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(date: Date, locale: string): string {
	const dd = String(date.getDate()).padStart(2, '0');
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const yyyy = date.getFullYear();
	return locale === 'es' ? `${dd}/${mm}/${yyyy}` : `${mm}/${dd}/${yyyy}`;
}

function getIntensityLevel(count: number, max: number): number {
	if (count === 0) return 0;
	if (max <= 1) return 1;
	const ratio = count / max;
	if (ratio <= 0.25) return 1;
	if (ratio <= 0.5) return 2;
	if (ratio <= 0.75) return 3;
	return 4;
}

const CELL_SIZE = 13;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;

const INTENSITY_COLORS = [
	'bg-[#161b22]',
	'bg-[#0e4429]',
	'bg-[#006d32]',
	'bg-[#26a641]',
	'bg-[#39d353]',
];

export default function WorkoutHeatmap({ completions }: WorkoutHeatmapProps) {
	const t = useTranslations('Profile');
	const locale = useLocale();
	const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
	const [tooltip, setTooltip] = useState<{ x: number; y: number; day: DayData } | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);

	const availableYears = useMemo(() => {
		const currentYear = new Date().getFullYear();
		const years = new Set<number>([currentYear]);
		completions.forEach((c) => {
			years.add(new Date(c.completed_at).getFullYear());
		});
		return Array.from(years).sort((a, b) => b - a);
	}, [completions]);

	const { weeks, monthLabels, maxCount, totalCount, currentStreak } = useMemo(() => {
		const now = new Date();
		const isCurrentYear = selectedYear === now.getFullYear();

		const endDate = isCurrentYear ? now : new Date(selectedYear, 11, 31);
		const startDate = new Date(selectedYear, 0, 1);

		// Adjust start to previous Sunday
		const startDay = startDate.getDay();
		if (startDay !== 0) {
			startDate.setDate(startDate.getDate() - startDay);
		}

		// Build completion map
		const completionMap = new Map<string, Completion[]>();
		completions.forEach((c) => {
			const key = getDayKey(new Date(c.completed_at));
			if (!completionMap.has(key)) completionMap.set(key, []);
			completionMap.get(key)!.push(c);
		});

		// Build weeks grid
		const weeks: DayData[][] = [];
		let currentWeek: DayData[] = [];
		const current = new Date(startDate);
		let maxCount = 0;
		let totalCount = 0;

		while (current <= endDate) {
			const key = getDayKey(current);
			const dayCompletions = completionMap.get(key) || [];
			const count = dayCompletions.length;

			if (current.getFullYear() === selectedYear) {
				totalCount += count;
			}
			if (count > maxCount) maxCount = count;

			currentWeek.push({
				date: new Date(current),
				key,
				count,
				completions: dayCompletions,
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

		// Month labels
		const monthKeys = [
			'monthJan', 'monthFeb', 'monthMar', 'monthApr', 'monthMay', 'monthJun',
			'monthJul', 'monthAug', 'monthSep', 'monthOct', 'monthNov', 'monthDec',
		] as const;
		const monthLabels: { label: string; col: number }[] = [];
		let lastMonth = -1;
		weeks.forEach((week, weekIdx) => {
			const firstDayOfWeek = week[0];
			if (firstDayOfWeek && firstDayOfWeek.date.getFullYear() === selectedYear) {
				const month = firstDayOfWeek.date.getMonth();
				if (month !== lastMonth) {
					monthLabels.push({ label: t(monthKeys[month]), col: weekIdx });
					lastMonth = month;
				}
			}
		});

		// Current streak
		let currentStreak = 0;
		if (isCurrentYear) {
			const streakDate = new Date(now);
			// If no workout today, start from yesterday
			if (!completionMap.has(getDayKey(streakDate))) {
				streakDate.setDate(streakDate.getDate() - 1);
			}
			while (completionMap.has(getDayKey(streakDate))) {
				currentStreak++;
				streakDate.setDate(streakDate.getDate() - 1);
			}
		}

		return { weeks, monthLabels, maxCount, totalCount, currentStreak };
	}, [completions, selectedYear, t]);

	const handleCellHover = useCallback(
		(e: React.MouseEvent, day: DayData) => {
			if (!containerRef.current) return;
			const rect = containerRef.current.getBoundingClientRect();
			const cellRect = (e.target as HTMLElement).getBoundingClientRect();
			setTooltip({
				x: cellRect.left - rect.left + cellRect.width / 2,
				y: cellRect.top - rect.top - 8,
				day,
			});
		},
		[]
	);

	const handleCellLeave = useCallback(() => {
		setTooltip(null);
	}, []);

	useEffect(() => {
		const handleScroll = () => setTooltip(null);
		window.addEventListener('scroll', handleScroll, true);
		return () => window.removeEventListener('scroll', handleScroll, true);
	}, []);

	const dayLabels = [t('dayMon'), t('dayWed'), t('dayFri')];

	return (
		<div className="space-y-3">
			{/* Year selector */}
			{availableYears.length > 1 && (
				<div className="flex gap-2 justify-end">
					{availableYears.map((year) => (
						<button
							key={year}
							onClick={() => setSelectedYear(year)}
							className={`px-3 py-1 text-sm rounded-md transition-colors ${
								selectedYear === year
									? 'bg-primary-500 text-white'
									: 'bg-surface text-foreground/60 hover:text-foreground'
							}`}
						>
							{year}
						</button>
					))}
				</div>
			)}

			{/* Stats */}
			<div className="flex gap-4 text-sm text-foreground/70">
				<span>
					<strong className="text-foreground">{totalCount}</strong>{' '}
					{selectedYear === new Date().getFullYear()
						? t('completionsLastYear')
						: t('completionsInYear', { year: selectedYear })}
				</span>
				{currentStreak > 0 && selectedYear === new Date().getFullYear() && (
					<span>
						<strong className="text-foreground">{currentStreak}</strong> {t('dayStreak')}
					</span>
				)}
			</div>

			{/* Heatmap grid */}
			<div className="relative overflow-x-auto" ref={containerRef}>
				<div className="inline-block min-w-fit">
					{/* Month labels */}
					<div className="flex text-xs text-foreground/50 mb-1" style={{ paddingLeft: 32 }}>
						{monthLabels.map((m, i) => {
							const nextCol = monthLabels[i + 1]?.col ?? weeks.length;
							const span = nextCol - m.col;
							return (
								<span
									key={`${m.label}-${m.col}`}
									style={{ width: span * CELL_STEP }}
								>
									{m.label}
								</span>
							);
						})}
					</div>

					{/* Grid with day labels */}
					<div className="flex">
						{/* Day labels */}
						<div
							className="flex flex-col text-xs text-foreground/50 mr-1"
							style={{ width: 28 }}
						>
							{[0, 1, 2, 3, 4, 5, 6].map((row) => (
								<div
									key={row}
									style={{ height: CELL_STEP }}
									className="flex items-center justify-end pr-1"
								>
									{row === 1 ? dayLabels[0] : row === 3 ? dayLabels[1] : row === 5 ? dayLabels[2] : ''}
								</div>
							))}
						</div>

						{/* Cells */}
						<div className="flex gap-[3px]">
							{weeks.map((week, weekIdx) => (
								<div key={weekIdx} className="flex flex-col gap-[3px]">
									{Array.from({ length: 7 }).map((_, dayIdx) => {
										const day = week[dayIdx];
										if (!day) {
											return (
												<div
													key={dayIdx}
													style={{ width: CELL_SIZE, height: CELL_SIZE }}
												/>
											);
										}
										const level = getIntensityLevel(day.count, maxCount);
										return (
											<div
												key={day.key}
												className={`rounded-sm cursor-pointer ${INTENSITY_COLORS[level]} hover:ring-1 hover:ring-foreground/30`}
												style={{ width: CELL_SIZE, height: CELL_SIZE }}
												onMouseEnter={(e) => handleCellHover(e, day)}
												onMouseLeave={handleCellLeave}
											/>
										);
									})}
								</div>
							))}
						</div>
					</div>

					{/* Legend */}
					<div className="flex items-center justify-end gap-1 mt-2 text-xs text-foreground/50">
						<span>{t('less')}</span>
						{INTENSITY_COLORS.map((color, i) => (
							<div
								key={i}
								className={`rounded-sm ${color}`}
								style={{ width: CELL_SIZE - 2, height: CELL_SIZE - 2 }}
							/>
						))}
						<span>{t('more')}</span>
					</div>
				</div>

				{/* Tooltip */}
				{tooltip && (
					<div
						className="absolute z-50 pointer-events-none"
						style={{
							left: tooltip.x,
							top: tooltip.y,
							transform: 'translate(-50%, -100%)',
						}}
					>
						<div className="bg-[#1b1f23] border border-foreground/20 rounded-md px-3 py-2 text-xs text-white shadow-lg whitespace-nowrap">
							<div className="font-semibold">
								{tooltip.day.count === 0
									? t('noWorkouts')
									: `${tooltip.day.count} ${tooltip.day.count === 1 ? t('workout') : t('workouts')}`}
							</div>
							<div className="text-foreground/50">
								{formatDate(tooltip.day.date, locale)}
							</div>
							{tooltip.day.completions.length > 0 && (
								<div className="mt-1 border-t border-foreground/10 pt-1 space-y-0.5">
									{tooltip.day.completions.map((c, i) => (
										<div key={i} className="text-foreground/70">
											{c.workout_name}
											{c.duration_seconds ? ` · ${formatDuration(c.duration_seconds)}` : ''}
											{c.exercises_count ? ` · ${c.exercises_count} ${t('exercises')}` : ''}
										</div>
									))}
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
