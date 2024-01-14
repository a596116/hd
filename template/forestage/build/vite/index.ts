import { useEnv } from '../env'
import { createVitePlugins } from './plugins'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import type { NuxtConfig } from 'nuxt/schema'

export const createViteConfig = (): NuxtConfig['vite'] => {
  const { viteEnv } = useEnv()
  return {
    plugins: [
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'assets/svg')],
      }),
      createVitePlugins(viteEnv),
    ],
  }
}
