import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import ProfileForm from '@/components/profile/ProfileForm';
import ChangePasswordForm from '@/components/profile/ChangePasswordForm';

export default async function ProfilePage() {
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
		.eq('id', user.id)
		.single();

	const t = await getTranslations('Profile');

	return (
		<div className="max-w-2xl mx-auto px-4 py-8">
			<h1 className="text-4xl text-center font-bold mb-8">{t('title')}</h1>

			<div className="space-y-8">
				<section className="bg-surface rounded-lg shadow-lg p-6">
					<h2 className="text-xl font-semibold mb-4">{t('profileInfo')}</h2>
					<ProfileForm
						email={user.email || ''}
						fullName={profile?.full_name || ''}
						username={profile?.username || ''}
					/>
				</section>

				<section className="bg-surface rounded-lg shadow-lg p-6">
					<h2 className="text-xl font-semibold mb-4">
						{t('changePassword')}
					</h2>
					<ChangePasswordForm />
				</section>
			</div>
		</div>
	);
}
