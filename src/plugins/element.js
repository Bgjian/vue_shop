import Vue from 'vue'
// 按需引入饿了吗UI组件组件
import { Button, Form, FormItem, Input, Message, Container, Header, Aside, Main, Menu, Submenu, MenuItem, Popover, MessageBox, RadioGroup, RadioButton, Breadcrumb, BreadcrumbItem, Card, Row, Col, Table, Pagination, TableColumn, Switch, Tooltip, Dialog, Tag, Tree, Select, Option, Carousel, CarouselItem, Cascader, Alert, Tabs, TabPane } from 'element-ui'

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
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(Pagination)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)

// 在vue的原型上挂载$message,$confirm
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
