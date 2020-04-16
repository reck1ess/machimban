require("dotenv").config();

const withOffline = require("next-offline");

const nextConfig = {
  target: "serverless",
  env: {
    KAKAO_MAP_API_KEY: process.env.KAKAO_MAP_API_KEY,
  },
  dontAutoRegisterSw: true,
  transformManifest: (manifest) => ["/"].concat(manifest),
  workboxOpts: {
    runtimeCaching: [
      {
        urlPattern: /\.(?:gif|ico|jpg|jpeg|png|svg|webp)(?:\?|$)/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 7,
          },
        },
      },
      {
        urlPattern: /apigw/,
        handler: "NetworkFirst",
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              "x-test": "true",
            },
          },
        },
      },
    ],
  },
};

module.exports = withOffline(nextConfig);
