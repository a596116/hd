<template>
  <section>
    <el-tooltip
      v-for="(button, name) in permissionButtons"
      :key="button.tag"
      effect="dark"
      :content="button.title"
      placement="top">
      <el-button
        :type="button.tag === 'create' ? 'primary' : null"
        plain
        circle
        @click="emit('on-command', name)">
        <template #icon>
          <svg-icon :name="button.icon" class="h-4 w-4"></svg-icon>
        </template>
      </el-button>
    </el-tooltip>
  </section>
</template>
<script setup lang="ts">
// ----------- emit -----------
const emit = defineEmits<{
  (e: 'on-command', tag: keyof typeof permissionButtons): void
}>()
const permissionButtons = {
  delete: { icon: 'delete', tag: 'delete', title: '刪除' },
}
</script>
