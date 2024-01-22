<template>
  <el-dialog
    ref="modalRef"
    :model-value="dialogVisible"
    :close-on-click-modal="false"
    title="重設密碼"
    center
    :append-to-body="true"
    class="custom-dialog custom-dialog-body w-full rounded-lg md:w-1/3"
    @close="propsVisible = false">
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="state.form.data"
      label-width="100px"
      label-position="top"
      class="custom-form p-3">
      <el-form-item label="原密碼" prop="password" :error="state.form.errors?.password" clearable>
        <el-input
          v-model.trim="state.form.data.password"
          placeholder="請填寫原密碼"
          type="password"
          autocomplete="new-password"></el-input>
      </el-form-item>

      <el-form-item
        label="新密碼"
        prop="newpassword"
        :error="state.form.errors?.newpassword"
        clearable>
        <el-input
          v-model.trim="state.form.data.newpassword"
          placeholder="請填寫新密碼"
          type="password"></el-input>
      </el-form-item>

      <el-button size="large" type="primary" class="w-full" @click="actions.handleResetPassword"
        >確定</el-button
      >
    </el-form>
  </el-dialog>
</template>

<script setup lang="ts">
import { FormInstance } from 'element-plus'

const propsVisible = defineModel<boolean>('dialogVisible', { required: true, default: false })

// ----------- data -----------
const ruleFormRef = ref<FormInstance>()
const modalRef = ref<any>()
const state = reactive({
  form: {
    data: <any>{},
    errors: <any>{},
  },
  captcha: {
    img: '',
    ckey: '',
  },
  loading: false,
  refresh: {
    hasValid: false,
  },
})

const rules = {
  password: [{ required: true, message: '請填寫原密碼', trigger: 'blur' }],
  newpassword: [{ required: true, message: '請填寫新密碼', trigger: 'blur' }],
}

// 保存鼠标点击位置
const mousePosition = reactive({
  x: 0,
  y: 0,
})

/**
 * @description: 点击事件回调
 */
const clickHandler = (e: MouseEvent) => {
  mousePosition.x = e.x
  mousePosition.y = e.y
}

document.documentElement.addEventListener('click', clickHandler, true) // 事件捕获
watch(
  () => propsVisible.value,
  (value) => {
    if (value) {
      nextTick(() => {
        const node: HTMLElement = modalRef.value.dialogContentRef.$el // 获取对话框内容元素
        const computedStyle = window.getComputedStyle(node)
        let width // 对话框宽度
        if (/px/g.test(computedStyle.width)) {
          // 如果宽度是像素类型
          // 正则替换像素
          width = Number(computedStyle.width.replace(/px/g, ''))
        } else {
          // 宽度为百分比类型
          // 正则替换百分比并转化为数字格式
          width =
            document.documentElement.clientWidth *
            (Number(computedStyle.width.replace(/%/g, '')) / 100)
        }
        const top = computedStyle.marginTop.replace(/px/g, '') // 对话框距离顶部的距离
        // 计算变换偏移
        // element-plus 中，对话框默认是居中的
        const transformLeft = mousePosition.x - (document.documentElement.clientWidth - width) / 2 // 本质上为对话框左上角的 x 距离触发点 x 的距离
        const transformTop = mousePosition.y - Number(top) // 本质上为对话框左上角的 y 距离触发点 y 的距离
        node.style.transformOrigin = `${transformLeft}px ${transformTop}px`
      })
    }
  },
)

// ----------- methods -----------
const actions = {
  /**
   * @description 重置密碼
   */
  handleResetPassword: () => {
    ruleFormRef.value?.validate((valid) => {
      if (!valid) return
      const params = {
        ...state.form.data,
      }
      api.authApi
        .alterUserPassword(state.form.data)
        .then((result) => {
          if (result?.status) {
            ruleFormRef.value?.resetFields()
            mesBox.success({ title: '重設密碼成功', subTitle: '' })
            propsVisible.value = false
          } else {
            mesBox.error({ title: '重設密碼失敗', subTitle: result?.message })
          }
        })
        .catch((error) => {
          actions.handleCatchError(error)
        })
    })
  },

  /**
   * @description 422 錯誤提示
   */
  handleCatchError: (error: any) => {
    const errors = error?.response?.data?.errors
    state.form.errors = {}
    nextTick(() => {
      if (error?.response?.status !== 422) return
      Object.entries(errors).forEach(([key, val]: any) => (state.form.errors[key] = val.join(' ')))
    })
  },
}
</script>
