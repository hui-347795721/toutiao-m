<template>
  <div class="article-list">
    <van-pull-refresh
      v-model="isLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        @load="onLoad"
      >
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        ></article-item>
        <!--
          <van-cell
          v-for="(article, index) in list"
          :key="index"
          :title="article.title"
        />
        -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
/**
1. List 组件通过 loading 和 finished 两个变量控制加载状态

2. 当组件初始化或滚动到到底部时，会触发 load 事件并将 loading 设置成 true，此时可以发起异步操作并更新数据，数据更新完毕后，将 loading 设置成 false 即可，若数据已全部加载完毕，则直接将 finished 设置成 true 即可。
3. load 事件
   - List 初始化后会触发一次 load 事件，用于加载第一屏的数据。
   - 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，List 会继续触发 load 事件，直到内容铺满屏幕或数据全部加载完成。
4. loading 属性：控制加载中的 loading 状态

   - 非加载中，loading 为 false，此时会根据列表滚动位置判断是否触发 load 事件（列表内容不足一屏幕时，会直接触发）
   - 加载中，loading 为 true，表示正在发送异步请求，此时不会触发 load 事件

5. finished 属性：控制加载结束的状态
   - 在每次请求完毕后，需要手动将 finished 设置为 false，表示本次加载结束
   - 所有数据加载结束，finished 为 true，此时不会触发 load 事件
**/
import { getArticles } from '@/api/artcle'
import ArticleItem from '@/components/article-item'
export default {
  name: 'ArticleList',
  components: {
    ArticleItem
  },
  props: {
    channel: {
      type: Object,
      //  required 是否为必须
      required: true
    }
  },
  data () {
    return {
      list: [], // 存储列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求下一页数据的时间戳
      error: false, // 控制失败的提示状态
      isLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功提示文本
    }
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad
    async onLoad () {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: this.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data
        //  展开数组
        this.list.push(...results)
        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false
        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了，设置加载状态结束，不再触发上拉加载更多了
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示
        this.error = true
        this.loading = false
      }
    },
    // 当下拉刷新的时候会触发调用该函数
    async onRefresh () {
      try {
        // 请求获取数据
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.channel.id, // 频道 id
          timestamp: Date.now(), // 下拉刷新，每次请求获取最新数据，所以传递当前最新时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        })

        // 2. 将数据追加到列表的顶部
        const { results } = data.data
        this.list.unshift(...results)

        // 3. 关闭下拉刷新的 loading 状态
        this.isLoading = false
        // 更新下拉刷新成功提示的文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (err) {
        this.refreshSuccessText = '刷新失败'
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped lang="less">
// - 在移动端，视口单位相对于布局视口
// - 1vw = 可视窗口宽度的百分之一，比如窗口宽度是 750，则 1vw = 7.5px
// - 1vh = 可视窗口宽度的百分之一，比如窗口宽度是 667，则 1vw =  6.67px

.article-list {
  height: 79vh;
  // 溢出滚动
  overflow-y: auto;
}
</style>
