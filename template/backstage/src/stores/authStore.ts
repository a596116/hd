import { defineStore } from 'pinia'
import { permissionList } from '@/router/autoImport'
import router from '@/router'
import { CacheEnum } from '@/enum/cacheEnum'
import { ILoginUser, Login } from '@/apis/authApi'
import { isEmpty } from 'lodash-es'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref<null | Login>(null)
    const rememberUser = ref<{ account: string; password: string; rememberMe: boolean }>({
      account: '',
      password: '',
      rememberMe: false,
    })

    /**
     * @description: 獲取用戶資訊
     */
    const getUser = async () => {
      return new Promise(async (resolve) => {
        await api.authApi
          .profile()
          .then(async (res) => {
            if (res?.status) {
              user.value = res?.data || null
              await permissionlist()
              resolve(res)
            } else {
              return Promise.reject(res)
            }
          })
          .catch((err) => {
            console.log(err)
            storage.removeAll()
            resolve(err)
          })
      })
    }

    /**
     * @description: 添加需權限的路由
     */
    const permissionlist = async () => {
      const userRouter = user.value?.funcs.map((f) => f.routerName)
      userRouter?.push('index')
      permissionList?.forEach((r) => {
        if (userRouter?.some((u) => (r.name as string).includes(u))) {
          router.addRoute(r.meta!.page!.name, r)
        }
      })
    }

    /**
     * @description: 登入
     */
    const login = async (loginForm: ILoginUser) => {
      const auth = {
        account: loginForm.account,
        password: loginForm.password,
      }
      return await api.authApi
        .login(auth)
        .then(async (res) => {
          if (res.status) {
            storage.set(CacheEnum.TOKEN_NAME, res.data.token)
            const routeName = !isEmpty(storage.get(CacheEnum.REDIRECT_ROUTE_NAME))
              ? storage.get(CacheEnum.REDIRECT_ROUTE_NAME)
              : '/'
            await getUser()
            router.push(routeName)
            notification.success({
              title: `歡迎 ${user.value?.uname}`,
            })
          }
          return res
        })
        .catch((err) => {
          console.log(err)
          return err
        })
    }

    /**
     * @description: 登出
     */
    const logout = () => {
      api.authApi
        .logout()
        .then((res) => {
          if (res.status) {
            permissionList.forEach((r) => {
              if (router.hasRoute(r.name!)) router.removeRoute(r.name!)
            })
            router.push('/login')
            storage.removeAll()
            user.value = null
            notification.success({
              title: '退出登入',
            })
          } else {
            return new Error(res.message)
          }
        })
        .catch((err) => {
          notification.error({
            title: '登出發生錯誤',
            subTitle: `詳情-${err}`,
          })
        })
    }

    return { user, getUser, login, logout, rememberUser }
  },
  {
    persist: {
      paths: ['user', 'rememberUser'],
    },
  },
)
