import { createRouter, createWebHistory } from 'vue-router'
import { RouteName } from '@/constants/globals'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: RouteName.HOME,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/HomeView.vue'),
    },
    {
      path: '/examples',
      name: RouteName.EXAMPLES,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ExamplesView.vue'),
    },
    {
      // Data tables viewer
      path: '/table/:tableSlug',
      name: RouteName.TABLE,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/TableView.vue'),
    },
    {
      // Data table actions (create, edit, inspect)
      path: '/action/:tableSlug/:actionSlug/:id?',
      name: RouteName.ACTION,
      meta: { layout: 'MenuLayout' },
      component: () => import('../views/ActionView.vue'),
    },
    {
      // Report for id on tables
      path: '/report/:tableSlug/:id?',
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
