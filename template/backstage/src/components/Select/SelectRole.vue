<template>
  <el-select
    v-model="model"
    placeholder="選擇權限功能"
    multiple
    class="w-full custom-input-bg-style"
    :disabled="canEdit">
    <el-option
      v-for="item in state.selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: { type: Array, default: [] },
  canEdit: { type: Boolean, default: false },
})
const emit = defineEmits(['update:modelValue'])

const model = useVModel(props, 'modelValue', emit)

const state = reactive({
  selectOptions: [
    {
      value: 'create',
      label: '新增',
    },
    {
      value: 'edit',
      label: '修改',
    },
    {
      value: 'delete',
      label: '刪除',
    },
    {
      value: 'view',
      label: '查看',
    },
  ],
})
</script>

<style scoped></style>
