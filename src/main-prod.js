// 导入vue
import Vue from 'vue'

// 默认导入App根组件
import App from './App.vue'

// 默认导入router.js
import router from './router.js'

// 导入饿了吗ui
// import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 导入动画样式表
// import './assets/css/animate.css'

// 导入axios
import axios from 'axios'

// // 导入TreeTable
import TreeTable from 'vue-table-with-tree-grid'

// // 导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'

// // 导入vue-quill-editor的样式
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// // 导入进度条NProgress包对应的js和css
import NProgress from 'nprogress'
// import 'nprogress/nprogress.css'

// 配置请求的基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// axios请求拦截
axios.interceptors.request.use(request => {
  // 在请求拦截中,调用进度条的展示函数
  NProgress.start()
  // 为所有请求统一添加请求头,携带字段Authorization
  request.headers.Authorization = window.sessionStorage.getItem('Authorization')
  return request
})

// axixos响应拦截
axios.interceptors.response.use(response => {
  // 在响应拦截中,调用进度条的隐藏函数
  NProgress.done()
  return response
})

// 全局axios
Vue.prototype.axios = axios

// 全局组件tree-table
Vue.component('tree-table', TreeTable)

// 全局注册富文本组件
Vue.use(VueQuillEditor)

// 时间格式的过滤器, 年月日，时分秒
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')
  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

// vue的实例
new Vue({
  router,
  // render: h => h(App)
  render (createElement) {
    return createElement(App)
  }
}).$mount('#app')
