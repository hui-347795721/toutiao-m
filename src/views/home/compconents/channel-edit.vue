<template>
  <div class="channel-edit">
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        @click="isEdit = !isEdit"
        class="edit-btn"
        type="danger"
        round
        size="mini"
        plain
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(item, index) in myChannele"
        :key="index"
        @click="onMyChannelClick(item, index)"
      >
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(item.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <!-- v-bind:class
      一个对象，对象中key->active表示要作用的css类名
                对象中的value要计算出布尔值
                true,则作用该类名
                false不作用
       -->
        <span class="text" slot="text" :class="{ active: index === active }">{{
          item.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <!-- 频道推荐 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recomment-grid">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="(item, index) in recommendChannele"
        :key="index"
        :text="item.name"
        @click="onAddChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, deleteUserChannel } from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'

export default {
  name: 'ChannelEdit',
  components: {},
  props: {
    myChannele: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑状态
      fiexdChannels: [0] // 不需要编辑、删除的频道
    }
  },
  created () {
    this.loadAllChannels()
  },
  mounted () {

  },
  computed: {
    // 计算属性会观测内部依赖项数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannele () {
      const channels = []
      this.allChannels.forEach(channel => {
        // 使用 find 遍历数组，找到满足条件的元素项
        const ret = this.myChannele.find(userChannels => {
          return userChannels.id === channel.id
        })

        // 如果我的频道中不包括该频道项，则收集到推荐频道中
        if (!ret) {
          channels.push(channel)
        }
      })
      // 把计算结果返回
      return channels
    },
    ...mapState(['user'])
    //   recommendChannele() {
    // // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中
    // return this.allChannels.filter(channel => {
    //   // const channel = []
    //   // 数组的 find 方法：遍历数组，把符合条件的第一个元素返回
    //   return !this.myChannels.find(myChannel => {
    //     return myChannel.id === channel.id
    //   })
    // })
    // }
  },
  methods: {
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data)
        this.allChannels = data.data.channels
      } catch (err) {
        console.log(err)
        this.$toast('获取所有频道数据失败')
      }
    },
    async onAddChannel (value) {
      this.myChannele.push(value)
      // 数据持久化处理
      if (this.user) {
        // 已登录，把数据请求接口放到服务器
        try {
          await addUserChannel({
            id: value.id, // 频道 ID
            seq: this.myChannele.length // 序号
          })
        } catch (error) {
          this.$toast('保存失败，请稍后再试')
        }
      } else {
        // 未登录，把数据存储到本地
        setItem('TOUTIAO_CHANNELS', this.myChannele)
      }
    },
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 如果是固定频道，不允许删除
        if (this.fiexdChannels.includes(channel.id)) {
          return
        }
        // 删除 频道
        this.myChannele.splice(index, 1)
        // 编辑状态，执行删除频道
        // 参数1：要删除的元素的开始索引
        // 参数2：要删除的个数，如果不指定，则从参数 1 开始一直删除
        if (index <= this.active) {
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理持久化操作
        this.deleteChannel(channel)
      } else {
        // 非编辑状态，指向切换频道
        this.$emit('update-active', index, false)
      }
    },
    // 删除频道
    async deleteChannel (channel) {
      try {
        if (this.user) {
          await deleteUserChannel(channel.id)
        } else {
          // 未登录，将数据更新到本地
          setItem('TOUTIAO_CHANNELS', this.myChannele)
        }
      } catch (error) {
        this.$toast('操作失败，请稍后重试')
      }
    }
  }
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 50px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;

      .van-grid-item__text,
      .text {
        font-size: 22px;
        color: #222;
        margin-top: 4px !important;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        right: -10px;
        top: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recomment-grid {
    .grid-item {
      width: 160px;
      height: 86px;
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 22px;
          line-height: 22px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
