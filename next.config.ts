import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['*.supabase.co'], // Permite imágenes desde Supabase Storage
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.vercel.app'],
    },
  },
  // Configuración para PWA (opcional, pero la dejamos preparada)
  // pwa: {
  //   dest: 'public',
  //   register: true,
  //   skipWaiting: true,
  // },
};

// Si quieres integrar Sentry, descomenta esto:
// import { withSentryConfig } from '@sentry/nextjs';
// export default withSentryConfig(nextConfig, {
//   org: "tu-org",
//   project: "tu-proyecto",
//   silent: true,
// });

export default nextConfig;