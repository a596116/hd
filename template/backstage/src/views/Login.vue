<template>
  <main>
    <div class="introduce">
      <div class="introduce-content">
        <p class="tips animate__animated animate__slideInLeft">歡迎使用後台管理系統</p>
      </div>
    </div>
    <div class="form-wrapper animate__animated animate__slideInRight">
      <FormLogin
        title="登入"
        :fields="state.authLoginForm"
        :model="state.loginForm"
        :rules="loginRules"
        class="w-full"
        @submit="actions.handleLogin"
        type="login">
        <template #button>
          <div class="mt-8 flex items-center justify-between gap-4">
            <el-checkbox
              v-model="state.loginForm.rememberMe"
              label="記住我"
              class="text-hd-white" />
          </div>
        </template>
      </FormLogin>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { FormInstance, FormRules } from 'element-plus'
import CryptoJS from 'crypto-js'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const state = reactive({
  // columns
  authLoginForm: [
    { title: '帳號', name: 'account', placeholder: '請輸入帳號', icon: 'user' },
    {
      title: '密碼',
      name: 'password',
      type: 'password',
      placeholder: '請輸入密碼',
      icon: 'password',
    },
  ] as formColumnsType[],
  // form
  loginForm: {
    account: '',
    password: '',
    rememberMe: false,
  },
})

// ----------- Rules ----------
const loginRules = reactive<FormRules>({
  account: [{ required: true, message: '請輸入帳號', trigger: 'change' }],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'change' },
    { min: 3, max: 12, message: '密碼長度在 3 到 12 之間', trigger: 'blur' },
  ],
})

onMounted(() => {
  getCookie()
})

const getCookie = () => {
  const {
    account: storeAccount,
    password: storePassword,
    rememberMe: storeRememberMe,
  } = authStore.rememberUser
  const { account, password, rememberMe } = state.loginForm

  let decryptedPassword = ''
  if (storePassword) {
    const decrypted = CryptoJS.AES.decrypt(storePassword, 'haodai')
    decryptedPassword = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted))
  }
  state.loginForm = {
    account: storeAccount ? storeAccount : account,
    password: decryptedPassword ? decryptedPassword : password,
    rememberMe: storeRememberMe ? Boolean(storeRememberMe) : rememberMe,
  }
}
const setCookie = (account: string, password: string, rememberMe: any) => {
  if (rememberMe) {
    const encryptPassword = CryptoJS.AES.encrypt(JSON.stringify(password), 'haodai').toString()
    authStore.rememberUser = {
      account,
      password: encryptPassword,
      rememberMe,
    }
  } else {
    authStore.rememberUser = {
      account: '',
      password: '',
      rememberMe: false,
    }
  }
}
const actions = {
  /**
   * 登入
   */
  handleLogin: async (formEl: FormInstance | undefined) => {
    const { rememberMe, account, password } = state.loginForm
    await formEl?.validate((valid: boolean) => {
      if (valid) {
        authStore.login(state.loginForm).then((res) => {
          if (res.status) {
            setCookie(account, password, rememberMe)
          }
        })
      }
    })
  },
}
</script>

<style scoped lang="scss">
main {
  @apply relative flex h-screen w-screen overflow-hidden text-white;
  background-image: url('@/assets/img/loginBg.png');
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
}
.introduce {
  @apply relative h-full w-1/2 max-md:hidden;
  .introduce-content {
    .tips {
      @apply absolute left-[20%] top-[40%] my-5 -translate-y-1/2 text-2xl;
    }
  }
}
.form-wrapper {
  @apply absolute right-0 box-border flex h-full w-1/2 items-center justify-center px-[10%] max-md:w-full;
  background: rgb(0 0 0 / 16%);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}
</style>
