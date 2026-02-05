import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'nachogst.com',
      },
      {
        protocol: 'https',
        hostname: 'rjcaojecsabejmtnkidn.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
