<script lang="ts" setup>
// micro compiler
const props = defineProps({
  text: {
    type: String,
    default: '',
  },
  to: {
    type: [String, Object],
    default: undefined,
  },
  href: {
    type: String,
    default: '',
  },
})

// state
const href = toRef(props, 'href')
const to = toRef(props, 'to')
</script>
<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="transition-colors duration-150 outline-none cursor-pointer hover:text-hd-primary-hover">
    <slot>{{ text }}</slot>
  </RouterLink>
  <a
    v-else-if="href"
    class="transition-colors duration-150 outline-none cursor-pointer hover:text-hd-primary-hover"
    :href="href"
    target="_blank">
    <slot>{{ text }}</slot>
  </a>
  <span
    v-else
    class="transition-colors duration-150 outline-none cursor-pointer hover:text-hd-primary-hover"
    >{{ text }}</span
  >
</template>
