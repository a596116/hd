import { defineStore } from 'pinia'
import router from '@/router'
import type { IMenu } from 'types/menu'
import type { RouteLocationNormalized, RouteMeta, RouteRecordRaw } from 'vue-router'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<IMenu[]>([])
  const historyMenus = ref<IMenu[]>([])
  const route = ref<RouteMeta | null>(null)
  const isMenuCollapse = ref<boolean>(false)
  const isHistoryCollapse = ref<boolean>(false)
  const isBreadcrumbCollapse = ref<boolean>(false)


  const init = (page: string) => {
    getMenuByRoute(page)
    historyMenus.value = getHistoryMenu()
  }

  const getHistoryMenu = () => {
    const routes = [] as RouteRecordRaw[]
    router.getRoutes().map((r) => routes.push(r))
    const menus = historyMenus.value ?? []
    return menus.filter((m) => {
      return routes.filter((r) => r.name === m.route)
    })
  }

  const addHistoryMenu = (r: RouteLocationNormalized) => {
    if (!r.meta?.menu) return
    if (r.meta?.menu.hiddenHistory) return
    if (!isHistoryCollapse.value) return
    route.value = r.meta
    const menu: IMenu = { ...r.meta?.menu, route: r.name as string }
    const index = Object.entries(historyMenus.value!).findIndex(([key, value]) => value.route === r.name)
    if (index !== -1) historyMenus.value.splice(index, 1)
    historyMenus.value.unshift(menu)
    if (historyMenus.value.length > 10) historyMenus.value.pop()
    historyMenus.value = [...historyMenus.value]
  }

  const removeHistoryMenu = (menu: IMenu) => {
    if (historyMenus.value.length === 1) return
    const index = historyMenus.value.indexOf(menu)
    historyMenus.value.splice(index, 1)
    historyMenus.value = [...historyMenus.value]
  }

  /**
   * @description: 根據路由獲取菜單
   */
  const getMenuByRoute = async (page: string) => {
    menus.value = router
      .getRoutes()
      .filter((route) => route.meta.page?.name === page && !route.meta.menu?.hiddenMenu)
      .sort((a, b) => {
        return (a.meta.number!) - (b.meta.number!)
      })
      .reduce((p: IMenu[], c) => {
        const cmeun = <IMenu>c.meta.page?.menu
        if (!~p.findIndex((t) => t.title == cmeun.title)) {// 去除重複的父路由菜單
          p.push({ ...cmeun, children: [] })
        }
        // 添加子路由菜單到對應的父路由
        p[p.findIndex(m => m.title == cmeun.title)].children?.push({ ...c.meta?.menu, route: (c.name as string) })
        return p
      }, [])
  }

  const toggleMenu = () => {
    isMenuCollapse.value = !isMenuCollapse.value
  }

  /**
   * @description: 開關歷史菜單
   */
  const toggleHistoryLink = () => {
    isHistoryCollapse.value = isHistoryCollapse.value
  }

  /**
   * @description: 開關麵包屑
   */
  const toggleBreadcrumb = () => {
    isBreadcrumbCollapse.value = isBreadcrumbCollapse.value
  }


  return { menus, historyMenus, route, isMenuCollapse, isHistoryCollapse, isBreadcrumbCollapse, init, addHistoryMenu, removeHistoryMenu, toggleMenu, toggleHistoryLink, toggleBreadcrumb }
},
  {
    persist: {
      paths: ['isMenuCollapse', 'route', 'isHistoryCollapse', 'isBreadcrumbCollapse', 'historyMenus'],
    }
  })
