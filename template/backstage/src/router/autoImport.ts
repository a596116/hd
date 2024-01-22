import type { Router, RouteRecordRaw } from 'vue-router'

const autoloadModuleRoutes = () => {
  const modules: Record<
    string,
    {
      [key: string]: any
    }
  > = import.meta.glob('./module/**/*.ts', { eager: true })
  const routes = [] as RouteRecordRaw[]
  Object.keys(modules).forEach((key) => {
    modules[key].default.children.forEach((route: RouteRecordRaw) => {
      route.meta!.page = modules[key].default.page
      routes.push(route)
    })
  })
  return routes
}

export const permissionList = [] as RouteRecordRaw[]
let routes = autoloadModuleRoutes()

export default async (router: Router) => {
  // const authStore = useAuthStore()
  // const userRouter = authStore.user?.funcs.map((f) => f.routerName)
  // userRouter?.push('index')
  // routes = routes.filter((r) => {
  //     return userRouter?.some((u) => (r.name as string).includes(u))
  // })
  routes.forEach((r) => {
    permissionList.push(r)
  })
  // routes.forEach((route) => { // 添加一般的路由
  //     router.addRoute(route.meta?.page?.name!, route)
  // })
}
