import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/sigs/:path*', // 클라이언트에서 요청하는 경로
        destination: 'https://sgisapi.kostat.go.kr/:path*', // 실제 API 요청을 보낼 URL
      },
      {
<<<<<<< HEAD
<<<<<<< HEAD
        source: "/backend/:path*", // Local API
        destination: "https://12b5-211-202-41-148.ngrok-free.app/:path*",
=======
        source: '/backend/:path*', // Local API
        destination: 'https://ac8c-175-195-104-144.ngrok-free.app/:path*',
>>>>>>> fa41a116f9e6696389fac88f33a5de84548e9324
=======
        source: "/backend/:path*", // Local API
        destination: "https://go-gym.site/:path*",
>>>>>>> 4ce8fb501e0ef05067335ae0b6e2d73a1fa5784f
      },
      {
        source: '/chat/:path*', // Local API
        destination: 'https://f98c-1-240-3-56.ngrok-free.app/:path*',
      },
    ];
  },
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
