<template>
  <main class="relative mx-1 my-1">
    <div class="flex h-[70px] items-center justify-between overflow-hidden rounded-md px-5 py-3">
      <!-- <Menu class="flex-1" /> -->

      <div class="flex items-center justify-center">
        <section
          @click="menuStore.toggleMenu"
          :class="{ 'rotate-180': menuStore.isMenuCollapse }"
          class="center mr-3 cursor-pointer text-xl duration-200 hover:scale-105 hover:text-hd-primary-hover">
          <svg-icon name="collapse"></svg-icon>
        </section>
        <transition name="top-slide-fade" mode="out-in">
          <section v-if="menuStore.isBreadcrumbCollapse" class="w-full px-2">
            <Breadcrumb />
          </section>
        </transition>
      </div>

      <div class="flex items-center justify-center">
        <FullScreen class="mr-5" />
        <ThemeSetting class="mr-5" />
        <!-- <notification class="mr-5" /> -->
        <UserInfo />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()
</script>
<style scoped lang="scss">
// main > div,
// .breadcrumb {
//   box-shadow:
//     5px 5px 14px #a7aaad,
//     -5px -5px 14px #ffffff;
// }
</style>
