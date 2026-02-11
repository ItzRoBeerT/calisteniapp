'use client';

import { useTranslations } from 'next-intl';
import { updateProfile } from '@/app/[locale]/profile/actions';
import { SubmitButton } from '@/app/[locale]/(auth)/login/submit-button';

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
	const t = useTranslations('Profile');

	return (
		<form className="flex flex-col gap-4">
			<div>
				<label className="block text-sm font-medium mb-1">
					{t('emailLabel')}
				</label>
				<input
					className="w-full rounded-md px-4 py-2 bg-inherit border border-foreground/20 text-foreground/50 cursor-not-allowed"
					type="email"
					value={email}
					disabled
					readOnly
				/>
			</div>

			<div>
				<label htmlFor="fullName" className="block text-sm font-medium mb-1">
					{t('fullNameLabel')}
				</label>
				<input
					id="fullName"
					className="w-full rounded-md px-4 py-2 bg-inherit border border-foreground/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
					name="fullName"
					type="text"
					defaultValue={fullName}
					placeholder={t('fullNamePlaceholder')}
				/>
			</div>

			<div>
				<label htmlFor="username" className="block text-sm font-medium mb-1">
					{t('usernameLabel')}
				</label>
				<input
					id="username"
					className="w-full rounded-md px-4 py-2 bg-inherit border border-foreground/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
					name="username"
					type="text"
					defaultValue={username}
					placeholder={t('usernamePlaceholder')}
				/>
			</div>

			<SubmitButton
				formAction={updateProfile}
				pendingText={t('saving')}
				className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-colors mt-2"
			>
				{t('saveChanges')}
			</SubmitButton>
		</form>
	);
}
