import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// 版权声明 (开发者控制台可见)
const copyrightStyle = 'color: #9f6a2f; font-size: 12px; font-family: "Noto Serif SC", serif; padding: 4px 0;';
console.log('%c传承经典 - 诗词大赛双屏互动系统\n%cCopyright © 2026 申浩然 保留所有权利', 
  'color: #5d7a68; font-size: 16px; font-weight: bold; font-family: "Noto Serif SC", serif; padding-bottom: 4px;',
  copyrightStyle
);

// 路由配置
const routes = [
  {
    path: '/',
    redirect: '/admin'
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('./views/Admin.vue')
  },
  {
    path: '/screen',
    name: 'Screen',
    component: () => import('./views/Screen.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')
