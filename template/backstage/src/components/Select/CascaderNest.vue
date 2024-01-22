<template>
  <div>
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
      :size="size"
      @change="actions.handleChange">
    </el-cascader>
  </div>
</template>
<script setup lang="ts">
// ----------- props -----------
const props = withDefaults(
  defineProps<{
    checkStrictly?: boolean
    options?: any[]
    placeholder?: string
    disabled?: boolean
    showClearable?: boolean
    showAllLevels?: boolean
    labelText?: string
    size?: string
    children?: string
    isSearch?: boolean
  }>(),
  {
    checkStrictly: true,
    options: () => [],
    placeholder: '',
    disabled: false,
    showClearable: true,
    showAllLevels: true,
    labelText: '',
    size: 'default',
    children: 'sub',
    isSearch: false,
  },
)
// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-change', value: any): void
}>()

// ----------- computed ----------
const selected = defineModel()

const refCascader = ref(null)
const state = ref({
  props: {
    value: 'id',
    label: 'name',
    children: props.children,
    expandTrigger: 'hover',
    checkStrictly: props.checkStrictly,
  },
})

// ----------- actions ----------
const actions = {
  handleClear: () => {
    selected.value = ''
    refCascader.value.handleClear()
  },
  handleChange: (id: number) => {
    let params = {
      label: '',
      value: id,
    }
    if (refCascader.value.getCheckedNodes()[0]) {
      let labels = refCascader.value.getCheckedNodes()[0].pathLabels
      params.label = labels.length > 0 ? labels[labels.length - 1] : null
    }
    refCascader.value.popperVisible = false
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
      width: 90%;
      height: 100%;
      vertical-align: middle;
    }

    .el-radio__inner {
      display: none;
    }
  }
}
</style>
