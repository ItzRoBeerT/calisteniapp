'use client';

import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps extends LinkProps {
	children: ReactNode;
	className?: string;
}

export default function NavLink({ href, children, className, ...props }: NavLinkProps) {
	const path = usePathname();
	const isActive = path === href || path.startsWith(href + '/');

	return (
		<Link href={href} className={`${isActive ? 'text-primary' : 'text-white'} ${className || ''}`.trim()} {...props}>
			{children}
		</Link>
	);
}
