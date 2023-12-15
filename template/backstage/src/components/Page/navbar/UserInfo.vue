<template>
  <div class="flex items-center">
    <el-dropdown class="">
      <div class="flex w-full items-center justify-center duration-200 hover:scale-105">
        <el-image
          :src="userStore.user?.avatar !== '0' ? userStore.user?.avatar : '/logo.png'"
          class="logo1 h-8 w-8 rounded-full"
          fit="cover"
          :lazy="true" />
        <span class="text-hd-text mx-2 text-base">
          {{ userStore.user?.name }}
        </span>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="px-1 py-3">
          <el-dropdown-item
            class="text-hd-text hover:!text-hd-primary"
            @click="router.push({ name: 'admin/member/info' })">
            <svg-icon name="user"></svg-icon>
            會員訊息
          </el-dropdown-item>
          <!-- <el-dropdown-item class="text-hd-black hover:!text-hd-theme-color"
                        @click="router.push({ name: 'admin/member/info' })">
                        <icon-setting-config theme="outline" size="16" class="mr-1" />
                        設定
                    </el-dropdown-item> -->
          <el-dropdown-item class="text-hd-text hover:!text-hd-primary" @click="userStore.logout">
            <svg-icon name="logout"></svg-icon>
            退出登入
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup lang="ts">
import router from '@/router'
import { useAuthStore } from '@/stores/authStore'
const userStore = useAuthStore()
</script>
