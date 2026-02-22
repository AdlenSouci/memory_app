import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import ThemeView from '../views/ThemeView.vue'
import RevisionView from '../views/RevisionView.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/category/:id',
      name: 'category',
      component: CategoryView
    },
    {
      path: '/theme/:id',
      name: 'theme',
      component: ThemeView
    },
    {
      path: '/revision/:id',
      name: 'revision',
      component: RevisionView
    }
  ]
})

export default router