import axios, {
  AxiosInstance,
  AxiosRequestHeaders,
  type AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios'
import { CacheEnum } from '@/enum/cacheEnum'
import router from '@/router'
import axiosRetry from 'axios-retry'
import { HttpStatus } from '@/enum/HttpStatus'
import { useCommonStore } from '@/stores/common'

export default class Axios {
  private instance: AxiosInstance
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    axiosRetry(this.instance, { retries: 3 /*, retryDelay: 1000 */ })
    this.interceptors()
  }

  public async request<T, D = T extends responseResult<T> ? responseResult<T> : responseData<T>>(
    config: AxiosRequestConfig,
  ): Promise<D> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.instance.request<D>(config)
        resolve(res?.data || ({} as D))
      } catch (error) {
        reject(error)
      }
    })
  }

  private interceptors() {
    this.interceptorsRequest()
    this.interceptorsResponse()
  }

  // 請求攔截
  private interceptorsRequest() {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        useCommonStore().loading = true
        config.headers = {
          Authorization: storage.get(CacheEnum.TOKEN_NAME)
            ? 'Bearer ' + storage.get(CacheEnum.TOKEN_NAME)
            : '',
          Accept: 'application/json',
          'Content-Type': 'application/json',
        } as AxiosRequestHeaders
        return config
      },
      (error) => {
        console.error('請求失敗')
        return Promise.reject(error)
      },
    )
  }

  // 響應攔截
  private interceptorsResponse() {
    this.instance.interceptors.response.use(
      async (response) => {
        setTimeout(() => {
          useCommonStore().loading = false
        }, 100)
        if (response.data?.message) {
          // ElMessage({
          //   type: response.data.code === 200 ? 'success' : 'error',
          //   message: response.data.message,
          //   grouping: true,
          //   duration: 2000,
          // })
        }
        return response
      },
      (error) => {
        setTimeout(() => {
          useCommonStore().loading = false
        }, 300)
        const {
          response: { status, data },
        } = error
        const { message } = data
        console.log(data)
        switch (status) {
          case HttpStatus.UNAUTHORIZED:
            storage.removeAll()
            router.push({ name: 'login' })
            break
          case HttpStatus.BAD_REQUEST:
            notification.error({ title: message })
            break
          case HttpStatus.FORBIDDEN:
            notification.error({ title: message ?? '沒有操作權限' })
            break
          case HttpStatus.NOT_FOUND:
            router.push({ name: 'notFound' })
            break
          case HttpStatus.TOO_MANY_REQUESTS:
            notification.error({ title: message ?? '操作過於頻繁，請稍候在嘗試' })
            break
          default:
            if (message) {
              notification.error({ title: message ?? '服務器錯誤' })
            }
            return Promise.reject(error)
        }
      },
    )
  }
}
