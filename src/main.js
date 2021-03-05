import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 加载Vant
import Vant from 'vant'
import 'vant/lib/index.css'

// 加载全局样式
import './styles/index.less'

// 加载动态设置 REM 基准值
import 'amfe-flexible'
//  注册使用Vant组件库

//  加载dayjs
import './utils/dayjs'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
