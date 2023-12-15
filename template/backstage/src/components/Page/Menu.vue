<template>
  <el-menu
    :collapse="!menuStore.isMenuCollapse"
    :default-active="active_menu"
    mode="vertical"
    class="admin-menu"
    :unique-opened="true">
    <div class="my-4 flex w-full cursor-pointer items-center justify-center px-2">
      <svg-icon name="logo" class="h-[60px] w-full" @click="handle({ route: 'admin' })"></svg-icon>
    </div>

    <div class="" v-for="(menu, index) in menuStore.menus" :key="index">
      <el-sub-menu v-if="menu.children?.length != 1" :index="menu.title!">
        <template #title>
          <section class="hidden md:block">
            <svg-icon :name="menu.icon" class="h-5 w-5"></svg-icon>
          </section>
          <span class="title mx-2 md:mx-4">{{ menu.title }}</span>
        </template>
        <el-menu-item
          v-for="(cmenu, index) in menu.children"
          :key="index"
          :index="cmenu?.route?.split('/')[1]"
          @click="handle(cmenu)">
          <span class="menu-title">{{ cmenu.title }}</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item
        v-else
        :index="menu.children[0]?.route?.split('/')[1]"
        @click="handle(menu.children![0])">
        <section class="hidden md:block">
          <svg-icon :name="menu.icon" class="h-5 w-5"></svg-icon>
        </section>
        <span class="title mx-2 md:mx-4">{{ menu.children[0].title }}</span>
      </el-menu-item>
    </div>
  </el-menu>
  <div
    v-if="menuStore.isMenuCollapse"
    class="absolute left-0 top-0 z-[11] h-full w-full bg-white/50 md:hidden"
    @click="menuStore.toggleMenu"></div>
</template>

<script setup lang="ts">
import type { IMenu } from '../../../types/menu'
import { useMenuStore } from '@/stores/menuStore'
import router from '@/router'
const route = useRoute()
const menuStore = useMenuStore()
const active_menu = ref(route.path.split('/')[2])

const handle = (cmenu?: IMenu) => {
  router.push({ name: cmenu?.route })
  closeMenu()
}
const closeMenu = () => {
  if (document.documentElement.scrollWidth <= 768) {
    menuStore.toggleMenu()
  }
}
watch(
  route,
  () => {
    active_menu.value = route.path.split('/')[1]
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.admin-menu {
  @apply left-0 top-0 z-[12] mx-2 my-4 h-[calc(100vh-32px)] max-w-[190px] overflow-hidden rounded-xl border-0 px-1 max-md:absolute
        max-md:mt-[10px]  max-md:h-[calc(100vh-20px)];
  transition: width 0.3s ease-in-out;
  span,
  svg,
  * {
    @apply text-hd-text-50;
    transition: all 0.3s ease-in-out !important;
  }
  // Menu
  :deep(.el-menu-item) {
    @apply rounded-lg;
    span,
    svg {
      background-color: transparent !important;
      color: var(--hd-text-50);
      letter-spacing: 8px;
      // transition: 0.3s ease-in-out !important;
    }

    &:hover {
      @apply text-hd-primary-hover;
      span,
      svg,
      * {
        @apply text-hd-primary-hover;
      }
    }
    &.is-active {
      @apply text-hd-white;
      background-color: var(--hd-primary-hover) !important;
      span,
      svg,
      * {
        @apply text-hd-white;
      }
    }
  }

  .is-active .el-sub-menu__title * {
    color: var(--hd-primary-hover) !important;
  }

  .form-container input::placeholder {
    color: #fff !important;
  }

  &.el-menu--collapse span,
  &.el-menu--collapse .el-sub-menu__icon-arrow {
    @apply hidden;
  }

  &.el-menu--collapse .el-sub-menu.is-active {
    @apply rounded-lg bg-hd-primary-hover;
    * {
      color: var(--hd-white) !important;
    }
  }
}

@media (max-width: 768px) {
  .el-menu--collapse {
    width: 0px;
  }
}
</style>
