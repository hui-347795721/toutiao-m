import Vue from 'vue'
import Vuex from 'vuex'

// 导入本地存储中封装的 setItem, getItem 方法
import { setItem, getItem } from '../utils/storage.js'
Vue.use(Vuex)

const TOKNE_KEY = 'TOUTIAO_USER'

export default new Vuex.Store({
  state: {
    // 存储当前登录的用户信息
    user: getItem(TOKNE_KEY)
  },
  mutations: {
    // 对 user 进行修改
    setUser (state, data) {
      state.user = data
      // 为了防止刷新丢失，我们需要把数据备份到本地存储
      setItem(TOKNE_KEY, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
