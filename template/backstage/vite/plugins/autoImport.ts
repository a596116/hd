import type { Plugin } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, VueUseComponentsResolver } from 'unplugin-vue-components/resolvers'

// 自動導入包，模塊
export const autoImport = (plugin: Plugin[]) => {
    plugin.push(
        AutoImport({
            resolvers: [ElementPlusResolver()],
            imports: ['vue', 'vue-router', 'pinia', '@vueuse/core',
                {
                    '@/utils': ['env', 'storage'],
                    '@/apis': ['api'],
                    '@/utils/messageBox': ['mesBox'],
                    '@/utils/notification': ['notification'],
                    // 'axios': [
                    //     // default imports
                    //     ['default', 'axios'], // import { default as axios } from 'axios',
                    // ],
                },

            ],
            // 為true時在項目根目錄自動創建
            dts: 'types/auto-imports.d.ts',
        }),
        Components({
            resolvers: [
                ElementPlusResolver(),
                VueUseComponentsResolver(),
            ],
            dirs: ['src/components'],
            // 指定類型聲明文件，為true時在項目根目錄創建
            dts: 'types/components.d.ts',
            // 组件的有效文件扩展名。
            extensions: ['vue'],

        }),
    )
}