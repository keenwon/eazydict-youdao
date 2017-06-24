'use strict';

/**
 * mock node-fetch
 * 单元测试时候使用
 */

const fs = require('fs');
const path = require('path');

const successDataPath = path.resolve(__dirname, '../mock/data_success.html');
const errorDataPath = path.resolve(__dirname, '../mock/data_error.html');

let currentDataPath = successDataPath;

/**
 * mock fetch 方法
 */
function fetch() {
  return new Promise((resolve, reject) => {
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
function resetData(type) {
  switch (type) {
    case 'success':
      currentDataPath = successDataPath;
      break;
    case 'error':
      currentDataPath = errorDataPath;
      break;
    default:
      currentDataPath = successDataPath;
      break;
  }
}

module.exports = fetch;
exports.resetData = resetData;