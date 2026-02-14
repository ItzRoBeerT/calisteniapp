import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import ProfileForm from '@/components/settings/ProfileForm';
import ChangePasswordForm from '@/components/settings/ChangePasswordForm';

export default async function SettingsPage() {
	const supabase = await createClient();

	if (!supabase) {
		redirect('/login');
	}

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect('/login');
	}

	const { data: profile } = await supabase
		.from('profiles')
		.select('full_name, username')
		.eq('user_id', user.id)
		.single();

	const t = await getTranslations('Settings');

	const initials = (profile?.full_name || profile?.username || user.email || '?')
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	return (
		<div className="max-w-2xl mx-auto px-4 py-10">
			{/* Header with avatar */}
			<div className="flex items-center gap-5 mb-10">
				<div className="relative">
					<div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-700 flex items-center justify-center text-xl font-bold text-black shadow-lg shadow-primary-500/20">
						{initials}
					</div>
					<div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary-500 border-2 border-background" />
				</div>
				<div>
					<h1 className="font-heading text-2xl font-bold tracking-wide">
						{t('title')}
					</h1>
					<p className="text-sm text-foreground/40 mt-0.5">
						{user.email}
					</p>
				</div>
			</div>

			<div className="space-y-6">
				{/* Profile section */}
				<section className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-primary-500/[0.03] to-transparent pointer-events-none" />
					<div className="relative px-6 py-5 border-b border-white/[0.06]">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
							<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
								{t('profileInfo')}
							</h2>
						</div>
					</div>
					<div className="relative p-6">
						<ProfileForm
							email={user.email || ''}
							fullName={profile?.full_name || ''}
							username={profile?.username || ''}
						/>
					</div>
				</section>

				{/* Password section */}
				<section className="relative rounded-2xl border border-white/[0.06] bg-surface/80 backdrop-blur-sm overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-tertiary-500/[0.03] to-transparent pointer-events-none" />
					<div className="relative px-6 py-5 border-b border-white/[0.06]">
						<div className="flex items-center gap-3">
							<div className="w-8 h-8 rounded-lg bg-tertiary-500/10 flex items-center justify-center">
								<svg className="w-4 h-4 text-tertiary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
								</svg>
							</div>
							<h2 className="font-heading text-sm font-semibold tracking-wider uppercase text-foreground/80">
								{t('changePassword')}
							</h2>
						</div>
					</div>
					<div className="relative p-6">
						<ChangePasswordForm />
					</div>
				</section>
			</div>
		</div>
	);
}
