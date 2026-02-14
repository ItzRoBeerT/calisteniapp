'use client';

import { useTranslations } from 'next-intl';

type StatsCardsProps = {
	totalCount: number;
	currentStreak: number;
	longestStreak: number;
	activeDays: number;
};

const STATS_CONFIG = [
	{
		key: 'total',
		translationKey: 'statTotal' as const,
		prop: 'totalCount' as const,
		color: {
			text: 'text-primary-300',
			accent: 'bg-primary-400',
			border: 'border-primary-500/20 hover:border-primary-400/40',
			glow: 'shadow-[0_0_25px_rgba(163,134,255,0.08)]',
			labelDot: 'bg-primary-400',
		},
	},
	{
		key: 'streak',
		translationKey: 'statStreak' as const,
		prop: 'currentStreak' as const,
		color: {
			text: 'text-secondary-300',
			accent: 'bg-secondary-400',
			border: 'border-secondary-500/20 hover:border-secondary-400/40',
			glow: 'shadow-[0_0_25px_rgba(50,215,75,0.08)]',
			labelDot: 'bg-secondary-400',
		},
	},
	{
		key: 'longest',
		translationKey: 'statLongest' as const,
		prop: 'longestStreak' as const,
		color: {
			text: 'text-tertiary-300',
			accent: 'bg-tertiary-400',
			border: 'border-tertiary-500/20 hover:border-tertiary-400/40',
			glow: 'shadow-[0_0_25px_rgba(3,218,197,0.08)]',
			labelDot: 'bg-tertiary-400',
		},
	},
	{
		key: 'activeDays',
		translationKey: 'statActiveDays' as const,
		prop: 'activeDays' as const,
		color: {
			text: 'text-primary-300',
			accent: 'bg-primary-400',
			border: 'border-primary-500/20 hover:border-primary-400/40',
			glow: 'shadow-[0_0_25px_rgba(163,134,255,0.08)]',
			labelDot: 'bg-primary-400',
		},
	},
] as const;

export default function StatsCards({ totalCount, currentStreak, longestStreak, activeDays }: StatsCardsProps) {
	const t = useTranslations('Profile');

	const values: Record<string, number> = { totalCount, currentStreak, longestStreak, activeDays };

	return (
		<div className="grid grid-cols-4 gap-2">
			{STATS_CONFIG.map(({ key, translationKey, prop, color }) => (
				<div
					key={key}
					className={`group relative overflow-hidden rounded-md border ${color.border} bg-surface/70 backdrop-blur-sm ${color.glow} transition-all duration-300`}
					style={{ clipPath: 'polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)' }}
				>
					{/* Diagonal accent slash */}
					<div
						className={`absolute -top-4 -left-3 w-16 h-1 ${color.accent} opacity-40 group-hover:opacity-80 transition-opacity duration-300`}
						style={{ transform: 'rotate(-45deg)' }}
					/>

					<div className="relative px-3 py-3 flex items-center gap-2">
						{/* Number */}
						<div className={`font-heading text-2xl font-black tracking-tighter ${color.text} tabular-nums leading-none`}>
							{values[prop]}
						</div>

						{/* Label with dot indicator */}
						<div className="flex items-center gap-1.5">
							<span className={`w-1 h-1 rounded-full ${color.labelDot} opacity-60`} />
							<span className="text-[10px] uppercase tracking-[0.2em] text-foreground/40 font-medium truncate">
								{t(translationKey)}
							</span>
						</div>
					</div>

					{/* Bottom-right corner cut accent */}
					<div
						className={`absolute bottom-0 right-0 w-[14px] h-[14px] ${color.accent} opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-300`}
						style={{ clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }}
					/>
				</div>
			))}
		</div>
	);
}
