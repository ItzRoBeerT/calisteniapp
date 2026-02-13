'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function EmptyState() {
	const t = useTranslations('Profile');

	return (
		<div className="space-y-6">
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
