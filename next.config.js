 /** @type {import('next').NextConfig} */ const nextConfig = { async redirects() { return [ { source: '/', destination: '/ver', permanent: false, }, ]; }, }; module.exports = nextConfig;
