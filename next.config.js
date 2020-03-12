require("dotenv").config();

const withOffline = require("next-offline");

const nextConfig = {
  target: "serverless",
  env: {
    NAVER_MAP_API_KEY: process.env.NAVER_MAP_API_KEY
  },
  dontAutoRegisterSw: true,
  transformManifest: manifest => ["/"].concat(manifest), // add the homepage to the cache
  // Trying to set NODE_ENV=production when running yarn dev causes a build-time error so we
  // turn on the SW in dev mode so that we can actually test it
  generateInDevMode: true,
  workboxOpts: {
    swDest: "static/service-worker.js",
    runtimeCaching: [
      {
        urlPattern: /\.(?:gif|ico|jpg|jpeg|png|svg|webp)(?:\?|$)/,
        handler: "CacheFirst",
        options: {
          cacheName: "image-cache",
          expiration: {
            maxEntries: 500,
            maxAgeSeconds: 60 * 60 * 24 * 7
          }
        }
      },
      {
        urlPattern: /apigw/,
        handler: "NetworkFirst",
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              "x-test": "true"
            }
          }
        }
      }
    ]
  }
};

module.exports = withOffline(nextConfig);
