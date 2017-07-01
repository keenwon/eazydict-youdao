'use strict';

/**
 * mock node-fetch
 * 单元测试时候使用
 */

const fs = require('fs');
const path = require('path');
const FetchError = require('node-fetch/lib/fetch-error');

const NETWORK_ERROR = 'network_error';

const defaultDataPath = path.resolve(__dirname, '../mock/en_world.html');
let currentDataPath = defaultDataPath;

/**
 * mock fetch 方法
 */
function fetch() {
  return new Promise((resolve, reject) => {
    if (currentDataPath.includes(NETWORK_ERROR)) {
      return reject(new FetchError());
    }

    fs.readFile(currentDataPath, function (err, data) {
      if (err) {
        return reject(err);
      }

      resolve({
        text() {
          return data.toString();
        }
      })
    });
  });
}

/**
 * 重置 mock 数据
 */
fetch.resetData = function (type) {
  try {
    currentDataPath = path.resolve(__dirname, `../mock/${type}.html`);
  } catch (error) {
    currentDataPath = defaultDataPath;
  }
};

module.exports = fetch;