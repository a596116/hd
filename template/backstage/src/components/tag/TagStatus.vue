<template>
  <el-tag
    effect="plain"
    :style="{
      color: formatColor,
      borderColor: formatColor,
    }">
    <p v-if="isEmpty(title)" class="px-4">
      {{ status == 0 ? '停用' : '啟用' }}
    </p>

    <p v-else class="">{{ title }}</p>
  </el-tag>
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash-es'

// ----------- props -----------
const props = defineProps<{
  status?: keyof typeof colorMap
  title?: keyof typeof colorMap
}>()

const colorMap = {
  0: '#F36666',
  1: '#4DAAFF',
  2: '#ffcf73',
  男: '#4DAAFF',
  女: '#fd79a8',
}
const formatColor = computed(() => {
  return colorMap[props.status] || colorMap[props.title]
})

const formatStatusClass = computed(() => {
  const statusClassMap: any = {
    0: 'custom-tag--alert',
    1: 'custom-tag--finish',
    2: 'custom-tag--process',
  }
  return statusClassMap[props.status]
})
</script>
