import type { RouteRecordRaw } from 'vue-router'
export default {
  page: {
    auth: true,
    name: 'admin',
    menu: {
      title: '控制台',
      icon: 'dashboard',
    },
  },
  children: [
    {
      name: 'admin/dashboard',
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: {
        menu: { title: '控制台' }
        , number: 1,
      },
    },
  ],
} as { page: any, children: RouteRecordRaw[] }
