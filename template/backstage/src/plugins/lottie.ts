import type { App } from 'vue'
import Vue3Lottie from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

export function setupLottie(app: App) {
    app.use(Vue3Lottie, { name: 'Vue3Lottie' })
}