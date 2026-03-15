'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

export function AnimatedSection({
	children,
	className,
	style,
}: {
	children: React.ReactNode;
	className?: string;
	style?: React.CSSProperties;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-80px' });
	return (
		<motion.section
			ref={ref}
			className={className}
			style={style}
			initial={{ opacity: 0, y: 60 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
			transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
		>
			{children}
		</motion.section>
	);
}

export function StaggerContainer({
	children,
	className,
	staggerDelay = 0.1,
}: {
	children: React.ReactNode;
	className?: string;
	staggerDelay?: number;
}) {
	const ref = useRef(null);
	const isInView = useInView(ref, { once: true, margin: '-60px' });
	return (
		<motion.div
			ref={ref}
			className={className}
			initial="hidden"
			animate={isInView ? 'visible' : 'hidden'}
			variants={{ visible: { transition: { staggerChildren: staggerDelay } } }}
		>
			{children}
		</motion.div>
	);
}

export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
	return (
		<motion.div
			className={className}
			variants={{
				hidden: { opacity: 0, y: 40, scale: 0.95 },
				visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
			}}
		>
			{children}
		</motion.div>
	);
}
