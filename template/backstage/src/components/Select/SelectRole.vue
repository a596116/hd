<template>
  <el-select
    v-model="model"
    placeholder="選擇權限功能"
    multiple
    class="custom-input-bg-style w-full"
    :disabled="canEdit">
    <el-option
      v-for="item in state.selectOptions"
      :key="item.value"
      :label="item.label"
      :value="item.value" />
  </el-select>
</template>

<script setup lang="ts">
// ----------- props -----------
const props = withDefaults(
  defineProps<{
    canEdit: boolean
  }>(),
  {
    canEdit: false,
  },
)

const model = defineModel<string[]>('modelValue', { required: true, default: () => [] })

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
