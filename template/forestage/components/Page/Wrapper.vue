<template>
  <div class="relative flex-1" :class="{ 'pt-[44px]': props.top }">
    <section class="mx-auto w-full max-w-[1024px]">
      <slot />
    </section>
  </div>
</template>
<script lang="ts" setup>
const props = defineProps({
  top: {
    type: Boolean,
    default: true,
  },
})
</script>
