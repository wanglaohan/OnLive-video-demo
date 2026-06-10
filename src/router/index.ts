/*
 * @Author: jiansuiwang@rastar.com
 * @Date: 2026-04-29 23:20:50
 * @LastEditors: jiansuiwang@rastar.com
 * @LastEditTime: 2026-05-03 01:55:28
 * @FilePath: \onLiveVideo\src\router\index.ts
 */
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (to.meta.hideNav) {
      return { top: 0 };
    }
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/for-you',
      name: 'for-you',
      component: () => import('@/views/ForYouView.vue'),
    },
    {
      path: '/my-list',
      name: 'my-list',
      component: () => import('@/views/MyListView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/player/:id',
      name: 'player',
      component: () => import('@/views/PlayerView.vue'),
      meta: { hideNav: true },
    },
    {
      path: '/series/:id',
      name: 'series-detail',
      component: () => import('@/views/SeriesDetailView.vue'),
      meta: { hideNav: true },
    },
    {
      path: '/debug',
      name: 'debug',
      component: () => import('@/views/DebugView.vue'),
      meta: { hideNav: true },
    },
  ],
});

export default router;
