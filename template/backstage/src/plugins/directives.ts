import type { App } from 'vue'
import VPermission from './directives/VPermission'

export function setupDirective(app: App) {
  app.directive(VPermission.name, VPermission)
}