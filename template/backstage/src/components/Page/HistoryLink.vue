<template>
  <main class="bg-hd-bg-1 mx-2 mb-2" v-show="menuStore.historyMenus.length">
    <div
      class="grid grid-flow-col justify-start gap-3 overflow-hidden rounded-lg px-4"
      :class="{ 'pt-6': menuStore.isBreadcrumbCollapse }">
      <div
        :to="{ name: link.route }"
        v-for="(link, index) in menuStore.historyMenus"
        :key="index"
        class="hover:bg-hd-primary group box-border flex items-center rounded-lg border px-2 py-1 text-sm shadow-sm duration-300"
        :class="{
          'bg-hd-primary text-white': route.name === link.route,
          'text-hd-text bg-white': route.name !== link.route,
        }"
        @click.stop.middle.prevent="menuStore.removeHistoryMenu(link)">
        <Anchor :to="{ name: link.route }" :text="link.title" class="group-hover:text-white" />
        <svg-icon
          name="close"
          class="hover:text-hd-primary-hover ml-1 h-4 w-4 cursor-pointer duration-150"
          @click="menuStore.removeHistoryMenu(link)"></svg-icon>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
const menuStore = useMenuStore()
const route = useRoute()
</script>

<style scoped lang="scss">
main > div {
  // box-shadow: 5px 5px 14px #a7aaad, -5px -5px 14px #ffffff;
}
</style>
