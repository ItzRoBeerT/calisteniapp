'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

type ProfileHeaderProps = {
	displayName: string | null;
	email: string;
	initials: string;
	memberSince: string | null;
};

export default function ProfileHeader({ displayName, email, initials, memberSince }: ProfileHeaderProps) {
	const t = useTranslations('Profile');

	const memberDate = memberSince ? new Date(memberSince) : null;
	const formattedDate = memberDate
		? memberDate.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
		: null;

	return (
		<div className="flex items-center gap-5">
			{/* Avatar */}
			<div className="relative">
				<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-xl font-bold text-black shadow-lg shadow-primary-500/20">
					{initials}
				</div>
				<div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary-500 border-2 border-background" />
			</div>

			{/* Info */}
			<div className="flex-1 min-w-0">
				<h1 className="font-heading text-2xl font-bold tracking-wide">
					{displayName || t('title')}
				</h1>
				<p className="text-sm text-foreground/40 mt-0.5 truncate">{email}</p>
				{formattedDate && (
					<p className="text-xs text-foreground/30 mt-1">
						{t('memberSince', { date: formattedDate })}
					</p>
				)}
			</div>

			{/* Settings link */}
			<Link
				href="/settings"
				className="shrink-0 w-9 h-9 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center text-foreground/40 hover:text-foreground/70 transition-colors"
			>
				<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
				</svg>
			</Link>
		</div>
	);
}
