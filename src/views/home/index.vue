<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        class="search-btn"
        slot="title"
        type="info"
        size="small"
        round
        icon="search"
        to="/search"
        >搜索
      </van-button>
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- swipeable 是否开启手势滑动切换  -->
    <!-- animated 是否开启切换标签内容时的转场动画-->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表  接收父亲传递参数 在子组件article-list中定义channel-->
        <article-list ref="article-list" :channel="item" />
      </van-tab>
      <!-- 站位符 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 图标 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChannelEditShow = true"
      >
        <i class="toutiao icongengduo"></i>
      </div>
    </van-tabs>

    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :myChannele="channels"
        :active="active"
        @update-active="onUpdateActive"
      ></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './compconents/article-list.vue'
import ChannelEdit from './compconents/channel-edit.vue'
import { mapState } from 'vuex'
import { getItem } from '@/utils/storage.js'

export default {
  name: 'HomePage',
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false // 控制编辑频道弹出层的显示状态
    }
  },
  components: {
    ArticleList,
    ChannelEdit

  },
  computed: {
    ...mapState(['user'])
  },
  created () {
    this.loadChannels()
  },
  mounted () {

  },
  methods: {
    // 获取频道列表
    async loadChannels () {
      // try {
      //   const { data } = await getUserChannels()
      //   this.channels = data.data.channels
      // } catch (err) {
      //   this.$toast('获取频道数据失败')
      // }
      let channels = []

      if (this.user) {
        // 已登录，请求获取用户频道列表
        const { data } = await getUserChannels()
        channels = data.data.channels
      } else {
        // 未登录，判断是否有本地的频道列表数据
        const localChannels = getItem('TOUTIAO_CHANNELS')
        // 如果存在本地的频道列表数据
        if (localChannels) {
          channels = localChannels
        } else {
          // 没有，请求获取默认频道列表
          const { data } = await getUserChannels()
          channels = data.data.channels
        }
      }

      this.channels = channels
    },
    onUpdateActive (index, isChannelEditShow = true) {
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  }
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 110px;
  .van-icon-search {
    color: white;
  }
  /deep/ .van-nav-bar__title {
    max-width: unset;
  }
  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      z-index: 1;
      left: 0;
      right: 0;
      height: 82px;
    }

    .van-tab {
      min-width: 200px;
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }

    .van-tab--active {
      color: #333333;
    }

    .van-tabs__nav {
      padding-bottom: 0;
    }

    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
  }
  .hamburger-btn {
    position: fixed;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    widows: 66px;
    height: 82px;
    background-color: #fff;
    opacity: 0.902;
    i.toutiao {
      font-size: 33px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 0;
      width: 1px;
      height: 100%;
      background-image: url(~@/assets/gradient-gray-line.png);
      background-size: contain;
    }
  }
  .placeholder {
    flex-shrink: 0;
    width: 66px;
    height: 82px;
  }
}
</style>
