import dayjs from 'dayjs'
import Vue from 'vue'

// dayjs 默认是英文，配置成中文
// 加载中文语言包
import 'dayjs/locale/zh-cn'

import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale('zh-cn')// 全局使用
// 配置使用处理相对时间的插件
dayjs.extend(relativeTime)

// 全局过滤器：处理相对时间
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
})
