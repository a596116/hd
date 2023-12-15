<template>
  <div>
    <el-form ref="FormRef" :model="model" :rules="rules" label-position="top">
      <h1>{{ title }}</h1>
      <el-form-item
        v-for="f of fields"
        :key="f.name"
        :prop="f.name"
        :label="f.title"
        class="mt-[34px]">
        <el-input
          v-if="f.name !== 'captcha'"
          v-model.trim="model[f.name]"
          :placeholder="f.placeholder"
          clearable
          autocomplete="new-password"
          :show-password="f.type == 'password'"
          @keyup.enter="emit('submit', FormRef)">
          <template v-if="f.icon" #prefix>
            <svg-icon :name="f.icon" class="text-hd-white"></svg-icon>
          </template>
        </el-input>
        <div v-else class="flex items-center justify-center w-full">
          <el-input
            v-model.trim="model[f.name]"
            :placeholder="f.placeholder"
            clearable
            maxlength="4"
            @keyup.enter="emit('submit', FormRef)"
            class="!w-1/2" />
          <div v-html="captcha.img" @click="getNewCaptcha(captcha.id)" class="w-1/2"></div>
        </div>
      </el-form-item>
      <slot name="button"></slot>
      <el-form-item>
        <el-button
          type="default"
          @click="emit('submit', FormRef)"
          class="relative mx-10 mt-[40px] w-full rounded-md bg-transparent px-[50px] py-[8px] font-black text-hd-white hover:text-hd-primary-hover">
          {{ type == 'login' ? '登入' : '註冊' }}
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'

const props = defineProps<{
  fields: formColumnsType[]
  model: any
  title: string
  type: string
  rules: any
}>()

const emit = defineEmits(['submit'])

const captcha = ref<any>({ id: '-1', img: '' })
onMounted(() => {
  if (props.type == 'register') {
    getNewCaptcha()
  }
})

/**
 * 獲取驗證碼
 * @date 2022-08-28
 */
const getNewCaptcha = (id?: string) => {
  props.model.captcha = ''
  api.authApi.captcha(id).then((res) => {
    captcha.value = res.data
  })
}

const FormRef = ref<FormInstance>()
</script>

<style scoped lang="scss">
:deep(.el-form) {
  @apply relative h-full w-[100%];

  h1 {
    @apply relative mb-5 text-h3 font-semibold text-hd-white;
    letter-spacing: 1px;
  }
  .el-form-item.is-error .el-input {
    border-color: var(--el-color-danger);
  }
  .el-input {
    @apply w-full rounded-md border px-[6px] py-[5px] text-base outline-none;
    transition: all 0.2s;

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
    @apply text-hd-white;
  }
}
</style>
