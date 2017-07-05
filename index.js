'use strict';

const fetch = require('node-fetch');
const parser = require('./lib/parser');
const {
  EDOutput,
  CODES
} = require('eazydict-standard-output');

/**
 * 模拟浏览器的头信息
 */
/* eslint-disable max-len */
const headers = new fetch.Headers({
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Accept-Language': 'zh-CN,zh;q=0.8',
  'Cache-Control': 'max-age=0',
  'Connection': 'keep-alive',
  'Host': 'www.youdao.com',
  'Referer': 'http://www.youdao.com/?cookie=new',
  'Upgrade-Insecure-Requests': '1',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36'
});
/* eslint-enable max-len */

/**
 * 入口
 */
function main(word) {
  if (!word) {
    return Promise.reject(new Error('请输入要查询的文字'));
  }

  // 编码
  let keyword = encodeURIComponent(word);

  const url = `http://www.youdao.com/w/eng/${keyword}`;

  return fetch(url, { headers })
    .then(res => res.text())
    .then(body => parser(body))
    .catch(error => {
      if (error.name === 'FetchError') {
        return new EDOutput(CODES.NETWORK_ERROR);
      }

      return new EDOutput(CODES.OTHER);
    })
    .then(output => {
      // 添加插件信息
      output.pluginName = 'youdao';
      output.url = url;

      return output;
    });
}

module.exports = main;