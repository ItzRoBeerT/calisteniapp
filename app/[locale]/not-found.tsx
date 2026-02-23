import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Space_Grotesk } from 'next/font/google';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
});

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div
      className="min-h-[calc(100vh-104px)] flex flex-col items-center justify-center p-4 relative overflow-hidden -my-4"
      style={{
        width: '100vw',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
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
        className={spaceGrotesk.className}
        style={{
          fontSize: 'clamp(8rem, 20vw, 16rem)',
          fontWeight: 700,
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
            href="/"
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
