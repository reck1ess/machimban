require('dotenv').config()
const withPWA = require("next-pwa");

module.exports = withPWA({
  env: {
    NAVER_MAP_API_KEY: process.env.NAVER_MAP_API_KEY,
  },
  pwa: {
    dest: "public"
  }
});
