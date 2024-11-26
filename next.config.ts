import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 데이터 URI를 허용
      },
    ],
  },
};

export default nextConfig;
