import { createClient } from '@/utils/supabase/server';
import { Link } from '@/i18n/navigation';
import NavLink from '@/components/header/NavLink';
import UserMenu from './UserMenu';
import MobileMenu from './MobileMenu';
import ScrollProgressBar from './ScrollProgressBar';
import HeaderBg from './HeaderBg';
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
				.eq('user_id', user.id)
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
		blog: t('blog'),
		login: t('login'),
		register: t('register'),
		user: t('user'),
		toggleMenu: t('toggleMenu'),
		startWorkout: t('startWorkout'),
		settings: t('settings'),
	};

	return (
		<header className="relative">
			<HeaderBg />
			<div className="mx-auto px-14 h-[72px] flex items-center relative">
				{/* Logo — left */}
				<div className="flex-1">
					<Link href="/" className="flex items-center gap-2.5 group w-fit">
						<Image
							src="/images/logo_light.png"
							alt="OpenCalisthenics"
							width={44}
							height={44}
							className="group-hover:scale-105 transition-transform duration-200"
						/>
						<span className="font-body text-lg font-semibold tracking-[0.18em] text-white/80 group-hover:text-white transition-colors hidden sm:inline">
							OpenCalisthenics
						</span>
					</Link>
				</div>

				{/* Desktop navigation — center */}
				<nav className="hidden md:flex items-center gap-2">
					<NavLink
						href="/exercises"
						className="text-[13px] text-white/40 hover:text-primary-400 transition-colors px-1"
					>
						{translations.exercises}
					</NavLink>
					<span className="text-white/15 select-none text-[13px]">·</span>
					<NavLink
						href="/workouts"
						className="text-[13px] text-white/40 hover:text-primary-400 transition-colors px-1"
					>
						{translations.workouts}
					</NavLink>
					<span className="text-white/15 select-none text-[13px]">·</span>
					<NavLink
						href="/roadmaps"
						className="text-[13px] text-white/40 hover:text-primary-400 transition-colors px-1"
					>
						{translations.roadmaps}
					</NavLink>
					<span className="text-white/15 select-none text-[13px]">·</span>
					<NavLink
						href="/blog"
						className="text-[13px] text-white/40 hover:text-primary-400 transition-colors px-1"
					>
						{translations.blog}
					</NavLink>
				</nav>

				{/* CTA — right */}
				<div className="flex-1 flex justify-end items-center gap-4">
					{user ? (
						<UserMenu userName={userName || translations.user} locale={locale} />
					) : (
						<NavLink
							href="/login"
							className="bg-primary-600 hover:bg-primary-500 text-white font-bold text-[13px] px-[22px] py-[9px] rounded transition-all"
						>
							{translations.login}
						</NavLink>
					)}
					<MobileMenu user={user} userName={userName} translations={translations} />
				</div>
			</div>
			<ScrollProgressBar />
		</header>
	);
}
