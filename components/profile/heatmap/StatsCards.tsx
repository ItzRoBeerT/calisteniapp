'use client';

import { useTranslations } from 'next-intl';

type StatsCardsProps = {
	totalCount: number;
	currentStreak: number;
	longestStreak: number;
	activeDays: number;
};

const COLOR_MAP: Record<string, { bg: string; text: string; glow: string }> = {
	primary: { bg: 'bg-primary-500/10', text: 'text-primary-400', glow: 'shadow-primary-500/5' },
	secondary: { bg: 'bg-secondary-500/10', text: 'text-secondary-400', glow: 'shadow-secondary-500/5' },
	tertiary: { bg: 'bg-tertiary-500/10', text: 'text-tertiary-400', glow: 'shadow-tertiary-500/5' },
};

export default function StatsCards({ totalCount, currentStreak, longestStreak, activeDays }: StatsCardsProps) {
	const t = useTranslations('Profile');

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

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
			{stats.map((stat) => {
				const colors = COLOR_MAP[stat.color];
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
	);
}
