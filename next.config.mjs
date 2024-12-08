process.env.TF_CPP_MIN_LOG_LEVEL = "2";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["pdf2json"],
  },
  images: {
    domains: ["images.unsplash.com", "github.com", "lh3.googleusercontent.com"],
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
