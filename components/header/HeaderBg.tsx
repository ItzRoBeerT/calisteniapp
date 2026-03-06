'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HeaderBg() {
	const pathname = usePathname();
	const [isTop, setIsTop] = useState(true);

	const isHome =
		/^\/[a-z]{2}\/?$/.test(pathname) ||
		/^\/[a-z]{2}\/home\/?$/.test(pathname) ||
		pathname === '/';

	useEffect(() => {
		const handleScroll = () => setIsTop(window.scrollY < 10);
		handleScroll();
		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const atTop = isHome && isTop;

	return (
		<div
			className={`absolute inset-0 transition-all duration-300 border-b ${
				atTop
					? 'bg-transparent border-transparent'
					: 'bg-surface/90 backdrop-blur-md border-white/5'
			}`}
		/>
	);
}
