import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { useAuthStore } from '@/stores/authStore'
import guard from './guard'
import autoImport from './autoImport'
import type { App } from 'vue'
import { CacheEnum } from '@/enum/cacheEnum'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return {
        selector: to.hash,
      }
    }
    return { top: 0 }
  },
})

export const setupRouter = async (app: App) => {
  autoImport(router)
  const token = storage.get(CacheEnum.TOKEN_NAME)
  if (token) {
    await useAuthStore().getUser()
  }
  guard(router)
  app.use(router)
}

export default router
