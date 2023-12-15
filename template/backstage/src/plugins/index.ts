import type { App } from 'vue'
import { setupPinia } from '../plugins/pinia'
import { setupSvgIcon } from './svgIcon'
import './tailwindcss/tailwindcss.css'
import 'animate.css'
import { setupLottie } from './lottie'
import { setupDirective } from './directives'


export const setupPlugins = (app: App) => {
    setupPinia(app)
    setupSvgIcon(app)
    setupLottie(app)
    setupDirective(app)
}

