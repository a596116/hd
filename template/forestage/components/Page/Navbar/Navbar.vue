<script lang="ts" setup>
import gsap from 'gsap'
import { menus, type Menu } from '~/content/menus'

const childrenMenu = ref<Menu[]>([])
const childrenMenuImg = ref('')
const handleClickMenu = (cmenu: any) => {
  childrenMenu.value = cmenu
}
const isOpen = ref(false)
const openHeight = ref('44px')
let tl: gsap.core.Timeline | null = null
const dropdown = (type: boolean, cmenu?: any, img?: string) => {
  if (type) {
    const max = Math.max(...cmenu.map((item: any) => item.children?.length || 0))
    const hei = max * 32 + 48 + 48 + 64
    openHeight.value = hei < 450 ? '450px' : hei + 'px'
    isOpen.value = true
    if (childrenMenu.value != toRef(cmenu).value) {
      childrenMenu.value = cmenu
      childrenMenuImg.value = img || ''
      tl?.clear()
      nextTick(() => {
        tl = gsap.timeline({
          paused: true,
          defaults: { duration: 0.3, ease: 'power1.inOut' },
        })
        tl.fromTo(
          '.cmenu-item',
          { opacity: 0, x: '-1em', stagger: 0.1 },
          { opacity: 1, x: '0em', stagger: 0.1 },
          0,
        )
        tl.fromTo(
          '.cmenu-img',
          { opacity: 0, x: '1em', stagger: 0.1 },
          { opacity: 1, x: '0em', stagger: 0.1 },
          0,
        )
        tl?.play()
      })
    }
  } else {
    openHeight.value = '44px'
    isOpen.value = false
    childrenMenu.value = []
    childrenMenuImg.value = ''
    tl?.reverse()
  }
}
</script>

