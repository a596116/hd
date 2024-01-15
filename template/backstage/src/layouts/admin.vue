<template>
  <div class="relative flex h-full w-full items-center gap-3 bg-hd-bg p-3 text-hd-dark">
    <Menu />
    <el-container class="relative grid min-h-full">
      <div class="content grid w-full grid-rows-[auto_1fr]">
        <NavBar />

        <main class="main relative h-full overflow-y-auto rounded-2xl bg-hd-bg-1">
          <router-view #default="{ Component, route }">
            <Transition
              appear
              :enter-active-class="route.meta.enterClass ?? 'animate__bounceInRight'"
              :leave-active-class="route.meta.leaveClass ?? 'animate__bounceOutLeft'">
              <component :is="Component" class="absolute h-full w-full" />
            </Transition>
          </router-view>
        </main>
      </div>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const route = useRoute()
const menuStore = useMenuStore()

menuStore.init('admin')
watch(
  route,
  () => {
    menuStore.addHistoryMenu(route)
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.animate__bounceInRight {
  animation-duration: 0.8s;
}

.animate__bounceOutLeft {
  animation-duration: 0.5s;
}

.mask {
  z-index: 99;
  @apply absolute top-0 h-screen w-screen bg-hd-dark-50 opacity-20;

  &.close {
    @apply hidden;
  }
}
</style>
