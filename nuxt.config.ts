// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@tresjs/nuxt',
    '@nuxt/icon',
  ],

  css: ['~/assets/css/main.css'],

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-11-27',

  vite: {
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost'
      },
      watch: {
        usePolling: true,
        interval: 1000,
      },
    },
  },
})