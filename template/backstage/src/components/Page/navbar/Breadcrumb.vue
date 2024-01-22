<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'admin/home' }">
        <svg-icon name="home" class="h-4 w-4" />
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="menuStore.route?.page?.menu?.defaultPath"
        :to="{ path: menuStore.route?.page?.menu?.defaultPath }"
        >{{ menuStore.route?.page?.menu?.title }}</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="menuStore.route?.menu?.title !== '首頁'">{{
        menuStore.route?.menu?.title
      }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()
</script>

<style lang="scss" scoped>
.breadcrumb {
  --el-text-color-regular: var(--hd-primary) !important;
  .el-breadcrumb__inner {
    color: var(--hd-primary) !important;
  }

  .el-breadcrumb__inner.is-link {
    color: var(--hd-text-50) !important;
  }

  .el-breadcrumb__inner.is-link:hover {
    color: var(--hd-primary-hover) !important;
  }
  :deep(.el-breadcrumb__item) {
    height: 24px !important;
  }
}
</style>
