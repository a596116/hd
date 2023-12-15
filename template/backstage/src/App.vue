<template>
  <suspense>
    <el-config-provider :locale="zhTw">
      <RouterView />
    </el-config-provider>
  </suspense>
</template>
<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhTw from 'element-plus/dist/locale/zh-tw.mjs'
</script>
<style lang="scss">
@import '#/scss/base.scss';
</style>
