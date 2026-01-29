'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Traducciones para la página 404
const translations = {
  es: {
    title: 'Página no encontrada',
    subtitle: 'Lo sentimos, la página que buscas no existe o ha sido movida.',
    backHome: 'Volver al inicio',
    explore: 'Explorar roadmaps',
  },
  en: {
    title: 'Page not found',
    subtitle: "Sorry, the page you're looking for doesn't exist or has been moved.",
    backHome: 'Back to home',
    explore: 'Explore roadmaps',
  },
} as const;

type Locale = keyof typeof translations;

export default function GlobalNotFound() {
  const pathname = usePathname();

  // Detectar locale desde la URL
  const pathLocale = pathname?.split('/')[1] as Locale;
  const locale: Locale = pathLocale && translations[pathLocale] ? pathLocale : 'es';
  const t = translations[locale];

  return (
    <html lang={locale}>
      <head>
        <title>404 - Calisteniapp</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700&family=Space+Grotesk:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          fontFamily: "'Space Grotesk', sans-serif",
          background: '#121212',
          color: '#ededed',
        }}
      >
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(187, 134, 252, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(50, 215, 75, 0.08) 0%, transparent 40%)
              `,
            }}
          />

          {/* 404 Text */}
          <h1
            style={{
              fontFamily: "'Orbitron', sans-serif",
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

          <div style={{ textAlign: 'center', maxWidth: '28rem', zIndex: 10 }}>
            <h2
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '1.5rem',
                fontWeight: 700,
                marginBottom: '1rem',
              }}
            >
              {t.title}
            </h2>
            <p style={{ color: 'rgba(237, 237, 237, 0.6)', marginBottom: '2rem' }}>
              {t.subtitle}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
              <Link
                href={`/${locale}`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  background: 'linear-gradient(135deg, #BB86FC 0%, #9D4EDD 100%)',
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                {t.backHome}
              </Link>

              <Link
                href={`/${locale}/roadmaps`}
                style={{
                  display: 'inline-block',
                  padding: '0.75rem 2rem',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  color: '#ededed',
                  fontWeight: 600,
                  borderRadius: '0.75rem',
                  textDecoration: 'none',
                }}
              >
                {t.explore}
              </Link>
            </div>
          </div>

          {/* Grid pattern */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: 0.03,
              backgroundImage: `
                linear-gradient(rgba(187, 134, 252, 0.5) 1px, transparent 1px),
                linear-gradient(90deg, rgba(187, 134, 252, 0.5) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
      </body>
    </html>
  );
}
