'use client';

import { useState } from 'react';
import NavLink from './NavLink';

type HeaderTranslations = {
	workouts: string;
	exercises: string;
	roadmaps: string;
	login: string;
	register: string;
	user: string;
	toggleMenu: string;
	startWorkout: string;
	settings: string;
};

type MobileMenuProps = {
	user: unknown;
	userName: string | null;
	translations: HeaderTranslations;
};

export default function MobileMenu({ user, userName, translations }: MobileMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<div className="md:hidden">
			{/* Hamburger button */}
			<button
				onClick={toggleMenu}
				className="p-2 rounded hover:bg-surface/50 transition-colors"
				aria-label={translations.toggleMenu}
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
					/>
				</svg>
			</button>

			{/* Mobile menu dropdown */}
			{isOpen && (
				<div className="absolute top-16 right-4 bg-surface rounded-lg shadow-lg p-4 border border-surface min-w-max z-40">
					<nav className="flex flex-col gap-3">
						<NavLink
							href="/workouts"
							className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							{translations.workouts}
						</NavLink>
						<NavLink
							href="/exercises"
							className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							{translations.exercises}
						</NavLink>
						<NavLink
							href="/roadmaps"
							className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							{translations.roadmaps}
						</NavLink>
						{!!user && (
							<NavLink
								href="/workouts/start"
								className="block px-4 py-2 bg-secondary-500 rounded hover:bg-secondary-600 transition text-white text-center text-sm font-medium"
								onClick={() => setIsOpen(false)}
							>
								{translations.startWorkout}
							</NavLink>
						)}
						{user ? (
							<>
								<NavLink
									href="/settings"
									className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
									onClick={() => setIsOpen(false)}
								>
									{translations.settings}
								</NavLink>
								<NavLink
									href="/profile"
									className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors text-sm text-foreground/70"
									onClick={() => setIsOpen(false)}
								>
									{userName}
								</NavLink>
							</>
						) : (
							<div className="flex flex-col gap-2">
								<NavLink
									href="/login"
									className="block px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition text-black text-center"
									onClick={() => setIsOpen(false)}
								>
									{translations.login}
								</NavLink>
								<NavLink
									href="/register"
									className="block px-4 py-2 border border-purple-500 rounded hover:bg-purple-500/10 transition text-center"
									onClick={() => setIsOpen(false)}
								>
									{translations.register}
								</NavLink>
							</div>
						)}
					</nav>
				</div>
			)}
		</div>
	);
}
