'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale } from '@/i18n/navigation';

export default function LanguageSwitcher() {
	const locale = useLocale() as Locale;
	const pathname = usePathname();
	const router = useRouter();

	const otherLocale = locale === 'es' ? 'en' : 'es';
	const label = locale === 'es' ? 'EN' : 'ES';

	const handleSwitch = () => {
		router.replace(
			// @ts-expect-error -- pathname is valid
			{ pathname },
			{ locale: otherLocale }
		);
	};

	return (
		<button
			onClick={handleSwitch}
			className="text-sm text-gray-400 hover:text-primary-500 transition-colors font-medium tracking-wide"
			aria-label={`Switch to ${otherLocale === 'en' ? 'English' : 'Español'}`}
		>
			{label}
		</button>
	);
}
