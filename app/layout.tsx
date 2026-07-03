import type { Metadata } from 'next';
import { Space_Grotesk, Orbitron } from 'next/font/google';
import './[locale]/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});
const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'OpenCalisthenics',
  description: 'Aprende calistenia con nosotros y con nuestra comunidad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <body className={`${spaceGrotesk.variable} ${orbitron.variable} font-sans flex flex-col min-h-screen bg-background text-foreground`}>
        {children}
      </body>
    </html>
  );
}
