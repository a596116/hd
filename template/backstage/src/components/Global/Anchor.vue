<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    text?: string
    to?: string | Record<string, unknown>
    href?: string
    target?: '_blank' | '_self' | '_parent' | '_top'
  }>(),
  {
    text: '',
    to: undefined,
    href: '',
    target: '_self',
  },
)

// state
const href = toRef(props, 'href')
const to = toRef(props, 'to')
</script>
<template>
  <RouterLink
    v-if="to"
    :to="to"
    :target="target"
    class="cursor-pointer outline-none transition-colors duration-150 hover:text-hd-primary-hover">
    <slot>{{ text }}</slot>
  </RouterLink>
  <a
    v-else-if="href"
    class="cursor-pointer outline-none transition-colors duration-150 hover:text-hd-primary-hover"
    :href="href"
    target="_blank">
    <slot>{{ text }}</slot>
  </a>
  <span
    v-else
    class="cursor-pointer outline-none transition-colors duration-150 hover:text-hd-primary-hover"
    ><slot>{{ text }}</slot></span
  >
</template>
