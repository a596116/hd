<template>
  <footer class="z-10 w-full bg-hd-bg-1 py-3">
    <div class="flex items-center justify-end">
      <div v-if="!canEdit" class="flex items-center justify-end gap-x-3 px-2">
        <slot name="actions"></slot>
      </div>

      <div class="flex w-full flex-grow items-center justify-end gap-x-3 px-4">
        <slot name="button"></slot>
        <el-button
          v-show="!isSinglePage || (!isSinglePage && canEdit)"
          v-loading="useCommonStore().loading"
          :disabled="useCommonStore().loading"
          size="default"
          class="w-2/3 overflow-hidden md:max-w-[100px] lg:w-2/5"
          auto-insert-space
          @click="actions.handleGoBack">
          {{ cancelText }}
        </el-button>
        <el-button
          v-if="canEdit"
          v-loading="useCommonStore().loading"
          :disabled="useCommonStore().loading"
          type="primary"
          size="default"
          class="w-2/3 overflow-hidden md:max-w-[100px] lg:w-2/5"
          auto-insert-space
          @click="emit('on-submit')">
          {{ submitText }}
        </el-button>
        <slot name="edit"></slot>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/common'

const router = useRouter()
const route = useRoute()

// ----------- props ----------
const props = withDefaults(
  defineProps<{
    isSinglePage?: boolean
    disable?: boolean
    submitText?: string
    cancelText?: string
  }>(),
  {
    isSinglePage: false,
    disable: false,
    submitText: '確定',
    cancelText: '取消',
  },
)

// ----------- emit ----------
const emit = defineEmits<{
  (e: 'on-submit'): void
  (e: 'on-cancel'): void
}>()

// ----------- computed ----------
const propsEditAble = defineModel('editAble', { default: false })

const canEdit = computed(() => {
  return propsEditAble.value || route.path.includes('create') || route.path.includes('edit')
})

// ----------- actions ----------
const actions = {
  handleGoBack: () => {
    emit('on-cancel')
    if (propsEditAble.value) {
      propsEditAble.value = false
    } else {
      if (window.history.state.back) {
        router.back()
      } else {
        console.log('err')
        router.replace({ path: '/' })
      }
    }
  },
}
</script>
