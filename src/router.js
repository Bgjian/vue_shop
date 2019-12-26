import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/home', component: Home }
  ]
})

// 挂载路由导航守卫(登录拦截)
router.beforeEach((to, from, next) => {
  // to 将要访问的路径
  // from 从哪个路路径跳转过来
  // next 方法,参数为空表示放行,参数为路径,强制跳转到该位置

  if (to.path === '/login') return next()
  // 验证sessionStorage中的token是否存在
  const tokenStr = window.sessionStorage.getItem('Authorization')
  if (!tokenStr) return next('/login')
  next()
})

export default router
