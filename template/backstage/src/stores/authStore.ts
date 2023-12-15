import type { ILoginUser, IRegisterUser } from '@/apis/authApi'
import { defineStore } from 'pinia'
import { permissionList } from '@/router/autoImport'
import router from '@/router'
import { CacheEnum } from '@/enum/cacheEnum'
import { ElMessage } from 'element-plus'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<null | IUser>(null)
  const userId = ref<number>()

  /**
   * @description: 獲取用戶資訊 
   */
  const getUser = async () => {
    return new Promise(async (resolve) => {
      await api.authApi.info(userId.value!)
        .then(async (res) => {
          if (res.code == 200) {
            user.value = res.data
            await permissionlist()
            resolve(res)
          } else {
            console.log('未獲取到用戶資訊')
            storage.removeAll()
            resolve(res)
          }
        })
        .catch((err) => {
          console.log(err)
          storage.removeAll()
          resolve(null)
        })
    })
  }

  /**
   * @description: 添加需權限的路由
   */
  const permissionlist = async () => {
    permissionList.forEach((r) => {
      if (getUserPermission().includes(r.meta?.permission!)) {
        router.addRoute(r.meta!.page!.name, r)
      }
    })
  }

  /**
   * @description: 獲取用戶權限
   */
  const getUserPermission = () => {
    return user.value?.UserRole[0].role.RolePermission.map((p) => p.permission.name) || []
  }

  const login = async (loginForm: ILoginUser) => {
    const auth = {
      account: loginForm.account,
      password: loginForm.password
    }
    await api.authApi.login(auth)
      .then(async (res) => {
        if (res.code == 200) {
          storage.set(CacheEnum.TOKEN_NAME, res.data.token)
          userId.value = res.data.userId
          const routeName = storage.get(CacheEnum.REDIRECT_ROUTE_NAME) ?? 'admin'
          await getUser()
          if (user.value?.status) { //檢查用戶狀態
            router.push({ name: routeName })
            ElMessage.success(`歡迎 ${user.value?.name}`)
          } else {
            storage.remove(CacheEnum.TOKEN_NAME)
            userId.value = undefined
            ElMessage.error('您以被停權，請聯繫管理員')
          }
        } else {
          ElMessage.error('帳號或密碼錯誤')
        }
      })
      .catch((err) => {
        ElMessage.error(`登入發生錯誤，詳情-${err}`)
        console.error(err)
      })
  }

  const registUser = async (userForm: IRegisterUser) => {
    await api.authApi.regist(userForm)
      .then(res => {
        if (res.code == 200) {
          login(userForm)
        }
      })
  }

  const logout = () => {
    permissionList.forEach((r) => {
      if (router.hasRoute(r.name!)) router.removeRoute(r.name!)
    })
    router.push('/login')
    storage.removeAll()
    user.value = null
    ElMessage.success('退出登入')
  }


  return { userId, user, getUser, login, registUser, logout, getUserPermission }
}, {
  persist: {
    paths: ['userId'],
  }
})
