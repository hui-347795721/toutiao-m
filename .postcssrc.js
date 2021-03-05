/**
 * PostCss 配置文件
 */
module.exports = {
  // 配置要使用的PostCSS插件
  plugins: {
    // 配置使用autoprefixer插件
    // 作用：生成浏览器CSS样式规则前缀
    // vue-cli内部已经配置了一次。autoprefixer插件，所以冲突了
    // 'autoprefixer': {
    //   // autoprefixer插件的配置，配置要兼容到的环境
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 配置使用 pxtorem-pxtorem 插件
    // 把px转为REM
    // 因为 Vant 是基于 375 写的，所以如果你设置为 75 的话，Vant 的样式就小了一半。- 如果是 Vant 的样式，就把 rootValue 设置为 37.5 来转换
    // - 如果是我们的样式，就按照 75 的 rootValue 来转换
    'postcss-pxtorem': {
      /* 通过查阅文档我们可以看到 rootValue 支持两种参数类型
    
    - 数字：固定值
    - 函数：动态计算返回
      - postcss-pxtorem 处理每个 CSS 文件的时候都会来调用这个函数
      - 它会把被处理的 CSS 文件相关的信息通过参数传递给该函数
     */
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 需要转换的CSS属性。*代表所有
      propList: ['*'],
      // 配置不需要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}