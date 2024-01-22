<template>
  <div class="flex items-center">
    <el-dropdown class="">
      <div class="flex w-full items-center justify-center duration-200 hover:scale-105">
        <el-image src="/user.png" class="logo1 h-8 w-8 rounded-full" fit="cover" :lazy="true" />
        <span class="mx-2 whitespace-nowrap text-base text-hd-text">
          {{ userStore.user?.uname }}
        </span>
      </div>
      <template #dropdown>
        <el-dropdown-menu class="px-1 py-3">
          <ThemeSetting :is-dropdown="true" class="sm:hidden" />
          <el-dropdown-item
            class="text-hd-dark hover:!text-hd-dark-50"
            @click="dialogVisible = true">
            <svg-icon name="reset" class="mr-2"></svg-icon>
            修改密碼
          </el-dropdown-item>
          <el-dropdown-item class="text-hd-dark hover:!text-hd-dark-50" @click="userStore.logout">
            <svg-icon name="logout" class="mr-2 rotate-180"></svg-icon>
            退出登入
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <DialogResetPassword v-model:dialog-visible="dialogVisible" />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'

const userStore = useAuthStore()
const dialogVisible = ref(false)
</script>
