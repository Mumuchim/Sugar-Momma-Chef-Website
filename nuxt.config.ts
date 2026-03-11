// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
  ],

  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/confirm',
      exclude: ['/', '/recipes/*', '/collections', '/classes', '/contact', '/collections/*'],
    },
  },

  app: {
    head: {
      title: 'Sugar Momma — Premium Pastry & Fine Dining',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Premium pastry collections, custom orders, and cooking classes by Head Executive Chef specializing in Japanese fine-dining pastries.',
        },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500&display=swap',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },

  runtimeConfig: {
    paymongoSecretKey: process.env.PAYMONGO_SECRET_KEY,
    paymongoWebhookSecret: process.env.PAYMONGO_WEBHOOK_SECRET,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      paymongoPublicKey: process.env.NUXT_PUBLIC_PAYMONGO_PUBLIC_KEY,
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_KEY,
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },

  css: ['~/assets/css/main.css'],

  tailwindcss: {
    configPath: '~/tailwind.config.ts',
  },
})
