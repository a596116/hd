import type { RouteRecordRaw } from 'vue-router'

export const routes = [
  {
    path: '/',
    name: 'admin',
    redirect: '/',
    component: () => import('@/layouts/admin.vue'),
    meta: { auth: true },
    children: [
      {
        name: 'admin/index',
        path: '/',
        component: () => import('@/views/index.vue'),
        meta: { menu: { title: '首頁', hiddenMenu: true } },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true, menu: { title: '登入' } },
  },
  {
    path: '/:any(.*)',
    name: 'notFound',
    component: () => import('../views/error/404.vue'),
  },
] as RouteRecordRaw[]
