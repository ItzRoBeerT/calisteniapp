'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Orbitron } from 'next/font/google';
import esMessages from '@/messages/es.json';
import enMessages from '@/messages/en.json';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const translations = {
  es: esMessages.NotFound,
  en: enMessages.NotFound,
} as const;

type Locale = keyof typeof translations;

export default function GlobalNotFound() {
  const pathname = usePathname();
  const pathLocale = pathname?.split('/')[1] as Locale;
  const locale: Locale = pathLocale && translations[pathLocale] ? pathLocale : 'es';
  const t = (key: keyof (typeof translations)['es']) => translations[locale][key];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, rgba(187, 134, 252, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, rgba(50, 215, 75, 0.08) 0%, transparent 40%)
          `,
        }}
      />

      {/* 404 Text */}
      <h1
        className={orbitron.className}
        style={{
          fontSize: 'clamp(8rem, 20vw, 16rem)',
          fontWeight: 900,
          lineHeight: 1,
          margin: 0,
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, #BB86FC 0%, #9D4EDD 50%, #7B2CBF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          userSelect: 'none',
        }}
      >
        404
      </h1>

      <div className="text-center max-w-md z-10">
        <h2 className="text-2xl font-bold mb-4 text-foreground">
          {t('title')}
        </h2>
        <p className="text-muted-foreground mb-8">
          {t('subtitle')}
        </p>

        <div className="flex flex-col gap-4 items-center">
          <Link
            href={`/${locale}`}
            className="inline-block px-8 py-3 bg-gradient-to-r from-[#BB86FC] to-[#9D4EDD] text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            {t('backHome')}
          </Link>
        </div>
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(187, 134, 252, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(187, 134, 252, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
}
