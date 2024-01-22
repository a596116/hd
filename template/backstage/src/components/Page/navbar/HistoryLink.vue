<template>
  <section
    class="history mb-2 flex h-[30px] max-w-[100vw] overflow-auto"
    v-show="menuStore.historyMenus.length">
    <ul ref="historyRef" class="grid grid-flow-col justify-start gap-3 rounded-lg">
      <li
        v-for="link in menuStore.historyMenus"
        :key="link.title"
        class="group box-border flex items-center whitespace-nowrap rounded-lg border bg-hd-bg-1 text-sm shadow-sm hover:bg-hd-primary"
        :class="{
          'bg-hd-primary text-white': route.name === link.route,
        }"
        @click.stop.middle.prevent="menuStore.removeHistoryMenu(link)">
        <Anchor
          :to="{ name: link.route }"
          :text="link.title"
          class="py-1 pl-2 group-hover:text-white" />
        <svg-icon
          name="close"
          class="mx-1 h-4 w-4 cursor-pointer duration-150 hover:text-hd-white-50"
          @click="menuStore.removeHistoryMenu(link)"></svg-icon>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import { useMenuStore } from '@/stores/menuStore'
import Sortable from 'sortablejs'

const menuStore = useMenuStore()
const route = useRoute()
const historyRef = ref<HTMLElement | null>(null)
const a = ref()
// ----------- onMounted ----------
onMounted(() => {
  // 是pc端才能拖曳
  const isPc = !/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)
  isPc && drag()
})

/*
 * @description: 拖曳排序
 */
const drag = () => {
  Sortable.create(historyRef.value, {
    animation: 150, // ms, number 单位：ms，定义排序动画的时间
    draggable: 'li',
    onStart: function (e: any) {
      menuStore.historyMenus.push({})
      nextTick(() => {
        const el = document.querySelector('.history li:last-child')
        el?.classList.add('hidden')
      })
    },
    onEnd({ newIndex, oldIndex }) {
      const currentRow = menuStore.historyMenus.splice(oldIndex, 1)[0]
      menuStore.historyMenus.splice(newIndex, 0, currentRow)
      menuStore.historyMenus.pop()
    },
  })
}
</script>

<style scoped lang="scss">
main > div {
  // box-shadow: 5px 5px 14px #a7aaad, -5px -5px 14px #ffffff;
}
.history::-webkit-scrollbar {
  display: none;
}
</style>
