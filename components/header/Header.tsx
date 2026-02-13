import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';

export default async function Header() {
	const t = await getTranslations('Header');
	const locale = await getLocale();
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
		startWorkout: t('startWorkout'),
		settings: t('settings'),
	};

	return (
		<header className="bg-surface/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
			<div className="container mx-auto px-4 py-3 flex justify-between items-center">
				<Link href="/" className="flex items-center gap-2 group">
					<Image
						src="/images/logo_light.png"
						alt="OpenCalisthenics"
						width={36}
						height={36}
						className="group-hover:scale-105 transition-transform duration-200"
					/>
					<span className="font-heading text-lg font-bold tracking-wider text-white group-hover:text-primary-500 transition-colors hidden sm:inline">
						OpenCalisthenics
					</span>
				</Link>

				{/* Desktop navigation */}
				<nav className="hidden md:flex gap-6 items-center">
					<NavLink
						href="/workouts"
						className="text-sm font-medium tracking-wide hover:text-primary-500 transition-colors"
					>
						{translations.workouts}
					</NavLink>
					<NavLink
						href="/exercises"
						className="text-sm font-medium tracking-wide hover:text-primary-500 transition-colors"
					>
						{translations.exercises}
					</NavLink>
					<NavLink
						href="/roadmaps"
						className="text-sm font-medium tracking-wide hover:text-primary-500 transition-colors"
					>
						{translations.roadmaps}
					</NavLink>
					{user ? (
						<UserMenu userName={userName || translations.user} locale={locale} />
					) : (
						<NavLink
							href="/login"
							className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
						>
							{translations.login}
						</NavLink>
					)}
				</nav>
				{/* Mobile navigation */}
				<MobileMenu user={user} userName={userName} translations={translations} />
			</div>
		</header>
	);
}
