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
  proxy: false
};