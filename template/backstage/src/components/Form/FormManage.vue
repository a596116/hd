<template>
  <main class="relative mx-auto flex h-full flex-col">
    <!-- header -->
    <header
      v-if="showHeader"
      class="sticky right-0 top-0 z-10 mb-2 flex w-full flex-col bg-hd-bg-1 py-1 text-hd-text">
      <section class="flex justify-between px-2 py-1">
        <el-button
          type="default"
          class="flex items-center bg-transparent px-5"
          @click="handleGoBack">
          <el-icon class="text-hd-dark"><ArrowLeftBold /></el-icon>
        </el-button>
        <slot name="action" />
      </section>
    </header>

    <!-- 表單 -->
    <slot name="form" />

    <!-- footer -->
    <div class="sticky bottom-0 right-0 mt-auto w-full border-t" style="z-index: 9">
      <FooterFormManage
        v-if="showFooter"
        class="mt-auto"
        :disable="disable"
        :submit-text="submitText"
        :cancel-text="cancelText"
        :is-single-page="isSinglePage"
        @on-submit="emit('on-submit')">
        <template #button>
          <slot name="button"></slot>
        </template>
      </FooterFormManage>
    </div>
  </main>
</template>
<script setup lang="ts">
import { useCommonStore } from '@/stores/common'
import { ArrowLeftBold } from '@element-plus/icons-vue'

// ----------- props -----------
const props = withDefaults(
  defineProps<{
    disable?: boolean
    showHeader?: boolean
    showFooter?: boolean
    isSinglePage?: boolean
    submitText?: string
    cancelText?: string
  }>(),
  {
    disable: false,
    showHeader: true,
    showFooter: true,
    isSinglePage: false,
    submitText: '確定',
    cancelText: '取消',
  },
)

// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-submit'): void
}>()

const router = useRouter()
const handleGoBack = () => {
  if (window.history.state.back) {
    router.back()
  }
}
</script>
