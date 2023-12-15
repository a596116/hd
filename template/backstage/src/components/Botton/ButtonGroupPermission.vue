<template>
  <section>
    <el-tooltip
      v-for="button in permissionButtons"
      :key="button.tag"
      effect="dark"
      :content="button.title"
      placement="top">
      <el-button
        v-permission="{ currentTag: button.tag, effect: 'disabled' }"
        :type="button.tag === 'create' ? 'primary' : null"
        plain
        circle
        @click="emit('on-command', button.tag)">
        <template #icon>
          <svg-icon :name="button.icon" class="w-4 h-4"></svg-icon>
        </template>
      </el-button>
    </el-tooltip>
  </section>
</template>
<script setup lang="ts">
// ----------- emit -----------
const emit = defineEmits(['on-command'])

const permissionButtons = [{ icon: 'delete', tag: 'delete', title: '刪除' }]
</script>
