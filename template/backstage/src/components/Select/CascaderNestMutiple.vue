<template>
  <div class="w-full">
    <h5 class="text-xs leading-6 tracking-widest text-custom-gray">
      {{ labelText }}
    </h5>
    <el-cascader
      ref="refCascader"
      v-model="selected"
      :options="isSearch ? options : actions.handleFormatLevelOptions(options)"
      :props="state.props"
      :placeholder="placeholder"
      :teleported="false"
      filterable
      :clearable="showClearable"
      :default-first-option="true"
      :show-all-levels="showAllLevels"
      popper-class="categoryCascader"
      :disabled="disabled"
      :size="(size as any)"
      class="w-full"
      @change="actions.handleChange">
    </el-cascader>
  </div>
</template>
<script setup lang="ts">
// ----------- props -----------
const props = defineProps({
  checkStrictly: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: Array,
    default: [],
  },
  options: {
    type: Array,
    default: () => [],
  },
  placeholder: { type: String, default: '' },
  disabled: {
    type: Boolean,
    default: false,
  },
  showClearable: {
    type: Boolean,
    default: true,
  },
  showAllLevels: {
    type: Boolean,
    default: true,
  },
  labelText: { type: String, default: '' },
  size: { type: String, default: 'default' },
  children: { type: String, default: 'sub' },
  isSearch: { type: Boolean, default: false },
})
// ----------- emit -----------
const emit = defineEmits(['on-change', 'update:modelValue'])
const refCascader = ref<any>()
const state = ref({
  props: {
    multiple: true,
    value: 'id',
    label: 'name',
    children: props.children,
    expandTrigger: 'hover',
    checkStrictly: props.checkStrictly,
  },
})
// ----------- computed ----------
const selected = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  },
})
const actions = {
  handleClear: () => {
    selected.value = []
    refCascader.value.handleClear()
  },
  handleChange: (id) => {
    const params = id.map((item) => {
      return item[item.length - 1]
    })
    emit('on-change', params)
  },
  handleFormatLevelOptions: (val) => {
    const subKey = props.children
    val &&
      val.forEach((level) => {
        level.disabled = level.status == 0
        if (level[subKey]) {
          actions.handleFormatLevelOptions(level[subKey])
        }
      })
    return val
  },
}
</script>

<style lang="scss">
.categoryCascader {
  .el-cascader-menu {
    .el-radio,
    .el-checkbox {
      position: absolute;
      display: table;
      box-sizing: border-box;
      margin-left: -20px;
      padding-left: 10px;
      width: 40%;
      height: 100%;
      vertical-align: middle;
    }

    .el-radio__inner {
      display: none;
    }
  }
}
</style>
