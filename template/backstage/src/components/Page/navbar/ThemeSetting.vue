<template>
  <div>
    <slot name="title" />
    <el-tooltip v-if="!isDropdown" effect="dark" content="主題" placement="bottom-end">
      <svg-icon
        name="setting"
        class="h-6 w-6 cursor-pointer duration-200 hover:scale-105 hover:text-hd-primary"
        @click="themeSettingDrawer = true"></svg-icon>
    </el-tooltip>
    <el-dropdown-item
      v-else
      class="text-hd-dark hover:!text-hd-dark-50"
      @click="themeSettingDrawer = true">
      <svg-icon name="setting" class="mr-2"></svg-icon>
      主題設定
    </el-dropdown-item>
    <el-drawer
      v-model="themeSettingDrawer"
      title="Theme Setting"
      :with-header="false"
      :size="300"
      append-to-body>
      <div class="flex flex-col justify-center p-8 text-lg text-hd-dark">
        <span class="m-auto mb-3">介面設定</span>
        <div class="my-5">
          <span class="mx-3">黑暗模式</span>
          <el-switch v-model="isDark" class="ml-2" @change="toggleDark" size="large" />
        </div>
        <div class="my-5">
          <span class="mx-3">主題顏色</span>
          <el-color-picker
            v-model="themeColor"
            :predefine="themeColorList"
            @change="changeThemeColor" />
        </div>
        <div class="my-5">
          <span class="mx-3">標籤欄</span>
          <el-switch
            v-model="menuStore.isHistoryCollapse"
            class="ml-2"
            @change="menuStore.toggleHistoryLink"
            size="large" />
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()

const props = withDefaults(
  defineProps<{
    isDropdown?: boolean
  }>(),
  {
    isDropdown: false,
  },
)
// 主題設定
const defaultThemeColor = '#289983'
const themeSettingDrawer = ref<boolean>(false)
const el: HTMLElement = document.documentElement
const el1: HTMLElement = document.documentElement
const el2: HTMLElement = document.documentElement
const el3: HTMLElement = document.documentElement
const isDark = useDark({
  initialValue: 'light',
  valueDark: 'dark',
  valueLight: 'light',
})
const toggleDark = useToggle(isDark)
const themeColor = ref<string>(
  storage.get('themeColor') || getComputedStyle(el).getPropertyValue(`--hd-primary`),
)
const themeColorList = ref<string[]>([defaultThemeColor])
getComputedStyle(el).getPropertyValue(`--hd-primary`)
el.style.setProperty('--hd-primary', themeColor.value)
getComputedStyle(el1).getPropertyValue(`--hd-primary-hover`)
el1.style.setProperty('--hd-primary-hover', themeColor.value + '95')
getComputedStyle(el2).getPropertyValue(`--el-color-primary`)
el2.style.setProperty('--el-color-primary', themeColor.value)
getComputedStyle(el3).getPropertyValue(`--hd-primary-active`)
el3.style.setProperty('--hd-primary-active', themeColor.value + '75')
// 黑暗模式
const changeThemeColor = (color: string): void => {
  if (!color) {
    themeColor.value = defaultThemeColor
    color = defaultThemeColor
  }
  storage.set('themeColor', color || defaultThemeColor)
  el.style.setProperty('--hd-primary', color || defaultThemeColor)
  el1.style.setProperty('--hd-primary-hover', color || defaultThemeColor + '95')
  el2.style.setProperty('--el-color-primary', color || defaultThemeColor)
  el3.style.setProperty('--hd-primary-active', color || defaultThemeColor + '75')
}
</script>
