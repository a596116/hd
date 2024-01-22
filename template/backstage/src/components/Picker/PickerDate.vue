<template>
  <div class="w-full">
    <h5 class="text-xs leading-6 tracking-widest text-gray-500">
      {{ labelText }}
    </h5>
    <el-date-picker
      ref="refDatePicker"
      v-model="propDate"
      :disabled-date="actions.disabledDate"
      :shortcuts="
        shortcutOptions || shortcut
          ? shortcut == 'before'
            ? state.before_shortcuts
            : state.after_shortcuts
          : []
      "
      :clearable="true"
      :disabled="disabled"
      type="date"
      class="w-full"
      value-format="YYYY-MM-DD"
      :placeholder="disabled ? null : `請選擇${labelText || '日期'}`"
      @change="actions.handleChange">
    </el-date-picker>
  </div>
</template>

<script setup lang="ts">
import { useAfterTimeShortcuts, useBeforeTimeShortcuts } from '@/utils/useTimeShortcuts'
import { dayjs } from 'element-plus'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    labelText?: string
    isSelectBefore?: boolean
    disabled?: boolean
    noRange?: boolean
    shortcut?: 'before' | 'after'
    shortcutOptions?: any[]
    minDate?: string | Date
  }>(),
  {
    labelText: '',
    isSelectBefore: true,
    disabled: false,
    noRange: false,
    minDate: '',
  },
)

// ----------- emit ----------
const emit = defineEmits<{
  (e: 'date-change', value: string | Date): void
}>()

const refDatePicker = ref(null)
const state = ref({
  before_shortcuts: useBeforeTimeShortcuts(),
  after_shortcuts: useAfterTimeShortcuts(),
})

// ----------- computed ----------
const propDate = defineModel('date', { required: true, default: '' })

// ----------- actions ----------
const actions = {
  handleChange: (val: Date) => {
    const date = !!val ? dayjs(val).format('YYYY-MM-DD') : null
    emit('date-change', date)
  },
  disabledDate: (time: Date) => {
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
