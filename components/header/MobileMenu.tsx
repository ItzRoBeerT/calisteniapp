'use client';

import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import NavLink from './NavLink';

type MobileMenuProps = {
	user: any;
	userName: string | null;
};

export default function MobileMenu({ user, userName }: MobileMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => setIsOpen(!isOpen);

	return (
		<div className="md:hidden">
			{/* Hamburger button */}
			<button
				onClick={toggleMenu}
				className="p-2 rounded hover:bg-surface/50 transition-colors"
				aria-label="Toggle menu"
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
							Entrenamientos
						</NavLink>
						<NavLink
							href="/exercises"
							className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							Ejercicios
						</NavLink>
						<NavLink
							href="/roadmaps"
							className="block px-4 py-2 rounded hover:bg-surface/50 transition-colors"
							onClick={() => setIsOpen(false)}
						>
							Roadmaps
						</NavLink>
						{user ? (
							<div className="px-4 py-2 text-sm text-foreground/70">
								{userName}
							</div>
						) : (
							<NavLink
								href="/login"
								className="block px-4 py-2 bg-purple-500 rounded hover:bg-purple-600 transition text-black text-center"
								onClick={() => setIsOpen(false)}
							>
								Login
							</NavLink>
						)}
					</nav>
				</div>
			)}
		</div>
	);
}
