'use client';

import { useTranslations, useLocale } from 'next-intl';
import { formatDate, formatDuration, formatRelativeDate } from './utils';
import type { Completion, MonthActivity } from './types';

type ActivityTimelineProps = {
	activityByMonth: MonthActivity[];
	selectedDay: string | null;
	onClearSelection: () => void;
	activityRef: React.Ref<HTMLDivElement>;
};

function TimelineHeader({
	title,
	selectedDay,
	onClearSelection,
}: {
	title: string;
	selectedDay: string | null;
	onClearSelection: () => void;
}) {
	const t = useTranslations('Profile');

	return (
		<div className="relative px-5 py-4 border-b border-white/[0.06]">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 rounded-lg bg-secondary-500/10 flex items-center justify-center">
						<svg className="w-4 h-4 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
					</div>
					<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
						{title}
					</h2>
				</div>
				{selectedDay && (
					<button
						onClick={onClearSelection}
						className="text-xs text-foreground/40 hover:text-foreground/70 px-3 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors"
					>
						{t('showAll')}
					</button>
				)}
			</div>
		</div>
	);
}

function DayEntry({
	dateKey,
	dayCompletions,
	selectedDay,
	 
	t,
}: {
	dateKey: string;
	dayCompletions: Completion[];
	selectedDay: string | null;
	 
	t: (key: any, values?: any) => string;
}) {
	const locale = useLocale();
	const totalForDay = dayCompletions.length;

	return (
		<div className={selectedDay ? 'pb-2' : 'relative pl-6 pb-4 border-l-2 border-white/[0.06] last:border-l-transparent'}>
			{!selectedDay && (
				<div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${
					totalForDay >= 3 ? 'bg-secondary-400' : totalForDay >= 2 ? 'bg-primary-400' : 'bg-primary-600'
				}`} />
			)}

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
				{!selectedDay && (
					<time className="text-xs text-foreground/40 shrink-0 pt-0.5">
						{formatRelativeDate(dateKey, locale, t)}
					</time>
				)}
			</div>
		</div>
	);
}

export default function ActivityTimeline({
	activityByMonth,
	selectedDay,
	onClearSelection,
	activityRef,
}: ActivityTimelineProps) {
	const t = useTranslations('Profile');
	const locale = useLocale();

	const filteredActivity = selectedDay
		? activityByMonth
			.map((month) => ({
				...month,
				sortedDays: month.sortedDays.filter(([dateKey]) => dateKey === selectedDay),
			}))
			.filter((month) => month.sortedDays.length > 0)
		: activityByMonth;

	if (filteredActivity.length === 0 && selectedDay) {
		return (
			<div ref={activityRef} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm">
				<div className="absolute inset-0 bg-gradient-to-br from-secondary-500/[0.02] to-transparent pointer-events-none" />
				<TimelineHeader
					title={formatDate(new Date(selectedDay), locale)}
					selectedDay={selectedDay}
					onClearSelection={onClearSelection}
				/>
				<div className="relative p-5 text-center py-8">
					<p className="text-sm text-foreground/40">{t('noWorkouts')}</p>
				</div>
			</div>
		);
	}

	if (filteredActivity.length === 0) return null;

	return (
		<div ref={activityRef} className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm">
			<div className="absolute inset-0 bg-gradient-to-br from-secondary-500/[0.02] to-transparent pointer-events-none" />

			<TimelineHeader
				title={selectedDay ? formatDate(new Date(selectedDay), locale) : t('activityTitle')}
				selectedDay={selectedDay}
				onClearSelection={onClearSelection}
			/>

			<div className="relative p-5">
				{filteredActivity.map((month) => (
					<div key={`${month.year}-${month.monthLabel}`}>
						{!selectedDay && (
							<h3 className="text-sm font-medium pb-1 mb-3 border-b border-white/[0.06]">
								<span className="text-foreground/70">
									{month.monthLabel}{' '}
									<span className="text-foreground/30">{month.year}</span>
								</span>
							</h3>
						)}

						<div className={selectedDay ? '' : 'ml-4 mb-6'}>
							{month.sortedDays.map(([dateKey, dayCompletions]) => (
								<DayEntry
									key={dateKey}
									dateKey={dateKey}
									dayCompletions={dayCompletions}
									selectedDay={selectedDay}
									t={t}
								/>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
