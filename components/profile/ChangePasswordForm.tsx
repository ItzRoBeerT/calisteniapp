'use client';

import { useTranslations } from 'next-intl';
import { changePassword } from '@/app/[locale]/profile/actions';
import { SubmitButton } from '@/app/[locale]/(auth)/login/submit-button';

export default function ChangePasswordForm() {
	const t = useTranslations('Profile');

	return (
		<form className="flex flex-col gap-4">
			<div>
				<label
					htmlFor="newPassword"
					className="block text-sm font-medium mb-1"
				>
					{t('newPasswordLabel')}
				</label>
				<input
					id="newPassword"
					className="w-full rounded-md px-4 py-2 bg-inherit border border-foreground/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
					name="newPassword"
					type="password"
					placeholder={t('newPasswordPlaceholder')}
					minLength={6}
					required
				/>
			</div>

			<div>
				<label
					htmlFor="confirmPassword"
					className="block text-sm font-medium mb-1"
				>
					{t('confirmPasswordLabel')}
				</label>
				<input
					id="confirmPassword"
					className="w-full rounded-md px-4 py-2 bg-inherit border border-foreground/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:outline-none transition-colors"
					name="confirmPassword"
					type="password"
					placeholder={t('confirmPasswordPlaceholder')}
					minLength={6}
					required
				/>
			</div>

			<SubmitButton
				formAction={changePassword}
				pendingText={t('updatingPassword')}
				className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-xl font-medium transition-colors mt-2"
			>
				{t('updatePassword')}
			</SubmitButton>
		</form>
	);
}
