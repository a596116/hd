<template>
  <main
    class="relative z-[18] m-2 flex h-[50px] flex-col"
    :class="{ 'h-[65px]1': menuStore.isHistoryCollapse }">
    <div class="flex items-center justify-between overflow-hidden rounded-lg bg-transparent py-1">
      <div class="flex items-center justify-center">
        <section
          @click="menuStore.toggleMenu"
          :class="{ 'rotate-180': menuStore.isMenuCollapse }"
          class="center mr-3 cursor-pointer text-xl duration-200 hover:scale-105 hover:text-hd-primary-hover">
          <svg-icon name="collapse"></svg-icon>
        </section>
        <Breadcrumb class="breadcrumb rounded-md bg-transparent px-2" />
      </div>

      <div class="flex items-center justify-center">
        <FullScreen class="mr-5" />
        <ThemeSetting class="mr-5 max-sm:hidden" />
        <UserInfo />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()
</script>
