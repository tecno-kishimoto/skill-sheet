import { createRouter, createWebHistory } from 'vue-router'
import UserList from '../components/UserList.vue'
import UserDetails from '../components/UserDetails.vue' // UserDetailsをインポート

const routes = [
  {
    path: '/',
    name: 'UserList',
    component: UserList,
  },
  { // UserDetailsへのルートを追加
    path: '/users/:id',
    name: 'UserDetails',
    component: UserDetails,
    props: true // ルートパラメータをpropsとしてコンポーネントに渡す
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
