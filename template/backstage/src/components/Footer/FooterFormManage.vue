<template>
  <footer class="z-10 w-full bg-hd-bg-1 py-4">
    <div class="flex items-center justify-end">
      <div v-if="!canEdit" class="flex items-center justify-end gap-x-3 px-2">
        <slot name="actions"></slot>
      </div>

      <div class="flex w-full flex-grow items-center justify-end gap-x-3">
        <div>
          <slot name="alert"></slot>
        </div>

        <el-button
          v-show="!isSinglePage || (!isSinglePage && canEdit)"
          size="large"
          class="w-2/3 lg:w-2/5 lg:max-w-[120px]"
          text
          bg
          auto-insert-space
          @click="actions.handleGoBack"
          >取消</el-button
        >
        <el-button
          v-if="canEdit"
          type="primary"
          size="large"
          class="w-2/3 lg:w-2/5 lg:max-w-[120px]"
          auto-insert-space
          v-permission="disable ? { currentTag: 'root', effect: 'disabled' } : null"
          @click="emit('on-submit')">
          確定
        </el-button>
        <slot name="edit"></slot>
      </div>
    </div>
  </footer>
</template>
<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const props = defineProps({
  editAble: { type: Boolean, default: false },
  isSinglePage: { type: Boolean, default: false },
  disable: { type: Boolean, default: false },
})

const emit = defineEmits(['on-submit', 'update:editAble', 'on-cancel'])

const canEdit = computed(() => {
  return (
    props.editAble ||
    route.path.includes('create') ||
    route.path.includes('edit') ||
    route.name == 'admin/member/info' ||
    route.name == 'admin/member/password'
  )
})

const propsEditAble = computed({
  get: () => props.editAble,
  set: (val) => {
    emit('update:editAble', val)
  },
})

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
