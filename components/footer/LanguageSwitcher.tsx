'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { Locale } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { useState, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

const localeConfig: Record<string, { label: string; flag: string; name: string }> = {
	en: { label: 'EN', flag: '🇬🇧', name: 'English' },
	es: { label: 'ES', flag: '🇪🇸', name: 'Español' },
};

export default function LanguageSwitcher() {
	const locale = useLocale() as Locale;
	const pathname = usePathname();
	const router = useRouter();
	const params = useParams();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleOutside = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
		};
		document.addEventListener('mousedown', handleOutside);
		return () => document.removeEventListener('mousedown', handleOutside);
	}, []);

	const handleSwitch = (nextLocale: string) => {
		setOpen(false);
		if (nextLocale === locale) return;
		router.replace(
			// @ts-expect-error -- pathname and params are valid
			{ pathname, params },
			{ locale: nextLocale }
		);
	};

	const current = localeConfig[locale];

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setOpen(p => !p)}
				aria-haspopup="listbox"
				aria-expanded={open}
				className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary-500 transition-colors"
			>
				<span className="text-base leading-none">{current.flag}</span>
				<span>{current.label}</span>
				<svg
					className="w-3 h-3 opacity-60 transition-transform duration-200"
					style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
					fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
				>
					<path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{open && (
				<ul
					role="listbox"
					aria-label="Select language"
					className="absolute left-0 bottom-full mb-2 py-1 rounded-lg overflow-hidden z-50"
					style={{
						background: '#1E1E1E',
						border: '1px solid rgba(255,255,255,0.08)',
						boxShadow: '0 -8px 24px rgba(0,0,0,0.4)',
						minWidth: 130,
					}}
				>
					{routing.locales.map((loc) => {
						const cfg = localeConfig[loc];
						const isActive = locale === loc;
						return (
							<li key={loc} role="option" aria-selected={isActive}>
								{isActive ? (
									<div className="flex items-center gap-2.5 px-3 py-2 text-sm text-primary-500 cursor-default">
										<span className="text-base leading-none">{cfg.flag}</span>
										<span>{cfg.name}</span>
									</div>
								) : (
									<button
										onClick={() => handleSwitch(loc)}
										className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
									>
										<span className="text-base leading-none">{cfg.flag}</span>
										<span>{cfg.name}</span>
									</button>
								)}
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}
