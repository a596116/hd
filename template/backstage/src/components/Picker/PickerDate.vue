<template>
  <div class="w-full lg:w-fit">
    <h5 class="text-xs leading-6 tracking-widest text-gray-500">
      {{ labelText }}
    </h5>
    <el-date-picker
      ref="refDatePicker"
      v-model="propDate"
      :disabled-date="disabledDate"
      :shortcuts="shortcutOptions || state.after_shortcuts"
      :clearable="true"
      :disabled="disabled"
      type="date"
      class="w-full-date"
      value-format="YYYY-MM-DD"
      :placeholder="disabled ? null : `請選擇${labelText || '日期'}`"
      @change="actions.handleChange">
    </el-date-picker>
  </div>
</template>

<script setup lang="ts">
import useBeforeTimeShortcuts from '@/utils/useBeforeTimeShortcuts'
import useAfterTimeShortcuts from '@/utils/useAfterTimeShortcuts'
import { dayjs } from 'element-plus'

// ----------- props -----------
const props = defineProps({
  labelText: { type: String, default: '' },
  date: { type: [String, Date, undefined] },
  isSelectBefore: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  noRange: { type: Boolean, default: false },
  shortcutOptions: { type: Array, default: () => [] },
  minDate: { type: [String, Date] },
})
const emit = defineEmits(['update:date', 'date-change'])
const refDatePicker = ref(null)
const state = ref({
  before_shortcuts: useBeforeTimeShortcuts(),
  after_shortcuts: useAfterTimeShortcuts(),
})

// ----------- computed ----------
const propDate = computed({
  get: () => props.date,
  set: (val) => {
    emit('update:date', val)
  },
})
const disabledDate = (time: Date) => {
  if (props.noRange) return
  if (!!props.minDate) {
    const formatDate = dayjs(time).format('YYYY-MM-DD')
    const formatMinDate = dayjs(props.minDate).format('YYYY-MM-DD')
    return formatDate < formatMinDate
  }
  const date = new Date()
  if (props.isSelectBefore) {
    return time.getTime() > Date.now()
  } else {
    return time.getTime() < date.setTime(date.getTime() - 3600 * 1000 * 24)
  }
}

const actions = {
  handleChange: (val: Date) => {
    const date = !!val ? dayjs(val).format('YYYY-MM-DD') : null
    emit('date-change', date)
  },
}
</script>

<style lang="scss" scoped>
.el-picker-panel__footer {
  button:nth-child(1) {
    display: none;
  }
}
</style>
