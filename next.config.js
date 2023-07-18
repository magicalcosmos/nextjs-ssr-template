const envConfig = require('./configuration')
const { getPublicRuntimeConfig } = require('./configuration/util')
const { i18n } = require('./next-i18next.config')
const withBundleAnalyzer = require('@next/bundle-analyzer')

const mode = process.env.NEXT_APP_ENV
const analyze = process.env.ANALYZE === '1'

const env = getPublicRuntimeConfig(envConfig(mode))

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'build',


  env,

  // 运行时环境变量
  publicRuntimeConfig: env,

  // 多语言
  i18n,

  // webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false };

    return config;
  },

  // output:"standalone",
}

module.exports = analyze ? withBundleAnalyzer(nextConfig) : nextConfig