<template>
  <div class="">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'admin/home' }">
        <svg-icon name="home" class="w-4 h-4" />
      </el-breadcrumb-item>
      <el-breadcrumb-item v-if="menuStore.route?.menu?.title !== '首頁'">{{
        menuStore.route?.menu?.title
      }}</el-breadcrumb-item>
      <!-- <template v-if="menuStore.route">
        <el-breadcrumb-item v-for="(r, index) in menuStore.route.menu" :key="index">
          {{ r.meta.menu?.title }}
        </el-breadcrumb-item>
      </template> -->
    </el-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()
</script>

<style lang="scss" scoped>
.el-breadcrumb__inner {
  color: var(--hd-text) !important;
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
</style>
