'use client';

import { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';

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
	row: number;
};

function getDayKey(date: Date): string {
	const yyyy = date.getFullYear();
	const mm = String(date.getMonth() + 1).padStart(2, '0');
	const dd = String(date.getDate()).padStart(2, '0');
	return `${yyyy}-${mm}-${dd}`;
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
	'bg-white/[0.06]',
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

	const { weeks, monthLabels, maxCount, totalCount, currentStreak, longestStreak, activeDays } = useMemo(() => {
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
			const flipped = day.row <= 1;
			setTooltip({
				x: cellRect.left - rect.left + cellRect.width / 2,
				y: flipped
					? cellRect.bottom - rect.top + 8
					: cellRect.top - rect.top - 8,
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

	// Stats cards data
	const stats = [
		{
			label: t('statTotal'),
			value: totalCount,
			icon: (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
			),
			color: 'primary',
		},
		{
			label: t('statStreak'),
			value: currentStreak,
			icon: (
				<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 23c-3.6 0-8-3.17-8-8.5C4 9.53 8.13 3.5 11.43.5c.2-.18.5-.18.7 0 .98.93 2.09 2.15 3.07 3.56.23.33.07.79-.3.93-.7.26-1.4.68-1.9 1.3C11.5 8.13 11 10.5 11 12c0 2.76 2.24 5 5 5 .71 0 1.39-.15 2-.42.33-.14.7.08.75.44C19.1 19.44 16.03 23 12 23z" />
				</svg>
			),
			color: 'secondary',
		},
		{
			label: t('statLongest'),
			value: longestStreak,
			icon: (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
				</svg>
			),
			color: 'tertiary',
		},
		{
			label: t('statActiveDays'),
			value: activeDays,
			icon: (
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			),
			color: 'primary',
		},
	];

	const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
		primary: { bg: 'bg-primary-500/10', text: 'text-primary-400', glow: 'shadow-primary-500/5' },
		secondary: { bg: 'bg-secondary-500/10', text: 'text-secondary-400', glow: 'shadow-secondary-500/5' },
		tertiary: { bg: 'bg-tertiary-500/10', text: 'text-tertiary-400', glow: 'shadow-tertiary-500/5' },
	};

	// Empty state
	if (completions.length === 0) {
		return (
			<div className="space-y-6">
				{/* Empty heatmap card */}
				<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm p-8 sm:p-12 text-center">
					<div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.03] to-tertiary-500/[0.02] pointer-events-none" />
					<div className="relative space-y-4">
						<div className="w-16 h-16 mx-auto rounded-2xl bg-primary-500/10 flex items-center justify-center">
							<svg className="w-8 h-8 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
							</svg>
						</div>
						<h2 className="font-heading text-xl font-bold tracking-wide">{t('emptyTitle')}</h2>
						<p className="text-sm text-foreground/50 max-w-md mx-auto">{t('emptyDescription')}</p>
						<Link
							href="/workouts"
							className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-700 text-sm font-medium text-white transition-colors"
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{t('startWorkout')}
						</Link>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Stats cards */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				{stats.map((stat) => {
					const colors = colorMap[stat.color];
					return (
						<div
							key={stat.label}
							className={`relative overflow-hidden rounded-xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm p-4 shadow-lg ${colors.glow}`}
						>
							<div className="flex items-center gap-2 mb-2">
								<div className={`w-7 h-7 rounded-lg ${colors.bg} flex items-center justify-center ${colors.text}`}>
									{stat.icon}
								</div>
							</div>
							<div className="font-heading text-2xl font-bold tracking-wide">{stat.value}</div>
							<div className="text-xs text-foreground/40 mt-0.5">{stat.label}</div>
						</div>
					);
				})}
			</div>

			{/* Heatmap section */}
			<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm">
				<div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.02] to-transparent pointer-events-none" />

				{/* Section header */}
				<div className="relative px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
							<svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<div>
							<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
								{t('workoutActivityTitle')}
							</h2>
							<p className="text-xs text-foreground/40 mt-0.5">
								<strong className="text-foreground/70">{totalCount}</strong>{' '}
								{isRolling ? t('completionsLastYear') : t('completionsInYear', { year: selectedYear })}
								{currentStreak > 0 && isRolling && (
									<>
										{' · '}
										<strong className="text-foreground/70">{currentStreak}</strong> {t('dayStreak')}
									</>
								)}
							</p>
						</div>
					</div>

					{/* Year pills */}
					<div className="flex items-center gap-1">
						{availableYears.map((year) => (
							<button
								key={year}
								onClick={() => setSelectedYear(selectedYear === year ? null : year)}
								className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
									selectedYear === year
										? 'font-bold text-foreground bg-primary-500/15 border border-primary-500/20'
										: 'text-foreground/40 hover:text-foreground/70 hover:bg-white/[0.04] border border-transparent'
								}`}
							>
								{year}
							</button>
						))}
					</div>
				</div>

				{/* Heatmap grid */}
				<div className="relative p-4 overflow-x-auto" ref={containerRef}>
					<div className="inline-block min-w-fit relative">
						{/* Month labels */}
						<div className="relative text-xs text-foreground/40 mb-1" style={{ paddingLeft: 32, height: 16 }}>
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
								className="flex flex-col text-xs text-foreground/40 mr-1"
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
													className={`rounded-sm cursor-pointer ${INTENSITY_COLORS[level]} hover:ring-1 hover:ring-foreground/30 transition-colors`}
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
						<div className="flex items-center justify-end gap-1 mt-2 text-xs text-foreground/40">
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
									transform: tooltip.day.row <= 1 ? 'translate(-50%, 0%)' : 'translate(-50%, -100%)',
								}}
							>
								<div className="bg-surface border border-white/[0.12] rounded-lg px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap">
									<div className="font-semibold">
										{formatDate(tooltip.day.date, locale)}
									</div>
									{tooltip.day.completions.length > 0 ? (
										<div className="mt-1 space-y-0.5">
											{tooltip.day.completions.map((c, i) => (
												<div key={i} className="text-foreground/60">
													{c.workout_name}
													{c.duration_seconds ? ` · ${formatDuration(c.duration_seconds)}` : ''}
													{c.exercises_count ? ` · ${c.exercises_count} ${t('exercises')}` : ''}
												</div>
											))}
										</div>
									) : (
										<div className="text-foreground/40">{t('noWorkouts')}</div>
									)}
								</div>
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Activity timeline */}
			{activityByMonth.length > 0 && (
				<div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm">
					<div className="absolute inset-0 bg-gradient-to-br from-secondary-500/[0.02] to-transparent pointer-events-none" />

					{/* Section header */}
					<div className="relative px-5 py-4 border-b border-white/[0.06]">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-secondary-500/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
							</div>
							<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
								{t('activityTitle')}
							</h2>
						</div>
					</div>

					<div className="relative p-5">
						{activityByMonth.map((month) => (
							<div key={`${month.year}-${month.monthLabel}`}>
								{/* Month header */}
								<h3 className="text-sm font-medium pb-1 mb-3 border-b border-white/[0.06]">
									<span className="text-foreground/70">
										{month.monthLabel}{' '}
										<span className="text-foreground/30">{month.year}</span>
									</span>
								</h3>

								{/* Timeline items */}
								<div className="ml-4 mb-6">
									{month.sortedDays.map(([dateKey, dayCompletions]) => {
										const totalForDay = dayCompletions.length;
										return (
											<div key={dateKey} className="relative pl-6 pb-4 border-l-2 border-white/[0.06] last:border-l-transparent">
												{/* Timeline dot */}
												<div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${
													totalForDay >= 3 ? 'bg-secondary-400' : totalForDay >= 2 ? 'bg-primary-400' : 'bg-primary-600'
												}`} />

												{/* Content */}
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<p className="text-sm text-foreground">
															{t('completedWorkouts', { count: totalForDay })}
														</p>
														<ul className="mt-1 space-y-1">
															{dayCompletions.map((c, i) => (
																<li key={i} className="text-sm text-foreground/60 flex items-center gap-2">
																	<span className="w-1 h-1 rounded-full bg-foreground/20 shrink-0" />
																	<span>{c.workout_name}</span>
																	{(c.exercises_count || c.duration_seconds) && (
																		<span className="text-xs text-foreground/30">
																			{c.exercises_count ? `${c.exercises_count} ${t('exercises')}` : ''}
																			{c.duration_seconds ? ` · ${formatDuration(c.duration_seconds)}` : ''}
																		</span>
																	)}
																</li>
															))}
														</ul>
													</div>
													<time className="text-xs text-foreground/40 shrink-0 pt-0.5">
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
				</div>
			)}
		</div>
	);
}
