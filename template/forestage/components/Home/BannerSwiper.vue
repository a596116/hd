<template>
  <!-- <Wrapper> -->
  <swiper
    :speed="900"
    :parallax="true"
    :modules="[Autoplay, Pagination, Parallax, Navigation, EffectFade]"
    :autoplay="option.autoplay"
    :pagination="option.pagination"
    :navigation="true"
    :effect="'fade'"
    :loop="true"
    :fade-effect="{ crossFade: true }"
    class="banner relative max-h-screen w-full rounded-[0px]">
    <swiper-slide v-for="item of content" :key="item.title">
      <img :src="item.image" class="banner-bg parallax-bg block object-cover" />
      <div
        class="banner-inner absolute flex flex-col text-hd-primary"
        :class="{
          '-translate-x-[50%]': item.align === 'center',
          '-translate-x-[50%] lg:translate-x-[120%]': item.align === 'right',
          '-translate-x-[50%] lg:-translate-x-[100%]': item.align === 'left',
        }">
        <span class="mb-3 text-xl font-bold lg:text-4xl" data-swiper-parallax="-800">
          {{ item.title }}
        </span>
      </div>
    </swiper-slide>
  </swiper>
  <!-- </Wrapper> -->
</template>

<script setup lang="ts">
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import 'swiper/css/navigation'
import { Swiper, SwiperSlide } from 'swiper/vue'
import type { SwiperOptions } from 'swiper/types'
import { Autoplay, EffectFade, Navigation, Pagination, Parallax } from 'swiper/modules'

const option: SwiperOptions = {
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    clickable: true,
  },
}

const content = [
  {
    title: '',
    image: 'https://i.imgur.com/YRWcNbY.jpg',
    align: 'center',
  },
  {
    title: '',
    image: 'https://i.imgur.com/MPKwD2a.jpg',
    align: 'right',
  },
  {
    title: '',
    image: 'https://i.imgur.com/erxeLO3.jpg',
    align: 'left',
  },
]
</script>

<style scoped lang="scss">
.banner-bg {
  @apply m-auto min-h-[300px] w-full;
  position: relative;
  border-radius: 0px;
}
.banner-inner {
  @apply left-1/2 top-1/2  text-center;
}
:deep(.swiper-pagination-bullet) {
  background-color: var(--hd-white) !important;
  height: 12px;
  width: 12px;
}

:deep(.swiper-button-prev) {
  @apply left-5 h-[20%] w-10 -translate-x-20 -translate-y-1/2 text-hd-white duration-300;
}
:deep(.swiper-button-next) {
  @apply right-5 h-[20%] w-10 -translate-y-1/2 translate-x-20 text-hd-white duration-300;
}
.banner:hover {
  :deep(.swiper-button-prev),
  :deep(.swiper-button-next) {
    @apply translate-x-0;
  }
}
</style>
