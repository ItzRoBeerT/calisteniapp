'use client';

import { useRef, useEffect } from 'react';
import type { Exercise } from '@/types/supabase';
import HeroSection from './HeroSection';
import ThreeColumnsSection from './ThreeColumnsSection';
import HowItWorksSection from './HowItWorksSection';
import FeaturedExercisesSection from './FeaturedExercisesSection';
import StatsSection from './StatsSection';
import FaqSection from './FaqSection';
import CtaSection from './CtaSection';

export default function HomeClient({
	exerciseCount,
	featuredExercises,
}: {
	exerciseCount: number;
	featuredExercises: Exercise[];
}) {
	const heroRef = useRef<HTMLElement>(null);
	const featuresRef = useRef<HTMLElement>(null);
	const howItWorksRef = useRef<HTMLDivElement>(null);

	// Snap scroll: hero → threecolumns → howItWorks
	useEffect(() => {
		const hero = heroRef.current;
		const features = featuresRef.current;
		if (!hero || !features) return;

		let locked = false;
		let cooldown = false;

		const releaseLock = () => {
			locked = false;
			cooldown = true;
			setTimeout(() => { cooldown = false; }, 300);
		};

		const snapAndLock = (scrollAction: () => void) => {
			locked = true;
			scrollAction();
			let fallback: ReturnType<typeof setTimeout>;
			const onScrollEnd = () => {
				clearTimeout(fallback);
				releaseLock();
			};
			window.addEventListener('scrollend', onScrollEnd, { once: true });
			fallback = setTimeout(() => {
				window.removeEventListener('scrollend', onScrollEnd);
				releaseLock();
			}, 1000);
		};

		const onWheel = (e: WheelEvent) => {
			if (window.innerWidth < 768) return;

			const howItWorks = howItWorksRef.current;
			const featuresTop = features.getBoundingClientRect().top;
			const howItWorksRect = howItWorks?.getBoundingClientRect();
			const howItWorksTop = howItWorksRect?.top ?? Infinity;
			const howItWorksBottom = howItWorksRect?.bottom ?? Infinity;

			const inHero = featuresTop > 0;
			const inFeatures = featuresTop <= 0 && howItWorksTop > 0;
			const inHowItWorks = howItWorksTop <= 0 && howItWorksBottom > 0;

			// Bloquear scroll nativo en las zonas de snap (incluso durante animación)
			if (inHero || inFeatures || (inHowItWorks && e.deltaY < 0)) {
				e.preventDefault();
			}

			if (locked) return;

			if (inHero && e.deltaY > 0) {
				snapAndLock(() => features.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			} else if (inFeatures) {
				if (e.deltaY < 0) {
					snapAndLock(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
				} else if (e.deltaY > 0 && howItWorks) {
					snapAndLock(() => howItWorks.scrollIntoView({ behavior: 'smooth', block: 'start' }));
				}
			} else if (inHowItWorks && e.deltaY < 0) {
				snapAndLock(() => features.scrollIntoView({ behavior: 'smooth', block: 'start' }));
			}
		};

		window.addEventListener('wheel', onWheel, { passive: false });
		return () => window.removeEventListener('wheel', onWheel);
	}, []);

	return (
		<div className="w-full -mt-4">
			<HeroSection ref={heroRef} />
			<ThreeColumnsSection ref={featuresRef} exerciseCount={exerciseCount} />
			<HowItWorksSection ref={howItWorksRef} />
			<FeaturedExercisesSection featuredExercises={featuredExercises} />
			<StatsSection exerciseCount={exerciseCount} />
			<FaqSection />
			<CtaSection />
		</div>
	);
}
