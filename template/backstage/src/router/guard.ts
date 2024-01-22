import { CacheEnum } from '@/enum/cacheEnum'
import { useCommonStore } from '@/stores/common'
import getPageTitle from '@/utils/getPageTitle'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import type { RouteLocationNormalized, Router } from 'vue-router'

NProgress.configure({ showSpinner: false })

class Guard {
  constructor(private router: Router) {}
  public run() {
    this.router.beforeEach(this.beforeEach.bind(this))
    this.router.afterEach(this.afterEach.bind(this))
    this.router.onError(this.onError.bind(this))
    this.router.beforeResolve(this.beforeResolve.bind(this))
  }

  private async beforeEach(to: RouteLocationNormalized, from: RouteLocationNormalized) {
    NProgress.start()
    document.title = getPageTitle(to.meta.menu?.title!)
    // if (to.name !== 'login' && !this.token()) {
    //   storage.set(CacheEnum.REDIRECT_ROUTE_NAME, to.path)
    //   return { name: 'login' }
    // }
    if (to.meta.guest && this.token()) return from
  }

  private afterEach() {
    NProgress.done()
  }

  private onError(error: any) {
    NProgress.done()
    // ElNotification.error({
    //   title: '路由錯誤',
    //   message: error.message,
    // })
  }

  private beforeResolve(to: RouteLocationNormalized, from: RouteLocationNormalized, next: any) {
    if (useCommonStore().formEdit.isFormEdit) {
      mesBox
        .warning({
          title: '尚未保存表單',
          subTitle: '是否離開此頁面？',
          showCancelButton: true,
        })
        .then(() => {
          useCommonStore().setIsFormEdit(false)
          next()
        })
        .catch(() => {
          next(false)
        })
    } else {
      useCommonStore().setIsFormEdit(false)
      next()
    }
  }

  private token(): string | null {
    return storage.get(CacheEnum.TOKEN_NAME)
  }
}

export default (router: Router) => {
  new Guard(router).run()
}
