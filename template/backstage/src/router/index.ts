import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import autoImport from './autoImport'
import guard from './guard'
import { routes } from './routes'
import type { App } from 'vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export const setupRouter = async (app: App) => {
  // await useAuthStore().getUser()

  autoImport(router)
  guard(router)
  app.use(router)
}


export default router
