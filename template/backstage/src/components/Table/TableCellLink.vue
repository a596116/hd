<template>
  <div>
    <span v-show="!!value" class="text-hd-primary cursor-pointer" @click.stop="emit('cell-click')">
      {{ label || value }}
    </span>
    <span v-show="!value">-</span>
  </div>
</template>
<script setup lang="ts">
// ----------- props -----------
const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  value: {
    type: String,
    default: '',
  },
})
// ----------- emit -----------
const emit = defineEmits(['cell-click'])
</script>
