import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export const pinia = createPinia()
pinia.use(createPersistedState())
// export default pinia;

export function setupPinia(app: App) {
    app.use(pinia)
}