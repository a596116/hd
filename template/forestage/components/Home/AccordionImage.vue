<template>
  <div v-if="width < 768" class="coverflow-example relative">
    <swiper
      class="p-[30px]"
      :modules="[Pagination, EffectCoverflow]"
      :effect="'coverflow'"
      :grab-cursor="true"
      :centered-slides="true"
      :slides-per-view="'auto'"
      :loop="true"
      :coverflow-effect="{
        rotate: 0,
        stretch: 90,
        depth: 150,
        modifier: 1,
        slideShadows: false,
      }">
      <swiper-slide class="slide relative" v-for="index in 8" :key="index">
        <NuxtImg
          format="webp"
          :src="`https://picsum.photos/500/300?random=${index}`"
          alt="浩呆"
          class="h-[400px] w-full object-cover" />
        <section class="slide-title center absolute bottom-10 w-full flex-col gap-1 text-white">
          <h3 class="text-2xl font-bold">HaoDai</h3>
          <span class="text-md">立即開始</span>
        </section>
      </swiper-slide>
    </swiper>
  </div>
  <div v-else class="accordion flex h-[300px] w-full">
    <div v-for="item of 4" :key="item" class="accordion-img">
      <Anchor :to="`/`" class="">
        <NuxtImg
          format="webp"
          :src="`https://picsum.photos/500/300?random=${item}`"
          alt="浩呆"
          class="absolute h-full w-full object-cover object-center" />
      </Anchor>
      <section class="accordion-title">
        <h3>HaoDai</h3>
        <span>立即開始</span>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Pagination, EffectCoverflow } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/vue'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

const width = ref(0)
const resize = useDebounce(() => {
  width.value = window.innerWidth
}, 300)

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<style scoped lang="scss">
.slide-title {
  @apply opacity-0;
  transition: opacity 0.4s ease-in-out;
}
.slide.swiper-slide-active {
  .slide-title {
    @apply opacity-100;
  }
}
.accordion {
  .accordion-img {
    @apply relative h-full flex-1 hover:flex-[2];
    transition: flex 0.8s ease;
    &::after {
      content: '';
      @apply absolute inset-0 cursor-pointer bg-black bg-opacity-0;
      transition: background-color 0.4s ease-in-out;
    }
  }

  &:has(.accordion-img:hover) {
    .accordion-img:not(:hover) {
      // 加上遮罩
      @apply after:bg-opacity-50;
    }
  }

  .accordion-title {
    @apply absolute bottom-[60px] left-0 z-10 flex w-full cursor-pointer flex-col items-center justify-center text-white;
    h3 {
      @apply text-3xl font-bold opacity-0;
    }
    span {
      @apply text-lg opacity-0;
    }
  }
  .accordion-img:hover {
    .accordion-title h3 {
      animation: titleClip 0.6s ease 0.2s forwards;
      animation-delay: 0.2s;
    }
    .accordion-title span {
      animation: titleUp 0.6s ease 0.2s forwards;
      animation-delay: 0.5s;
    }
  }
}
@keyframes titleClip {
  0% {
    opacity: 0;
    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%);
  }
  100% {
    opacity: 1;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }
}
@keyframes titleUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
