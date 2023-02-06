import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/constants/globals'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.DASHBOARD,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/data/:tableSlug', // Data table
      name: RouteName.DATA,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/DataView.vue'),
    },
    {
      path: '/action/:tableSlug/:actionSlug/:id?', // Data table actions (create, edit, inspect, etc.)
      name: RouteName.ACTION,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionView.vue'),
    },
    {
      path: '/report/:tableSlug/:id?', // Reports for id on tables
      name: RouteName.REPORT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ReportView.vue'),
    },
    {
      path: '/settings',
      name: RouteName.SETTINGS,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/SettingsView.vue'),
    },
    {
      path: '/faq',
      name: RouteName.FAQ,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/FAQView.vue'),
    },
    {
      path: '/about',
      name: RouteName.ABOUT,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/:pathMatch(.*)*', // 404 Not Found
      name: RouteName.NOT_FOUND,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/NotFoundView.vue'),
    },
  ],
})

export default router
