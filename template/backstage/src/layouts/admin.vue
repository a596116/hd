<template>
  <div class="relative flex h-full w-full items-center gap-3 bg-hd-bg p-3 text-hd-dark max-sm:p-1">
    <Menu />
    <div
      class="content grid h-full w-full grid-rows-[auto_1fr]"
      :class="{
        'grid-rows-[auto_auto_1fr]': menuStore.isHistoryCollapse,
      }">
      <NavBar />
      <HistoryLink v-if="menuStore.isHistoryCollapse" />

      <main class="main relative max-h-full overflow-y-auto rounded-2xl bg-hd-bg-1">
        <router-view #default="{ Component, route }">
          <component :is="Component" class="h-full w-full" />
        </router-view>
      </main>
      <!-- <Transition
        appear
        :enter-active-class="route.meta.enterClass ?? 'animate__bounceInRight'"
        :leave-active-class="route.meta.leaveClass ?? 'animate__bounceOutLeft'">
        <component :is="Component" class="absolute w-full h-full" />
      </Transition> -->
    </div>
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
