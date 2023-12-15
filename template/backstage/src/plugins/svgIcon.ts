import type { App } from 'vue'
import SvgIcon from '@/components/Global/SvgIcon.vue'
import 'virtual:svg-icons-register'


export function setupSvgIcon(app: App) {
    app.component('SvgIcon', SvgIcon)
}