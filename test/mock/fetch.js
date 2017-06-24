'use strict';

/**
 * mock node-fetch
 * 单元测试时候使用
 */
module.exports = function () {
  return Promise.resolve({
    text() {
      return '';
    }
  });
}