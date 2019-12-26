import Vue from 'vue'
// 按需引入饿了吗UI组件组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Popover, MessageBox } from 'element-ui'

// vue全局注册组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Popover)

// 在vue的原型上挂载$message,$confirm
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
