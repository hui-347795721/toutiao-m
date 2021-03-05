<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" class="page-nav-bar">
      <van-icon
        slot="left"
        name="cross"
        color="white"
        @click="$router.back()"
      />
    </van-nav-bar>
    <!-- 登录表单 -->
    <van-form ref="loginFrom" @submit="onSubmit">
      <van-field
        name="mobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        left-icon="smile-o"
        :rules="userFromRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao iconshouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFromRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao iconyanzhengma"></i>
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            class="send-sms-bth"
            round
            size="small"
            type="default"
            @click="onSendSms"
            native-type="button"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div style="margin: 16px" class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'

export default {
  name: 'LoginPage',
  components: {},
  props: {},
  data () {
    return {
      user: {
        mobile: '', // 手机号
        code: ''// 验证码
      },
      userFromRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      // 控制倒计时开关
      isCountDownShow: false
    }
  },
  computed: {},
  watch: {},
  created () { },
  mounted () { },
  methods: {
    async onSubmit (values) {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
      })

      // 3.提交表单请求登录
      try {
        const { data } = await login(user)
        this.$store.commit('setUser', data.data)
        this.$toast.success('登录成功')
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或者验证码错误')
        } else {
          this.$toast.fail('登录失败,请稍后重试', err)
        }
      }
      // 4.根据响应后续操作
    },
    // 发送验证码
    async onSendSms () {
      // 1.验证手机号
      try {
        await this.$refs.loginFrom.validate('mobile')
        console.log('验证通过')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true
      // 发起验证码请求
      try {
        await sendSms(this.user.mobile)
        this.$$toast('发送成功')
      } catch (err) {
        // 发送失败关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast('发送太频繁，请稍后重试')
        } else {
          this.$toast('发送失败，请稍后重试')
        }
      }
    }

  }
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-bth {
    width: 180px;
    font-size: 24px;
    color: #666;
    background-color: #ededed;
  }
  .login-btn-wrap {
    padding: 55px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
