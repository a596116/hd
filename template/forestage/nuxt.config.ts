// https://nuxt.com/docs/api/configuration/nuxt-config
import { createRuntimeConfig, createViteConfig } from './build'

export default defineNuxtConfig({
  ssr: true,

  components: [
    {
      global: true,
      path: '~/components/',
      pathPrefix: false,
      extensions: ['.vue'],
    },
  ],

  telemetry: false,
  // modules
  modules: [
    '@element-plus/nuxt',
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    'nuxt-lodash',
    '@vueuse/nuxt',
    '@nuxt/image-edge',
    '@nuxtjs/robots',
  ],
  // sitemap: sitemap,

  // css
  css: ['~/assets/sass/tailwind.scss', 'animate.css/animate.min.css', '~/assets/sass/app.scss'],
  // app config
  app: {
    // global transition
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      meta: [
        { name: 'robots', content: 'index,follow' },
        { name: 'googlebot', content: 'index,follow' },
        // {
        //   name: 'google-site-verification',
        //   content: '',
        // },
        // { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        // {
        //   name: 'description',
        //   content: ``,
        // },
        // {
        //   name: 'keywords',
        //   content: ``,
        // },
        // { property: 'og:title', content: `` },
        // { property: 'og:description', content: `` },
        // { property: 'og:image', content: `` },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  robots: {
    rules: [
      {
        UserAgent: '*',
        Disallow: '/',
      },
    ],
  },

  // vite
  vite: createViteConfig(),

  runtimeConfig: createRuntimeConfig(),
})
