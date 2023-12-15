import axios, { type AxiosRequestConfig } from 'axios'
import { CacheEnum } from '@/enum/cacheEnum'
import router from '@/router'
import axiosRetry from 'axios-retry'
import { ElLoading, ElMessage } from 'element-plus'
import { useErrorStore } from '@/stores/errorStore'
import { HttpStatus } from '@/enum/HttpStatus'

export default class Axios {
  private instance
  private loading: Array<any> = []
  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)
    axiosRetry(this.instance, { retries: 3 /*, retryDelay: 1000 */ })
    this.interceptors()
  }

  public async request<T, D = T extends responseResult<T> ? responseResult<T> : responseData<T>>(config: AxiosRequestConfig): Promise<D> {
    return new Promise(async (resolve, reject) => {
      try {
        const res = await this.instance.request<D>(config)
        resolve(res.data)
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
      (config: AxiosRequestConfig) => {
        this.loading.push(ElLoading.service({
          text: '加載中...',
          background: 'rgba(0,0,0,0)'
        }))
        useErrorStore().resetError()
        config.headers = {
          Authorization: 'Bearer ' + storage.get(CacheEnum.TOKEN_NAME),
          Accept: 'application/json',
          'Content-Type': 'application/json',
        }
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
        if (response.data?.message) {
          ElMessage({
            type: response.data.code === 200 ? 'success' : 'error',
            message: response.data.message,
            grouping: true,
            duration: 2000,
          })
        }
        this.loading.forEach(l => l.close())
        return response
      },
      (error) => {
        this.loading.forEach(l => l.close())
        const {
          response: { status, data },
        } = error
        const { messages }: { messages: { field: string, message: string }[] } = data
        switch (status) {
          case HttpStatus.UNAUTHORIZED:
            storage.remove(CacheEnum.TOKEN_NAME)
            router.push({ name: 'login' })
            break
          case HttpStatus.BAD_REQUEST:
            messages.forEach((m) => {
              ElMessage.error({ message: m.message })
            })
            break
          case HttpStatus.UNPROCESSABLE_ENTITY:
            useErrorStore().setErrors(error.response.data.errors)
            break
          case HttpStatus.FORBIDDEN:
            ElMessage.error({ message: messages[0].message ?? '沒有操作權限' })
            break
          case HttpStatus.NOT_FOUND:
            router.push({ name: 'notFound' })
            break
          case HttpStatus.TOO_MANY_REQUESTS:
            ElMessage.error({ message: messages[0].message ?? '操作過於頻繁，請稍候在嘗試' })
            break
          default:
            if (messages) {
              ElMessage.error({ message: messages[0].message ?? '服務器錯誤' })
            }
            return Promise.reject(error)
        }
      }
    )
  }
}
