'use client';

import { Locale, usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useParams } from 'next/navigation';

export default function LocaleSwitcherSelect() {
	const router = useRouter();

	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(nextLocale: string) {
		router.replace(
			// @ts-expect-error -- TypeScript will validate that only known `params`
			// are used in combination with a given `pathname`. Since the two will
			// always match for the current route, we can skip runtime checks.
			{ pathname, params },
			{ locale: nextLocale as Locale }
		);
	}

	return (
		<div className="relative">
			<select
				onChange={(e) => onSelectChange(e.target.value)}
				value={params.locale}
				className="appearance-none w-full bg-white border border-gray-300 rounded-md 
					   pl-3 pr-8 py-2 text-sm font-medium text-gray-700 
					   focus:outline-none focus:ring-2 focus:ring-blue-500 
					   focus:border-blue-500 cursor-pointer"
			>
				{routing.locales.map((locale) => (
					<option
						key={locale}
						value={locale}
						className="bg-white text-gray-900 hover:bg-gray-100"
					>
						{locale.toUpperCase()}
					</option>
				))}
			</select>
			
		</div>
	);
}
