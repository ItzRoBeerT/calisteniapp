import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  images: {
    domains: ['nachogst.com', 'rjcaojecsabejmtnkidn.supabase.co', 'images.unsplash.com'],
  },
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
