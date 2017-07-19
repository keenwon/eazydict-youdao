'use strict';

/**
 * 插件默认配置
 */
module.exports = {
  // 请求重试次数
  retries: 2,

  // 超时 单位毫秒
  timeout: 5000,

  /**
   * 代理设置，支持 socks5，http，https
   *    关闭: false
   *    开启: 'socks://127.0.0.1:1080'
   */
  proxy: false,

  output: {
      /**
       * 是否显示例句
       *    不显示：0
       *    不限: -1
       *    其他为设置具体条数
       */
      examples: 2,

      // 是否显示音标
      phonetics: -1,

      // 是否显示翻译
      translates: -1
  }
};