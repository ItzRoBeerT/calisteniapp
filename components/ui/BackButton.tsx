import { Link } from '@/i18n/navigation';
import React from 'react';

type BackButtonProps = {
  href: string;
  label?: string;
};

export default function BackButton({ href, label = 'Volver' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      {label}
    </Link>
  );
}