<template>
  <div>
    <el-tooltip effect="dark" content="全螢幕" placement="bottom-end">
      <div
        @click="fullScreen"
        class="hover:text-hd-primary hidden cursor-pointer duration-200 hover:scale-105 md:block">
        <svg-icon name="full-exit" v-if="isFullScreen" class="h-8 w-8"></svg-icon>
        <svg-icon name="full" v-else class="h-8 w-8"></svg-icon>
      </div>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
const isFullScreen = ref<boolean>(false)
const fullScreen = () => {
  isFullScreen.value ? document.exitFullscreen() : document.documentElement.requestFullscreen()
  isFullScreen.value = !isFullScreen.value
}
</script>
