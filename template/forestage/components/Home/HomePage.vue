<template>
  <main class="flex w-full flex-col overflow-hidden">
    <article
      v-for="(post, index) in 10"
      :key="index"
      class="relative my-6 flex w-full items-center justify-center max-lg:flex-col lg:my-16"
      :class="{ 'lg:flex-row-reverse': index % 2 == 0 }">
      <Anchor
        :data-aos="index % 2 == 0 ? 'fade-left' : 'fade-right'"
        :to="`/`"
        class="post-img group z-10 h-[299px] w-[399px] overflow-hidden rounded-md bg-hd-dark shadow-md max-sm:h-[250px] max-sm:w-[90%]">
        <NuxtImg
          format="webp"
          :src="`https://picsum.photos/299/399?random=${post}`"
          alt="浩呆"
          class="h-full w-full object-cover duration-500 group-hover:scale-105" />
      </Anchor>
      <section
        :data-aos="index % 2 == 0 ? 'fade-right' : 'fade-left'"
        class="center relative flex w-[450px] rounded-md border-hd-dark max-sm:w-[90%] lg:-left-5 lg:top-5 lg:h-[300px] lg:border"
        :class="{ 'lg:left-5': index % 2 == 0 }">
        <span
          >Lorem, ipsum dolor sit amet consectetur adipisicing elit. Deleniti minima reiciendis sunt
          ipsam illo doloribus dolores debitis. Corrupti, odio sapiente. Similique non ipsa odio
          quaerat voluptate repellendus optio animi alias?</span
        >
      </section>
    </article>
  </main>
</template>

<script setup lang="ts"></script>
