<template>
  <el-button
    v-permission="{ currentTag: 'create', effect: 'disabled' }"
    type="primary"
    auto-insert-space
    @click="emit('on-create')"
    class="font-normal">
    <svg-icon name="plus" class="w-4 h-4 mr-2"></svg-icon>
    新 增
  </el-button>
</template>
<script setup lang="ts">
const emit = defineEmits(['on-create'])
</script>
