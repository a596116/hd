<template>
  <div class="relative w-full">
    <el-input
      :disabled="!canEdit"
      readonly
      class="custom-input-bg-style underline decoration-[#a8abb2] underline-offset-2"
      :class="{
        'decoration-[#252525]': !isEmpty(value) && canEdit,
        ' link-input custom-cursor-pointer  no-underline': !canEdit && !isEmpty(value),
        'no-underline': isEmpty(value) && !canEdit,
        'custom-cursor-pointer': canEdit,
      }"
      :value="value"
      :placeholder="canEdit ? `請選擇${label}` : ''"
      @click="emit('on-submit')">
      <template #suffix>
        <el-icon
          v-show="canEdit && !!value && showClear"
          class="cursor-pointer"
          @click="emit('on-clear')"
          ><CircleClose
        /></el-icon>
      </template>
    </el-input>
    <Anchor
      v-if="!canEdit"
      class="absolute left-0 top-0 z-10 h-full w-full cursor-pointer"
      :to="handlePreviewLink" />
  </div>
</template>

<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { CircleClose } from '@element-plus/icons-vue'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    label: string
    canEdit: boolean
    type: string
    id: string | number
    value: string
    showClear?: boolean
  }>(),
  {
    label: '',
    canEdit: false,
    type: '',
    id: '',
    value: '',
    showClear: false,
  },
)
// ----------- emit -----------
const emit = defineEmits(['on-submit', 'on-clear'])

const SystemMap: any = {}

const handlePreviewLink = computed(() => {
  if (!props.id) return
  let result = {}
  if (props.canEdit) return
  if (Object.keys(SystemMap).includes(props.type)) {
    result = {
      path: `/${SystemMap[props.type]}/${props.id}`,
    }
  } else {
    result = { path: `/${props.type}/${props.id}` }
  }
  return result
})
</script>
