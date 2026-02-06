'use client';

import { Link } from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { ReactNode, ComponentProps } from 'react';

type LinkProps = ComponentProps<typeof Link>;

interface NavLinkProps {
	href: LinkProps['href'];
	children: ReactNode;
	className?: string;
	onClick?: () => void;
}

export default function NavLink({
	href,
	children,
	className,
	onClick,
}: NavLinkProps) {
	const path = usePathname();
	// Extract the pathname string for comparison
	const hrefPath = typeof href === 'string' ? href : href.pathname;
	const isActive = path.includes(hrefPath as string);

	return (
		<Link
			href={href}
			onClick={onClick}
			className={`${isActive ? 'text-primary' : 'text-white'} ${
				className || ''
			}`.trim()}
		>
			{children}
		</Link>
	);
}
