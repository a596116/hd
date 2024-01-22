import { http } from '@/plugins/axios'

export interface ILoginUser {
  account: string
  password: string
  rememberMe?: boolean
}

export interface IAlterUserPassword {
  password: string
  newpassword: string
}

export interface Login {
  token: string
  uname: string
  funcs: {
    title: string
    iconName: string
    routerName: string
    children: {
      title: string
      iconName: string
      routerName: string
    }[]
  }[]
}

enum Api {
  default = 'backstage/accounts/login',
  logout = 'backstage/accounts/logout',
  profile = 'backstage/users/user_funcs',
  alterUserPassword = 'backstage/accounts/pawd',
}

class authApi {
  /**
   * @description: 用戶登入
   */
  login(loginForm: ILoginUser) {
    return http.request<Login>({
      url: `${Api.default}`,
      method: 'POST',
      data: loginForm,
    })
  }

  /**
   * @description: 用戶登出
   */
  logout() {
    return http.request({
      url: `${Api.logout}`,
      method: 'POST',
    })
  }

  profile() {
    return http.request<Login>({
      url: `${Api.profile}`,
      method: 'GET',
    })
  }

  /**
   * 修改用戶密碼
   * @date 2022-08-30
   */
  alterUserPassword(user: IAlterUserPassword) {
    return http.request({
      url: `${Api.alterUserPassword}`,
      method: 'PUT',
      data: user,
    })
  }
}

export default new authApi()
