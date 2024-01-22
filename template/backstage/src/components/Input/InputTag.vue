<template>
  <div
    class="input-tag draggable w-full cursor-text rounded-lg border p-1"
    @click="handleClickInput">
    <div ref="draggableTagRef" class="draggable-tag flex">
      <el-tag
        v-for="tag in propsValues"
        :key="tag"
        class="mx-1 w-auto cursor-pointer"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)">
        {{ tag }}
      </el-tag>
    </div>
    <el-input
      ref="InputRef"
      v-model="state.input"
      class="ml-1 w-full"
      placeholder="點此輸入選項"
      size="small"
      :disabled="canEdit"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm" />
  </div>
</template>

<script setup lang="ts">
import { ElMessage, type ElInput } from 'element-plus'
import Sortable from 'sortablejs'

const props = defineProps<{
  canEdit: boolean
}>()

const emit = defineEmits(['on-change'])
const state = reactive({
  input: '',
})

const InputRef = ref<InstanceType<typeof ElInput>>()
const draggableTagRef = ref<HTMLElement>()

const propsValues = defineModel({ required: true, default: () => [] })

onMounted(() => {
  // let tbody = document.querySelector('.draggable .draggable-tag')
  const conf = {
    animation: 150, // ms, number 单位：ms，定义排序动画的时间
    onStart: function (e: any) {
      propsValues.value.push('')
      nextTick(() => {
        const elTags = draggableTagRef.value?.querySelector('.el-tag:last-child')
        elTags?.classList.add('hidden')
      })
    },
    onEnd({ newIndex, oldIndex }: any) {
      const currentRow = propsValues.value.splice(oldIndex, 1)[0]
      propsValues.value.splice(newIndex, 0, currentRow)
      propsValues.value.pop()
    },
  }
  Sortable.create(draggableTagRef.value!, conf)
})

const handleClickInput = () => {
  nextTick(() => {
    InputRef.value!.input!.focus()
  })
}
const handleClose = (tag: string) => {
  if (props.canEdit) return
  propsValues.value.splice(propsValues.value.indexOf(tag), 1)
  emit('on-change')
}

const handleInputConfirm = () => {
  if (propsValues.value.indexOf(state.input) !== -1) {
    ElMessage({
      message: '此選項已存在',
      type: 'error',
    })
    return
  }
  if (state.input) {
    propsValues.value.push(state.input)
    emit('on-change')
  }
  state.input = ''
}
</script>

<style scoped lang="scss">
.input-tag {
  :deep(.el-input__wrapper) {
    @apply bg-transparent;
    box-shadow: none !important;
    &:hover,
    &.is-focus {
      box-shadow: none;
    }
  }
}
</style>
