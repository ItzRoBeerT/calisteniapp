'use client';

import {Link} from '@/i18n/navigation';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	children: ReactNode;
	className?: string;
}

export default function NavLink({ href='', children, className, ...props }: NavLinkProps) {
	const path = usePathname();
	const isActive = path === href || path.startsWith(href + '/');

	return (
		<Link href={href} className={`${isActive ? 'text-primary' : 'text-white'} ${className || ''}`.trim()} {...props}>
			{children}
		</Link>
	);
}
