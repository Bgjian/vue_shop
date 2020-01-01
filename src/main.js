// 导入vue
import Vue from 'vue'

// 默认导入App根组件
import App from './App.vue'

// 默认导入router.js
import router from './router.js'

// 导入饿了吗ui
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入动画样式表
import './assets/css/animate.css'

// 导入axios
import axios from 'axios'

// 导入TreeTable
import TreeTable from 'vue-table-with-tree-grid'

// 配置请求的基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
axios.interceptors.request.use(config => {
  // 为所有请求统一添加请求头,携带字段Authorization
  config.headers.Authorization = window.sessionStorage.getItem('Authorization')
  return config
})

// 全局axios
Vue.prototype.axios = axios

// 全局组件tree-table
Vue.component('tree-table', TreeTable)

Vue.config.productionTip = false

// vue的实例
new Vue({
  router,
  // render: h => h(App)
  render (createElement) {
    return createElement(App)
  }
}).$mount('#app')
