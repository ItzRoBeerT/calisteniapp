import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
  // TODO: - Cambiar esto para cuando tengamos imagenes
  images: {
    domains: ['nachogst.com', 'rjcaojecsabejmtnkidn.supabase.co'],
  },
  /* config options here */
}

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
