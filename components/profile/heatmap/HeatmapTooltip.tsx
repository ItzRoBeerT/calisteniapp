'use client';

import { useTranslations, useLocale } from 'next-intl';
import { formatDate, formatDuration } from './utils';
import type { DayData } from './types';

type HeatmapTooltipProps = {
	x: number;
	y: number;
	day: DayData;
};

export default function HeatmapTooltip({ x, y, day }: HeatmapTooltipProps) {
	const t = useTranslations('Profile');
	const locale = useLocale();

	return (
		<div
			className="absolute z-50 pointer-events-none"
			style={{
				left: x,
				top: y,
				transform: day.row <= 1 ? 'translate(-50%, 0%)' : 'translate(-50%, -100%)',
			}}
		>
			<div className="bg-surface border border-white/[0.12] rounded-lg px-3 py-2 text-xs text-white shadow-xl whitespace-nowrap">
				<div className="font-semibold">
					{formatDate(day.date, locale)}
				</div>
				{day.completions.length > 0 ? (
					<div className="mt-1 space-y-0.5">
						{day.completions.map((c, i) => (
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
	);
}
