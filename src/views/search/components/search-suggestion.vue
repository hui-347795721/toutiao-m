<template>
  <div class="search-suggestion">
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/serach'

// 按需加载 只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  name: 'searchSuggestion',
  //  父组件
  // :search-text=searchText   searchText是父组件要传递的值
  // 子组件用props接收，search-text JS 用驼峰命名法, html码用-
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  created () {

  },
  watch: {
    searchText: {
      // 当 searchText 发生改变的时候就会调用 handler 方法
      // handler 函数是固定语法
      // debounce 2个参数，第一个为函数，第二个为时间
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true // 该回调将会在侦听开始之后被立即调用
    }
  },
  methods: {
    async loadSearchSuggestions (q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
        // console.log(data)
      } catch (err) {
        this.$toast('数据获取失败，请稍后重试')
      }
    },
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会被当作匹配字符串来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      // 参数 1： 匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数 2： 匹配模式，要写到字符串中

      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style scoped lang="less">
/deep/.active {
  color: #3296fa !important;
}
</style>
