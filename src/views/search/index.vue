<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <form action="/" class="search-form">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
        background="#3296fa"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 -->
    <search-result
      v-if="isResultShow"
      :search-text="searchText"
    ></search-result>

    <!-- 联想建议 -->
    <search-suggestion
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    ></search-suggestion>

    <!-- 搜索历史记录 -->
    <search-history
      v-else
      :search-histories="searchHistories"
      @clear-search-histories="searchHistories = []"
      @search="onSearch"
    ></search-history>
  </div>
</template>

<script>
import searchHistory from './components/search-history'
import searchSuggestion from './components/search-suggestion'
import searchResult from './components/search-result'
import { setItem, getItem } from '@/utils/storage'
export default {
  name: 'SearchIndex',
  components: {
    searchHistory,
    searchSuggestion,
    searchResult
  },
  data () {
    return {
      searchText: '', // 用户输入的数据
      isResultShow: false, // 控制搜索结果的显示状态
      searchHistories: getItem('TOUTIAO_SEARCH_HISTORY') || [] // 存储历史记录
    }
  },
  watch: {
    searchHistories (value) {
      // 同步搜索数据到本地
      setItem('TOUTIAO_SEARCH_HISTORY', value)
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {
    onSearch (val) {
      // 更新文本框的内容
      this.searchText = val

      // 存储搜索历史记录
      // 不要有重复历史记录、最新的排在最前面
      const index = this.searchHistories.indexOf(val)
      if (index !== -1) {
        this.searchHistories.splice(index, 1)
      }

      this.searchHistories.unshift(val)

      // 渲染搜索结果
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style scoped lang="less">
.search-container {
  padding-top: 108px;

  .van-search__action {
    color: #fff;
  }

  .search-form {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
  }
}
</style>
