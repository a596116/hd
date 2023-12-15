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
            <Anchor text="忘記密碼？" @click="" />
          </div>
        </template>
      </FormLogin>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { ILoginUser, IRegisterUser } from '@/apis/authApi'
import type { FormInstance, FormRules } from 'element-plus'
import { useCookies } from 'vue3-cookies'
import CryptoJS from 'crypto-js'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { cookies } = useCookies()

const state = reactive({
  isSigin: route.path.includes('login') ? false : true, //false->login | true->regist
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
  authRegisterForm: [
    { title: '暱稱', name: 'name', placeholder: '暱稱' },
    { title: '手機', name: 'account', placeholder: '帳號' },
    { title: '密碼', name: 'password', type: 'password', placeholder: '密碼' },
    { title: '驗證碼', name: 'captcha', placeholder: '驗證碼' },
  ] as formColumnsType[],
  // form
  loginForm: <ILoginUser>{
    account: '',
    password: '',
    rememberMe: false,
  },
  regiserForm: {
    account: '0988640301',
    password: '123456',
    name: 'haodai',
  } as IRegisterUser,
})

// ----------- Rules ----------
const loginRules = reactive<FormRules>({
  account: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 5, max: 12, message: '密碼長度在 5 到 12 之間', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' },
    { min: 2, max: 12, message: '名稱在2到12個字', trigger: 'blur' },
  ],
})
const registRules = reactive<FormRules>({
  account: [{ required: true, message: '請輸入帳號', trigger: 'blur' }],
  password: [
    { required: true, message: '請輸入密碼', trigger: 'blur' },
    { min: 5, max: 12, message: '密碼長度在 5 到 12 之間', trigger: 'blur' },
  ],
  name: [
    { required: true, message: '請輸入名稱', trigger: 'blur' },
    { min: 2, max: 12, message: '名稱在2到12個字', trigger: 'blur' },
  ],
  captcha: [
    { required: true, message: '請輸入驗證碼', trigger: 'blur' },
    { min: 4, max: 4, message: '請輸入4位驗證碼', trigger: 'blur' },
  ],
})

onMounted(() => {
  getCookie()
})

const getCookie = () => {
  const storeAccount = cookies.get('account')
  const storePassword = cookies.get('password')
  const storeRememberMe = cookies.get('rememberMe')
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
    cookies.set('account', account, 30)
    cookies.set('password', encryptPassword, 30)
    cookies.set('rememberMe', rememberMe, 30)
  } else {
    cookies.remove('account')
    cookies.remove('password')
    cookies.remove('rememberMe')
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
        authStore.login(state.loginForm).then(() => {
          setCookie(account, password, rememberMe)
          router.push('/')
        })
      }
    })
  },
  /*
   * @description: 註冊
   */
  handleRegist: async (formEl: FormInstance | undefined) => {
    // await formEl?.validate((valid: boolean) => {
    //   if (valid) {
    //     const cap = {
    //       captcha: props.model.captcha,
    //       id: captcha.value.id,
    //     }
    //     api.authApi.verify(cap).then((res) => {
    //       if (res.code === 200) {
    //         authStore.registUser(props.model).then(() => {})
    //       }
    //     })
    //   }
    // })
  },

  handleChange: (type: boolean) => {
    if (state.isSigin) {
      router.push({ name: 'login' })
    } else {
      router.push({ name: 'regist' })
    }
    state.isSigin = type
  },
}
</script>

<style scoped lang="scss">
main {
  @apply relative flex h-screen w-screen overflow-hidden text-white;
  background-image: url('@/assets/img/loginBg.png');
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
  background: rgb(0 0 0 / 6%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}
</style>
