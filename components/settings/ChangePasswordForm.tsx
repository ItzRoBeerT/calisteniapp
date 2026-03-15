'use client';

import { useTranslations } from 'next-intl';
import { changePassword } from '@/app/[locale]/profile/actions';
import { SubmitButton } from '@/components/ui/SubmitButton';

export default function ChangePasswordForm() {
	const t = useTranslations('Settings');

	return (
		<form className="flex flex-col gap-5">
			<div>
				<label
					htmlFor="newPassword"
					className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2"
				>
					{t('newPasswordLabel')}
				</label>
				<input
					id="newPassword"
					className="w-full rounded-xl px-4 py-3 bg-background/60 border border-white/[0.06] focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 focus:outline-none transition-all text-sm placeholder:text-foreground/20"
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
					className="block text-xs font-medium text-foreground/50 uppercase tracking-wider mb-2"
				>
					{t('confirmPasswordLabel')}
				</label>
				<input
					id="confirmPassword"
					className="w-full rounded-xl px-4 py-3 bg-background/60 border border-white/[0.06] focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 focus:outline-none transition-all text-sm placeholder:text-foreground/20"
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
				className="bg-primary-500 hover:bg-primary-400 text-black font-semibold px-5 py-3 rounded-xl transition-all mt-1 text-sm tracking-wide hover:shadow-lg hover:shadow-primary-500/20"
			>
				{t('updatePassword')}
			</SubmitButton>
		</form>
	);
}
