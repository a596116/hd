<template>
  <section class="flex items-center gap-x-3">
    <div class="min-w-[240px]">
      <h5 class="text-xs leading-6 tracking-widest text-gray-500">關鍵字搜尋</h5>
      <el-input
        v-model="propsFormData.q"
        :placeholder="searchKeyword"
        size="default"
        clearable
        @input="actions.handleAutoSearch">
      </el-input>
    </div>
    <slot name="date"></slot>
  </section>
</template>

<script setup lang="ts">
import { debounce } from 'lodash-es'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    searchKeyword: string
  }>(),
  {
    searchKeyword: '請輸入名稱',
  },
)

// ----------- emit -----------
const emit = defineEmits(['on-change'])
// ----------- computed ----------
const propsFormData = defineModel<any>('modelValue', { required: true, default: () => {} })

// ----------- actions ----------
const actions = {
  // 搜尋
  handleSearch: () => {
    emit('on-change')
  },
  // 自動搜尋 - 關鍵字
  handleAutoSearch: debounce(function (query) {
    actions.handleSearch()
  }, 200),
}
</script>
