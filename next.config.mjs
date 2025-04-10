process.env.TF_CPP_MIN_LOG_LEVEL = "2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        "@mapbox/node-pre-gyp",
        "@tensorflow/tfjs-node",
      ];
    }

    // Add a rule to handle HTML files
    config.module.rules.push({
      test: /\.html$/,
      use: [
        {
          loader: "html-loader",
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
