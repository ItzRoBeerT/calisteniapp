import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'huggingface.co',
        pathname: '/buckets/RafaelJaime/OpenCalisthenics/**',
      },
      {
        // Profile pic
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
