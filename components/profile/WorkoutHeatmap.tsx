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

function formatRelativeDate(dateStr: string, locale: string, t: (key: any, values?: any) => string): string {
	const date = new Date(dateStr);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

	if (diffDays === 0) return t('today');
	if (diffDays === 1) return t('yesterday');
	if (diffDays < 7) return t('daysAgo', { count: diffDays });

	const monthKeys = [
		'monthJan', 'monthFeb', 'monthMar', 'monthApr', 'monthMay', 'monthJun',
		'monthJul', 'monthAug', 'monthSep', 'monthOct', 'monthNov', 'monthDec',
	] as const;

	const day = date.getDate();
	const month = t(monthKeys[date.getMonth()]);
	const year = date.getFullYear();

	if (year === now.getFullYear()) {
		return `${month} ${day}`;
	}
	return `${month} ${day}, ${year}`;
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

const CELL_SIZE = 11;
const CELL_GAP = 2;
const CELL_STEP = CELL_SIZE + CELL_GAP;

const INTENSITY_COLORS = [
	'bg-[#161b22]',
	'bg-primary-900',
	'bg-primary-700',
	'bg-primary-500',
	'bg-primary-300',
];

export default function WorkoutHeatmap({ completions }: WorkoutHeatmapProps) {
	const t = useTranslations('Profile');
	const locale = useLocale();
	const [selectedYear, setSelectedYear] = useState<number | null>(null);
	const [tooltip, setTooltip] = useState<{ x: number; y: number; day: DayData } | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const isRolling = selectedYear === null;

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

		let startDate: Date;
		let endDate: Date;

		if (isRolling) {
			// Last 360 days
			endDate = now;
			startDate = new Date(now);
			startDate.setDate(startDate.getDate() - 360);
		} else {
			const isCurrentYear = selectedYear === now.getFullYear();
			endDate = isCurrentYear ? now : new Date(selectedYear, 11, 31);
			startDate = new Date(selectedYear, 0, 1);
		}

		// Adjust start to previous Sunday
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

		const rangeStart = isRolling
			? new Date(new Date().getTime() - 360 * 24 * 60 * 60 * 1000)
			: new Date(selectedYear!, 0, 1);

		while (current <= endDate) {
			const key = getDayKey(current);
			const dayCompletions = completionMap.get(key) || [];
			const count = dayCompletions.length;

			if (current >= rangeStart) {
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

		const monthKeys = [
			'monthJan', 'monthFeb', 'monthMar', 'monthApr', 'monthMay', 'monthJun',
			'monthJul', 'monthAug', 'monthSep', 'monthOct', 'monthNov', 'monthDec',
		] as const;
		const allMonthLabels: { label: string; col: number }[] = [];
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
		// Skip labels that are too close to the next one (partial months at boundaries)
		const MIN_COL_GAP = 4;
		const monthLabels = allMonthLabels.filter((label, i) => {
			const next = allMonthLabels[i + 1];
			if (next && next.col - label.col < MIN_COL_GAP) {
				return false;
			}
			return true;
		});

		let currentStreak = 0;
		const streakDate = new Date(now);
		if (!completionMap.has(getDayKey(streakDate))) {
			streakDate.setDate(streakDate.getDate() - 1);
		}
		while (completionMap.has(getDayKey(streakDate))) {
			currentStreak++;
			streakDate.setDate(streakDate.getDate() - 1);
		}

		return { weeks, monthLabels, maxCount, totalCount, currentStreak };
	}, [completions, selectedYear, isRolling, t]);

	// Group completions by month for the activity timeline
	const activityByMonth = useMemo(() => {
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

		// Group by month key (YYYY-MM)
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
		<div className="space-y-4">
			{/* Header with total count */}
			<h2 className="text-base text-foreground/70">
				<strong className="text-foreground">{totalCount}</strong>{' '}
				{isRolling
					? t('completionsLastYear')
					: t('completionsInYear', { year: selectedYear })}
				{currentStreak > 0 && isRolling && (
					<>
						{' · '}
						<strong className="text-foreground">{currentStreak}</strong> {t('dayStreak')}
					</>
				)}
			</h2>

			{/* Main layout: heatmap + year nav */}
			<div className="flex flex-col lg:flex-row gap-4">
				{/* Heatmap */}
				<div className="flex-1 min-w-0">
					<div className="border border-foreground/10 rounded-lg p-3 overflow-x-auto" ref={containerRef}>
						<div className="inline-block min-w-fit relative">
							{/* Month labels */}
							<div className="relative text-xs text-foreground/50 mb-1" style={{ paddingLeft: 32, height: 16 }}>
								{monthLabels.map((m) => (
									<span
										key={`${m.label}-${m.col}`}
										className="absolute"
										style={{ left: 32 + m.col * CELL_STEP }}
									>
										{m.label}
									</span>
								))}
							</div>

							{/* Grid with day labels */}
							<div className="flex">
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

								<div className="flex gap-[2px]">
									{weeks.map((week, weekIdx) => (
										<div key={weekIdx} className="flex flex-col gap-[2px]">
											{Array.from({ length: 7 }).map((_, dayIdx) => {
												const day = week[dayIdx];
												const outOfRange = day && !isRolling && day.date.getFullYear() !== selectedYear;
												if (!day || outOfRange) {
													return (
														<div
															key={day?.key ?? dayIdx}
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
				</div>

				{/* Year navigation sidebar */}
				<div className="flex lg:flex-col gap-2 lg:gap-0 lg:w-auto flex-wrap">
					{availableYears.map((year) => (
						<button
							key={year}
							onClick={() => setSelectedYear(selectedYear === year ? null : year)}
							className={`text-sm px-3 py-1 lg:px-4 lg:py-2 rounded-md lg:rounded-none lg:border-r-2 transition-colors text-left ${
								selectedYear === year
									? 'font-bold text-foreground lg:border-r-primary-500 bg-primary-500/10 lg:bg-transparent'
									: 'text-foreground/50 hover:text-foreground lg:border-r-transparent'
							}`}
						>
							{year}
						</button>
					))}
				</div>
			</div>

			{/* Activity timeline */}
			{activityByMonth.length > 0 && (
				<div>
					<h2 className="text-base font-semibold mb-4">{t('activityTitle')}</h2>

					{activityByMonth.map((month) => (
						<div key={`${month.year}-${month.monthLabel}`}>
							{/* Month header */}
							<h3 className="text-sm pb-1 mb-3 border-b border-foreground/10">
								<span className="bg-background pr-3">
									{month.monthLabel}{' '}
									<span className="text-foreground/50">{month.year}</span>
								</span>
							</h3>

							{/* Timeline items for this month */}
							<div className="ml-4 mb-6">
								{month.sortedDays.map(([dateKey, dayCompletions]) => {
									const totalForDay = dayCompletions.length;
									return (
										<div key={dateKey} className="relative pl-6 pb-4 border-l-2 border-foreground/10 last:border-l-transparent">
											{/* Timeline dot */}
											<div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary-500" />

											{/* Content */}
											<div className="flex items-start justify-between gap-4">
												<div className="flex-1 min-w-0">
													<p className="text-sm text-foreground">
														{t('completedWorkouts', { count: totalForDay })}
													</p>
													<ul className="mt-1 space-y-1">
														{dayCompletions.map((c, i) => (
															<li key={i} className="text-sm text-foreground/70 flex items-center gap-2">
																<span>{c.workout_name}</span>
																{(c.exercises_count || c.duration_seconds) && (
																	<span className="text-xs text-foreground/40">
																		{c.exercises_count ? `${c.exercises_count} ${t('exercises')}` : ''}
																		{c.duration_seconds ? ` · ${formatDuration(c.duration_seconds)}` : ''}
																	</span>
																)}
															</li>
														))}
													</ul>
												</div>
												<time className="text-xs text-foreground/50 shrink-0 pt-0.5">
													{formatRelativeDate(dateKey, locale, t)}
												</time>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
