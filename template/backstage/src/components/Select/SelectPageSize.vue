<template>
  <el-select
    v-model="selected"
    class="max-w-[120px]"
    size="small"
    :class="isVisible ? 'visible' : 'invisible'"
    @change="emit('on-change')">
    <template #prefix>每頁</template>
    <el-option
      v-for="option in options"
      :key="option.label"
      :label="option.label"
      :value="option.value">
    </el-option>
  </el-select>
</template>
<script setup lang="ts">
// ----------- props ----------
const props = withDefaults(
  defineProps<{
    total: number
  }>(),
  {
    total: 0,
  },
)

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-change'): void
}>()

// ----------- computed ----------
const selected = defineModel('take', { required: true, default: 20 })

/*
 * @description: 是否顯示
 */
const isVisible = computed(() => {
  return props.total >= 10
})

const options = [
  { label: '10 筆', value: 10 },
  { label: '20 筆', value: 20 },
  { label: '30 筆', value: 30 },
  { label: '50 筆', value: 50 },
  { label: '100 筆', value: 100 },
  { label: '200 筆', value: 200 },
  { label: '300 筆', value: 300 },
]
</script>