<template>
  <NavbarBuilder>
    <template #menu>
      <div
        class="navbar box-border hidden w-full flex-col items-center justify-center text-white lg:flex"
        :class="{ active: isOpen }"
        @mouseleave="dropdown(false)">
        <nav class="h-full w-full max-w-[1024px] text-xs leading-6" role="navigation">
          <ul class="flex h-[44px] w-full flex-wrap items-center justify-between">
            <Anchor to="/" class="flex items-center" @mouseenter="dropdown(false)">
              <svg-icon name="logo-1" class="h-7 w-7"></svg-icon>
            </Anchor>
            <div
              v-for="(item, i) in menus"
              :key="i"
              class="group flex h-full cursor-pointer items-center font-bold">
              <li class="menu flex h-full">
                <Anchor
                  v-if="!item.children?.length"
                  :to="item.link ? item.link : undefined"
                  class="nav center flex-1 px-2 py-2 capitalize"
                  :text="item.name"
                  :hover="false"
                  :duration="false"
                  @mouseenter="dropdown(false)" />
                <Anchor
                  v-else-if="item.link"
                  :to="item.link ? item.link : undefined"
                  class="nav center flex-1 px-2 py-2 capitalize"
                  :text="item.name"
                  :hover="false"
                  :duration="false"
                  @click="dropdown(false)"
                  @mouseenter="dropdown(true, item.children, item.img)" />
                <span
                  v-else
                  class="nav center flex-1 px-2 py-2 capitalize"
                  @mouseenter="dropdown(true, item.children, item.img)">
                  {{ item.name }}
                </span>
              </li>
            </div>
          </ul>
          <div class="cmenu flex gap-6 px-28">
            <section
              v-for="(item, index) in childrenMenu"
              :key="index"
              class="cmenu-item flex flex-col items-start gap-2 whitespace-nowrap rounded-md py-6">
              <Anchor
                v-if="item.link"
                :to="item.link ? item.link : undefined"
                :text="item.name"
                @click="dropdown(false)"
                class="text-lg hover:text-white/50" />
              <span class="mb-1 text-xs text-white/50">{{ item.name }}</span>
              <Anchor
                v-for="chi of item.children"
                :to="chi.link ? chi.link : undefined"
                :text="chi.name"
                @click="dropdown(false)"
                class="text-lg text-white hover:text-white/50" />
            </section>
            <Anchor
              v-if="childrenMenuImg"
              :to="`/`"
              class="cmenu-img group m-6 h-[299px] w-[399px] overflow-hidden">
              <NuxtImg
                format="webp"
                :src="childrenMenuImg"
                alt="浩呆"
                class="h-full w-full object-cover duration-500 group-hover:scale-105" />
            </Anchor>
          </div>
        </nav>
      </div>
      <section class="blur-bg"></section>
    </template>

    <template #drawer="{ toggleDrawer }">
      <div
        v-if="childrenMenu.length"
        @click="childrenMenu = []"
        class="center absolute top-0 h-[44px] w-[44px]">
        <svg-icon name="left" class="h-[30px] w-[30px] text-white"></svg-icon>
      </div>
      <div class="h-screen pt-[44px] text-hd-white">
        <!-- <Search type="open" class="my-4" /> -->
        <TransitionGroup name="checkout-up" appear>
          <nav v-if="childrenMenu?.length" class="flex flex-col gap-4 text-white/50">
            <section v-for="(item, index) of childrenMenu" :key="index" class="mt-6">
              <Anchor
                v-if="!item.children?.length"
                :to="item.link"
                :text="item.name"
                @click="toggleDrawer()"
                class="flex items-center px-5 text-sm" />
              <div v-else class="flex flex-col gap-4">
                <Anchor
                  v-if="item.link"
                  :to="item.link"
                  :text="item.name"
                  @click="toggleDrawer()"
                  class="flex items-center px-5 text-sm" />
                <span v-else class="mb-1 px-5 text-sm text-white/50">{{ item.name }}</span>
                <div v-for="(citem, cindex) of item.children" :key="cindex">
                  <Anchor
                    :to="citem.link"
                    :text="citem.name"
                    @click="toggleDrawer()"
                    class="flex items-center px-5 text-xl text-white" />
                </div>
              </div>
            </section>
          </nav>
          <nav v-else class="h-full w-full text-xl leading-6" role="navigation">
            <ul class="flex h-full w-full flex-col flex-wrap">
              <div
                v-for="(item, i) in menus"
                :key="i"
                class="group flex cursor-pointer items-center font-bold duration-300">
                <li class="menu relative flex h-full w-full items-center px-10 py-2">
                  <Anchor
                    v-if="!item.children?.length"
                    :to="item.link ? item.link : undefined"
                    class="nav flex-1 px-2 py-2 capitalize"
                    :text="item.name"
                    :hover="false"
                    @click="toggleDrawer()"
                    :duration="false" />
                  <span
                    v-else
                    class="nav h-full w-full flex-1 px-2 py-2"
                    @click="handleClickMenu(item.children)"
                    >{{ item.name }}
                  </span>
                  <svg-icon
                    v-if="item.children?.length"
                    name="arrow"
                    class="h-4 w-4 text-white"></svg-icon>
                </li>
              </div>
            </ul>
          </nav>
        </TransitionGroup>
      </div>
    </template>
  </NavbarBuilder>
</template>
<style lang="scss" scoped>
.menu {
  --el-menu-active-color: var(--hd-primary);
  .el-menu-item:hover,
  :deep(.el-sub-menu__title):hover {
    background-color: transparent !important;
  }
  :deep(.el-sub-menu__icon-arrow) {
    display: none;
  }
}
.nav:not(:last-child) {
  &::after {
    content: '';
    @apply absolute right-0 top-1/2 h-1/2 w-[1px] -translate-y-1/2 bg-white;
  }
}
.navbar {
  // @apply transition-[.5s];
  transition: height 0.4s cubic-bezier(0.37, -0.14, 0.55, 1.17);
  height: 44px;
  &.active {
    // height: 200px;
    height: v-bind(openHeight);
  }
}
.blur-bg {
  @apply absolute left-0 top-0 -z-10 h-screen w-full;
  visibility: hidden;
  opacity: 0;
  backdrop-filter: blur(20px);
}
.navbar.active + .blur-bg {
  visibility: visible;
  opacity: 1;
}
</style>
