'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';

export default function PruebaPage() {
	return (
		<div className="w-full -mt-4">
			<section className="relative left-1/2 -ml-[50vw] w-screen bg-[#0C0C0C] overflow-hidden">
				<div className="relative h-[100svh]">

					{/* Image — always absolute right, 50% opacity on mobile */}
					<motion.div
						className="absolute inset-y-0 right-0 w-[55%] pointer-events-none z-10 opacity-50 md:opacity-100"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
					>
						<Image
							src="/images/home_image_2.png"
							alt="Calisthenics athlete"
							fill
							className="object-contain object-top object-center"
							priority
						/>
					</motion.div>

					{/* Content — max-w keeps text readable and left of the image on mobile */}
					<div className="relative z-20 flex flex-col justify-start px-5 sm:px-10 md:px-14 lg:px-[56px] pt-20 md:pt-28 pb-16 max-w-[55%] sm:max-w-[60%] md:max-w-none">

						{/* Headline */}
						<div className="flex flex-col leading-[0.9]">
							{(['ENTRENA', 'PROGRESA', 'DOMINA'] as const).map((word, i) => (
								<motion.span
									key={word}
									className="font-black tracking-tight"
									style={{
										fontFamily: "'Orbitron', sans-serif",
										fontSize: 'clamp(32px, 9vw, 140px)',
										letterSpacing: '-0.02em',
										color: word === 'PROGRESA' ? '#a386ff' : '#ffffff',
									}}
									initial={{ opacity: 0, x: -40 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										duration: 0.7,
										delay: 0.15 * i,
										ease: [0.22, 1, 0.36, 1],
									}}
								>
									{word}
								</motion.span>
							))}
						</div>

						{/* Tagline */}
						<motion.p
							className="mt-5 mb-6 text-xs sm:text-sm"
							style={{
								fontFamily: "'Space Grotesk', sans-serif",
								color: '#808080',
							}}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
						>
							Calistenia. Para todos. Siempre gratis.
						</motion.p>

						{/* CTAs */}
						<motion.div
							className="flex flex-col xs:flex-row flex-wrap items-start gap-3"
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
						>
							<Link
								href="/exercises"
								className="bg-white hover:bg-gray-100 text-[#0C0C0C] font-bold text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-[14px] transition-all whitespace-nowrap"
								style={{ fontFamily: "'Orbitron', sans-serif" }}
							>
								Empezar gratis
							</Link>
							<Link
								href="/login"
								className="bg-[#0C0C0C] hover:bg-[#1a1a1a] text-white font-bold text-xs sm:text-sm px-5 sm:px-8 py-3 sm:py-[14px] border border-[#333333] transition-all whitespace-nowrap"
								style={{ fontFamily: "'Orbitron', sans-serif" }}
							>
								Login →
							</Link>
						</motion.div>
					</div>
				</div>
			</section>
		</div>
	);
}
