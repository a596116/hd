<template>
  <div>
    <el-form
      ref="FormRef"
      :model="model"
      :rules="rules"
      label-position="top"
      :hide-required-asterisk="true">
      <h1>{{ title }}</h1>
      <el-form-item
        v-for="f of fields"
        :key="f.name"
        :prop="f.name"
        :label="f.title"
        class="mt-[34px] text-white">
        <el-input
          v-if="f.name !== 'captcha'"
          v-model.trim="model[f.name]"
          :placeholder="f.placeholder"
          :show-password="f.type == 'password'"
          @keyup.enter="emit('submit', FormRef)">
          <template v-if="f.icon" #prefix>
            <svg-icon :name="f.icon" class="text-white"></svg-icon>
          </template>
        </el-input>
      </el-form-item>
      <slot name="button"></slot>
      <el-form-item>
        <el-button
          type="default"
          @click="emit('submit', FormRef)"
          class="relative mx-10 mt-[40px] w-full rounded-md bg-transparent px-[50px] py-[8px] font-black text-white hover:text-hd-primary-hover">
          {{ type == 'login' ? '登入' : '註冊' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

// ----------- props ----------
const props = defineProps<{
  fields: formColumnsType[]
  model: any
  title: string
  type: string
  rules: any
}>()

// ----------- emit ----------
const emit = defineEmits<{
  (e: 'submit', form: FormInstance): void
}>()

const FormRef = ref<FormInstance>()
</script>

<style scoped lang="scss">
:deep(.el-form) {
  @apply relative h-full w-[100%];
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px rgba(255, 255, 255, 0) inset !important;
    -webkit-text-fill-color: #fff !important;
    -webkit-background-clip: text;
  }
  h1 {
    @apply relative mb-5 text-h3 font-semibold text-white;
    letter-spacing: 1px;
  }
  .el-form-item.is-error .el-input {
    border-color: var(--el-color-danger);
  }
  .el-input {
    @apply w-full rounded-md border px-[6px] py-[5px] text-base text-white outline-none;
    transition: all 0.2s;
    .el-input__wrapper {
      background-color: transparent !important;
      box-shadow: none !important;
    }

    &:focus {
      @apply border-green-500;
    }

    ::placeholder {
      color: rgb(227, 228, 234) mportant;
    }
    :deep(.el-input__suffix-inner) {
      @apply text-green-500;
    }
    &:has(.el-input__wrapper.is-focus) {
      @apply border-hd-primary;
    }
  }
  .el-form-item__label,
  .el-input__inner {
    @apply text-white;
  }
}
</style>
