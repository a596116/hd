<template>
  <!-- <el-tooltip v-if="!isEmpty(content)" effect="dark" :content="content" placement="top">
    <button
      :size="size || defaultSize"
      :loading="loading"
      :disabled="disabled"
      class="flex h-[24px] w-[24px] items-center justify-center rounded-full text-hd-primary hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
      :class="{
        'text-red-300': tag === 'delete',
      }"
      @click="emit('on-submit')">
      <svg-icon :name="icon" class="h-[24px] w-[24px]"></svg-icon>
    </button>
  </el-tooltip>
  <div v-else>
    <button
      :size="size || defaultSize"
      :loading="loading"
      :disabled="disabled"
      class="flex h-[24px] w-[24px] items-center justify-center rounded-full text-hd-primary hover:opacity-60 disabled:cursor-not-allowed disabled:opacity-30"
      :class="{
        'text-hd-danger': tag === 'delete',
      }"
      @click="emit('on-submit')">
      <svg-icon :name="icon" class="h-[24px] w-[24px]"></svg-icon>
    </button>
  </div> -->

  <el-button
    :size="size || defaultSize"
    :loading="loading"
    :disabled="disabled"
    text
    bg
    class="animation my-2 flex items-center justify-center bg-hd-bg disabled:cursor-not-allowed disabled:opacity-30"
    :class="{
      'text-hd-danger': tag === 'delete',
      'text-hd-primary': tag !== 'delete',
    }"
    @click="emit('on-submit')">
    <span>{{ content }}</span>
  </el-button>
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash-es'

const emit = defineEmits<{
  (e: 'on-submit'): void
}>()
const props = withDefaults(
  defineProps<{
    type: keyof typeof buttonMap
    size?: '' | 'default' | 'small' | 'large'
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    type: 'edit',
    size: 'small',
    loading: false,
    disabled: false,
  },
)
const buttonMap = {
  print: {
    content: '列印',
    tag: 'print',
    defaultSize: 'small',
    icon: 'printer',
  },
  import: {
    content: '導入',
    tag: 'import',
    defaultSize: 'default',
    icon: 'upload',
  },
  export: {
    content: '導出',
    tag: 'download',
    defaultSize: 'small',
    icon: 'download',
  },
  edit: {
    content: '編輯',
    tag: 'edit',
    defaultSize: 'small',
    icon: 'edit',
  },
  delete: {
    content: '刪除',
    tag: 'delete',
    defaultSize: 'small',
    icon: 'delete',
  },
} as {
  [key: string]: {
    content: string
    tag: string
    defaultSize: '' | 'default' | 'small' | 'large'
    icon: string
  }
}
const { content, tag, defaultSize, icon } = buttonMap[props.type]
</script>
