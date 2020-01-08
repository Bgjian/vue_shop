import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
// import Home from './components/Home.vue'
// import Welcome from './components/Welcome.vue'
// import Users from './components/Users.vue'
// import Roles from './components/Roles.vue'
// import Rights from './components/Rights.vue'
// import Goods from './components/Goods.vue'
// import GoodsAdd from './components/GoodsAdd.vue'
// import GoodsEdit from './components/GoodsEdit.vue'
// import Params from './components/Params.vue'
// import Categories from './components/Categories.vue'
// import Orders from './components/Orders.vue'
// import Reports from './components/Reports.vue'

// 路由组件的懒加载
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
const Users = () => import(/* webpackChunkName:"users" */ './components/Users.vue')
const Roles = () => import(/* webpackChunkName:"power" */ './components/Roles.vue')
const Rights = () => import(/* webpackChunkName:"power" */ './components/Rights.vue')
const Goods = () => import(/* webpackChunkName:"goods" */ './components/Goods.vue')
const GoodsAdd = () => import(/* webpackChunkName:"goods" */ './components/GoodsAdd.vue')
const GoodsEdit = () => import(/* webpackChunkName:"goods" */ './components/GoodsEdit.vue')
const Params = () => import(/* webpackChunkName:"goods" */ './components/Params.vue')
const Categories = () => import(/* webpackChunkName:"categories" */ './components/Categories.vue')
const Orders = () => import(/* webpackChunkName:"orders" */ './components/Orders.vue')
const Reports = () => import(/* webpackChunkName:"reports" */ './components/Reports.vue')

Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home',
      component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/roles', component: Roles },
        { path: '/rights', component: Rights },
        { path: '/goods', component: Goods },
        { path: '/goods/add', component: GoodsAdd },
        { path: '/goods/edit', component: GoodsEdit },
        { path: '/params', component: Params },
        { path: '/categories', component: Categories },
        { path: '/orders', component: Orders },
        { path: '/reports', component: Reports }
      ]
    }
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
