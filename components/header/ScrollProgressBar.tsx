'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function ScrollProgressBar() {
	const pathname = usePathname();
	const [scrollProgress, setScrollProgress] = useState(0);

	// Only show on blog post pages (e.g. /es/blog/my-post)
	const isBlogPost = /\/blog\/.+/.test(pathname);

	useEffect(() => {
		if (!isBlogPost) return;

		const handleScroll = () => {
			const scrollTop = window.scrollY;
			const docHeight =
				document.documentElement.scrollHeight - window.innerHeight;
			setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		return () => window.removeEventListener('scroll', handleScroll);
	}, [isBlogPost]);

	if (!isBlogPost) return null;

	return (
		<div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5 overflow-hidden">
			<div
				className="h-full transition-all duration-75 ease-out"
				style={{
					width: `${scrollProgress}%`,
					background: 'linear-gradient(90deg, #32D74B, #03DAC5)',
					boxShadow: '0 0 8px rgba(50,215,75,0.6)',
				}}
			/>
		</div>
	);
}
