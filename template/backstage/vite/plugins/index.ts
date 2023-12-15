import vue from '@vitejs/plugin-vue'
import type { Plugin } from 'vite'
import visualizer from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import path from 'path'
import { autoImport } from './autoImport'

export const setupPlugins = () => {

    const plugins: Plugin[] = [
        vue(),
        visualizer(),
        createSvgIconsPlugin({
            iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        }),
    ]
    autoImport(plugins)
    return plugins
}
