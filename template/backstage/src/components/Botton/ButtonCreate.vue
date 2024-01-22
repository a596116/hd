<template>
  <el-button
    type="primary"
    auto-insert-space
    @click="emit('on-create')"
    class="border-0 font-normal">
    <svg-icon name="plus" class="mr-2 h-4 w-4"></svg-icon>
    新 增
  </el-button>
</template>
<script setup lang="ts">
const emit = defineEmits<{
  (e: 'on-create'): void
}>()
</script>
