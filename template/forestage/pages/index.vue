<script lang="ts" setup>
import { gsap, ScrollTrigger } from 'gsap/all'

useSeoMeta({
  title: '首頁',
})

gsap.registerPlugin(ScrollTrigger)
onNuxtReady(() => {
  gsap.utils.toArray('[data-aos^=fade]').forEach((ele: any) => {
    const direction = ele.dataset.aos?.split('-')[1] as 'up' | 'down' | 'left' | 'right',
      proxy = {
        up: [0, 50],
        down: [0, -50],
        left: [50, 0],
        right: [-50, 0],
      }
    gsap.from(ele, {
      scrollTrigger: {
        trigger: ele,
        start: 'top bottom',
        toggleActions: 'play none none reverse',
      },
      duration: 0.5,
      opacity: 0,
      ease: 'power1.inOut',
      xPercent: proxy[direction][0],
      yPercent: proxy[direction][1],
    })
  })
})
</script>

<template>
  <main class="flex flex-1 flex-col pt-[44px]">
    <BannerSwiper />
    <AccordionImage />
    <HomePage />
    <!-- <Wrapper class="flex-1 flex-col items-center gap-14 bg-hd-bg px-1"> -->
    <!-- </Wrapper> -->
  </main>
</template>
