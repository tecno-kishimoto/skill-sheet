import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router' // Vue Router をインポート
import './style.css'
import { useUserStore } from './stores/userStore'
import { useProjectStore } from './stores/projectStore'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router) // Vue Router を登録

// アプリケーション初期化後にストアの初期データを設定
app.mount('#app')

// 初期データの設定
const userStore = useUserStore()
const projectStore = useProjectStore()
const userIds = userStore.users.map(user => user.id)
projectStore.initializeProjects(userIds)
