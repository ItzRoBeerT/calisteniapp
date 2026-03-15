'use client';

import { useTranslations } from 'next-intl';
import { updateProfile } from '@/app/[locale]/profile/actions';
import { SubmitButton } from '@/components/ui/SubmitButton';

interface ProfileFormProps {
	email: string;
	fullName: string;
	username: string;
}

export default function ProfileForm({
	email,
	fullName,
	username,
}: ProfileFormProps) {
	const t = useTranslations('Settings');

	return (
		<form className="flex flex-col gap-5">
			<div>
				<label className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
					{t('emailLabel')}
				</label>
				<input
					className="w-full rounded-xl px-4 py-3 bg-background/60 border border-white/[0.06] text-foreground/40 cursor-not-allowed text-sm"
					type="email"
					value={email}
					disabled
					readOnly
				/>
			</div>

			<div>
				<label htmlFor="fullName" className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
					{t('fullNameLabel')}
				</label>
				<input
					id="fullName"
					className="w-full rounded-xl px-4 py-3 bg-background/60 border border-white/[0.06] focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 focus:outline-none transition-all text-sm placeholder:text-foreground/20"
					name="fullName"
					type="text"
					defaultValue={fullName}
					placeholder={t('fullNamePlaceholder')}
				/>
			</div>

			<div>
				<label htmlFor="username" className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2">
					{t('usernameLabel')}
				</label>
				<input
					id="username"
					className="w-full rounded-xl px-4 py-3 bg-background/60 border border-white/[0.06] focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 focus:outline-none transition-all text-sm placeholder:text-foreground/20"
					name="username"
					type="text"
					defaultValue={username}
					placeholder={t('usernamePlaceholder')}
				/>
			</div>

			<SubmitButton
				formAction={updateProfile}
				pendingText={t('saving')}
				className="bg-primary-500 hover:bg-primary-400 text-black font-semibold px-5 py-3 rounded-xl transition-all mt-1 text-sm tracking-wide hover:shadow-lg hover:shadow-primary-500/20"
			>
				{t('saveChanges')}
			</SubmitButton>
		</form>
	);
}
