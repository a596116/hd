<template>
  <el-tag round :color="formatColor" :class="formatStatusClass">
    <p v-if="isEmpty(title)" class="px-4 text-white">
      {{ status == 0 ? '停用' : '啟用' }}
    </p>

    <p v-else class="text-white">{{ title }}</p>
  </el-tag>
</template>
<script setup lang="ts">
import { isEmpty } from 'lodash-es'

const props = defineProps({
  status: { type: [Number, String], default: '' },
  title: { type: String, default: '' },
})

const formatColor = computed(() => {
  const colorMap: any = {
    0: '#F36666',
    1: '#48B981',
    2: '#ffcf73',
  }
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
