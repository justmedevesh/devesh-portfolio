/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow images from ImgBB and other external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ibb.co' },
      { protocol: 'https', hostname: 'ibb.co' },
    ],
  },

  // Tell Next.js to keep Firebase packages server-external
  // This prevents the protobufjs/grpc bundling warning
  serverExternalPackages: ['firebase', '@firebase/firestore'],

  // Suppress the protobufjs dynamic require warning
  webpack: (config) => {
    config.ignoreWarnings = [
      { module: /node_modules\/@protobufjs\/inquire/ },
    ];
    return config;
  },
};

export default nextConfig;
