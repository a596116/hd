<template>
  <el-tooltip effect="dark" content="預覽" placement="top">
    <el-button
      v-if="!disabled"
      class="button-tip border-primary text-primary flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-30">
      <a :href="`https://${url}`" target="_blank">
        <svg-icon name="eye" class="text-primary"></svg-icon
      ></a>
    </el-button>
    <el-button
      v-else
      disabled
      text
      class="button-tip border-primary text-primary flex h-[26px] w-[26px] cursor-pointer items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-30">
      <svg-icon name="eye" class="text-primary"></svg-icon>
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>
