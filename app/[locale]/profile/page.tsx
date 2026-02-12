import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getTranslations } from 'next-intl/server';
import WorkoutHeatmap from '@/components/profile/WorkoutHeatmap';
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

	const [t, completions] = await Promise.all([
		getTranslations('Profile'),
		getWorkoutCompletions(),
	]);

	return (
		<div className="px-4 py-8">
			<h1 className="text-4xl text-center font-bold mb-8">{t('title')}</h1>

			<div className="space-y-8">
				<section className="bg-surface rounded-lg shadow-lg p-6">
					<h2 className="text-xl font-semibold mb-4">{t('workoutActivity')}</h2>
					<Suspense>
						<WorkoutHeatmap completions={completions} />
					</Suspense>
				</section>
			</div>
		</div>
	);
}
