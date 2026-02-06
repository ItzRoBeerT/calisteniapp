import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { getTranslations } from 'next-intl/server';

export default async function Header() {
	const t = await getTranslations('Header');
	const supabase = await createClient();

	let user = null;
	let userName = null;

	if (supabase) {
		const { data } = await supabase.auth.getUser();
		user = data?.user;

		if (user) {
			const { data: userData } = await supabase
				.from('profiles')
				.select('full_name, username')
				.eq('id', user.id)
				.single();

			if (userData) {
				userName = userData.full_name || userData.username || user.email;
			} else {
				userName = user.email;
			}
		}
	}

	const translations = {
		workouts: t('workouts'),
		exercises: t('exercises'),
		roadmaps: t('roadmaps'),
		login: t('login'),
		register: t('register'),
		user: t('user'),
		toggleMenu: t('toggleMenu'),
	};

	return (
		<header className="bg-surface backdrop-blur-sm bg-opacity-80 sticky top-0 z-50">
			<div className="container mx-auto p-4 flex justify-between items-center">
				<Link href="/">Calistenia</Link>

				{/* Desktop navigation */}
				<div className="hidden md:flex gap-2 items-center">
					<NavLink
						href="/workouts"
						className="hover:text-primary-500 transition-colors ease-in"
					>
						{translations.workouts}
					</NavLink>
					<NavLink
						href="/exercises"
						className="hover:text-primary-500 transition-colors ease-in"
					>
						{translations.exercises}
					</NavLink>
					<NavLink
						href="/roadmaps"
						className="hover:text-primary-500 transition-colors ease-in"
					>
						{translations.roadmaps}
					</NavLink>
					{user ? (
						<UserMenu userName={userName || translations.user} />
					) : (
						<NavLink
							href="/login"
							className="bg-purple-500 rounded p-2 hover:bg-purple-600 transition text-black"
						>
							{translations.login}
						</NavLink>
					)}
				</div>

				{/* Mobile navigation */}
				<MobileMenu user={user} userName={userName} translations={translations} />
			</div>
		</header>
	);
}
