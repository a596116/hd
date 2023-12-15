<template>
  <main class="relative mx-auto flex h-full flex-col">
    <!-- header -->
    <header v-if="showHeader" class="mb-4 flex w-full flex-col border-b py-2 text-hd-text">
      <section class="flex justify-between px-4 py-2">
        <el-button class="flex items-center px-5" @click="handleGoBack">
          <el-icon><ArrowLeftBold /></el-icon>
        </el-button>
        <slot name="action" />
      </section>
    </header>

    <!-- 表單 -->
    <slot name="form" />

    <!-- footer -->
    <div class="sticky bottom-0 right-0 mt-auto w-full" style="z-index: 9">
      <FooterFormManage
        v-if="showFooter"
        class="mt-auto"
        :disable="disable"
        :is-single-page="isSinglePage"
        @on-submit="emit('on-submit')">
      </FooterFormManage>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ArrowLeftBold } from '@element-plus/icons-vue'

// ----------- props -----------
const props = defineProps({
  disable: { type: Boolean, default: false },
  showHeader: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: true },
  isSinglePage: { type: Boolean, default: false },
})

// ----------- emits -----------
const emit = defineEmits(['on-submit'])

const router = useRouter()
const handleGoBack = () => {
  if (window.history.state.back) {
    router.back()
  }
}
</script>
