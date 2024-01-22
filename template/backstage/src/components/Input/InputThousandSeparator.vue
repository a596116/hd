<template>
  <div>
    <el-input
      v-show="state.isFocus"
      ref="oldValue"
      v-model="state.oldValue"
      :disabled="disabled"
      @blur="blur"
      @input="input"></el-input>

    <el-input
      v-show="!state.isFocus"
      v-model="state.formatValue"
      :disabled="disabled"
      @focus="focus"></el-input>
  </div>
</template>

<script setup lang="ts">
import { InputInstance } from 'element-plus'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    value: any
    disabled?: boolean
    onlyPositiveNumber?: boolean
  }>(),
  {
    value: null,
    disabled: false,
    onlyPositiveNumber: true,
  },
)

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-sum', value: string): void
  (e: 'update:value', value: string): void
}>()

const oldValue = ref<InputInstance>()
const state = reactive({
  isFocus: false, // 是否处于获取焦点状态
  formatValue: '',
  oldValue: props.value,
})
// ----------- watch -----------
watch(
  () => state.oldValue,
  (newV, oldV) => {
    state.formatValue = isNaN(Number(state.oldValue))
      ? state.oldValue
      : Number(state.oldValue).toLocaleString(undefined, {
          maximumFractionDigits: 10,
        })
  },
  { immediate: true },
),
  watch(
    () => props.value,
    (newV, oldV) => {
      state.oldValue = props.value
    },
  )

// 失去焦点
const blur = (e) => {
  state.isFocus = false
  if (isNaN(Number(state.oldValue))) {
    state.oldValue = '0'
    emit('update:value', state.oldValue)
    emit('on-sum', state.oldValue)
  }
}

// 获取焦点
const focus = async (e) => {
  state.isFocus = true
  await nextTick()
  oldValue.value.focus()
}

const input = (v) => {
  const regex = props.onlyPositiveNumber ? /[^\d^\.]/g : /[^-?\d^\.]/g
  state.oldValue = state.oldValue.replace(regex, '')
  state.oldValue = state.oldValue.replace(/^\./g, '')
  state.oldValue = state.oldValue.replace(/\.{2,}/g, '.')
  state.oldValue = state.oldValue.replace(/^(-)|-+/g, '$1')
  state.oldValue = state.oldValue.replace('-.', '-0.')
  state.oldValue = state.oldValue.replace(/^00+/, '')
  state.oldValue = state.oldValue.replace(/^-00+/, '-0.')
  state.oldValue = state.oldValue.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
  emit('update:value', state.oldValue)
  emit('on-sum', state.oldValue)
}
</script>
