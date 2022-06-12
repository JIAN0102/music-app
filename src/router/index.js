import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import ManageView from '@/views/ManageView.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/manage',
    name: 'manage',
    component: ManageView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/:catchAll(.*)*',
    redirect: { name: 'home' },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  if (!to.meta.requiresAuth) {
    next();
  } else if (store.state.userLoggedIn) {
    next();
  } else {
    next({ name: 'home' });
  }
});

export default router;
