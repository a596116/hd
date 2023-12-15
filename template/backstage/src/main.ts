import { createApp } from 'vue'
import { setupPlugins } from './plugins'
import App from './App.vue'
import router, { setupRouter } from './router'


async function main() {
    const app = createApp(App)
    setupPlugins(app)
    setupRouter(app)

    await router.isReady()
    app.mount('#app')
}
main()

