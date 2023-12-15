<template>
  <div class="flex h-full w-full items-center justify-center">
    <Vue3Lottie :animation-data="DashBoard" height="100%" width="100%" class="block" />
  </div>
</template>

<script setup lang="ts">
import DashBoard from '@/assets/json/DashBoard.json'
</script>

<style scoped></style>
