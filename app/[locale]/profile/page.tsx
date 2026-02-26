import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import WorkoutHeatmap from '@/components/profile/WorkoutHeatmap';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { getWorkoutCompletions } from '@/actions/workout';

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

	const [completions, profileResult] = await Promise.all([
		getWorkoutCompletions(),
		supabase
			.from('profiles')
			.select('full_name, username')
			.eq('user_id', user.id)
			.single(),
	]);

	const profile = profileResult.data;

	const displayName = profile?.full_name || profile?.username || null;
	const initials = (displayName || user.email || '?')
		.split(' ')
		.map((n: string) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);

	const memberSince = user.created_at
		? new Date(user.created_at)
		: null;

	return (
		<div className="max-w-5xl mx-auto px-4 py-10">
			{/* Profile header */}
			<div className="mb-10">
				<ProfileHeader
					displayName={displayName}
					email={user.email || ''}
					initials={initials}
					memberSince={memberSince?.toISOString() || null}
				/>
			</div>

			{/* Heatmap & activity */}
			<section>
				<Suspense>
					<WorkoutHeatmap completions={completions} />
				</Suspense>
			</section>
		</div>
	);
}
