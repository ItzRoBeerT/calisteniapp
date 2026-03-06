'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function HeaderContainer({ children }: { children: React.ReactNode }) {
	const pathname = usePathname();
	const [visible, setVisible] = useState(true);
	const lastScrollY = useRef(0);

	const isHome =
		/^\/[a-z]{2}\/?$/.test(pathname) ||
		/^\/[a-z]{2}\/home\/?$/.test(pathname) ||
		pathname === '/';

	useEffect(() => {
		if (!isHome) return;

		const handleScroll = () => {
			const currentScrollY = window.scrollY;
			if (currentScrollY < lastScrollY.current || currentScrollY < 10) {
				setVisible(true);
			} else if (currentScrollY > lastScrollY.current + 5) {
				setVisible(false);
			}
			lastScrollY.current = currentScrollY;
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isHome]);

	return (
		<div
			className={`sticky top-0 z-50 transition-transform duration-300 ${
				isHome && !visible ? '-translate-y-full' : 'translate-y-0'
			}`}
		>
			{children}
		</div>
	);
}
