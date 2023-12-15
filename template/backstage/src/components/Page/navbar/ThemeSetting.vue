<template>
  <div>
    <el-tooltip effect="dark" content="主題" placement="bottom-end">
      <svg-icon
        name="setting"
        class="h-6 w-6 cursor-pointer duration-200 hover:scale-105 hover:text-hd-primary"
        @click="themeSettingDrawer = true"></svg-icon>
    </el-tooltip>
    <el-drawer v-model="themeSettingDrawer" title="Theme Setting" :with-header="false" :size="300">
      <div class="flex flex-col justify-center p-8 text-lg">
        <span class="m-auto mb-3">主題設定</span>
        <div class="my-5">
          <span class="text-hd-black1 mx-3">主題顏色</span>
          <el-color-picker
            v-model="themeColor"
            :predefine="themeColorList"
            @active-change="changeThemeColor" />
        </div>
        <div class="my-5">
          <span class="text-hd-black1 mx-3">背景顏色</span>
          <el-color-picker
            v-model="bgColor"
            :predefine="bgColorList"
            @active-change="changeBgColor" />
        </div>
        <div class="my-5">
          <span class="mx-3">麵包屑</span>
          <el-switch
            v-model="menuStore.isBreadcrumbCollapse"
            class="ml-2"
            active-text="開"
            inactive-text="關"
            @change="menuStore.toggleBreadcrumb"
            size="large" />
        </div>
        <div class="my-5">
          <span class="mx-3">歷史紀錄</span>
          <el-switch
            v-model="menuStore.isHistoryCollapse"
            class="ml-2"
            active-text="開"
            inactive-text="關"
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
// 主題設定
const themeSettingDrawer = ref<boolean>(false)
const themeColor = ref<string>(storage.get('themeColor') || '#bfccb5')
const bgColor = ref<string>(storage.get('bgColor') || '#F4F4F4')
const themeColorList = ref<string[]>(['#bfccb5'])
const bgColorList = ref<string[]>(['#F4F4F4'])
const el: HTMLElement = document.documentElement
const el1: HTMLElement = document.documentElement
const el2: HTMLElement = document.documentElement
const el3: HTMLElement = document.documentElement
getComputedStyle(el).getPropertyValue(`--hd-primary`)
el.style.setProperty('--hd-primary', themeColor.value)
getComputedStyle(el1).getPropertyValue(`--hd-primary-hover`)
el1.style.setProperty('--hd-primary-hover', themeColor.value + '95')
getComputedStyle(el2).getPropertyValue(`--el-color-primary`)
el2.style.setProperty('--el-color-primary', themeColor.value)
getComputedStyle(el3).getPropertyValue(`--hd-bg-1`)
el3.style.setProperty('--hd-bg-1', bgColor.value)

const changeThemeColor = (color: string): void => {
  storage.set('themeColor', color)
  el.style.setProperty('--hd-primary', color)
  el1.style.setProperty('--hd-primary-hover', color + '95')
  el2.style.setProperty('--el-color-primary', color)
}
const changeBgColor = (color: string): void => {
  storage.set('bgColor', color)
  el3.style.setProperty('--hd-bg-1', color)
}
</script>
