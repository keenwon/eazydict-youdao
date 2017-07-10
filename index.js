'use strict';

const fetch = require('./lib/fetch');
const parser = require('./lib/parser');
const {
  EDOutput,
  CODES
} = require('eazydict-standard-output');

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

  return fetch(url)
    .then(body => parser(body))
    .catch(error => {
      if (error.name === 'FetchError') {
        return new EDOutput(CODES.NETWORK_ERROR);
      }

      return new EDOutput(CODES.OTHER);
    })
    .then(output => {
      // 添加插件信息
      output.pluginName = 'Youdao';
      output.url = url;

      return output;
    });
}

if (require.main === module) {
  // istanbul ignore next
  let word = process.argv.slice(2).join(' ');

  main(word)
    .then(result => {
      console.log(result); // eslint-disable-line no-console
    });
} else {
  module.exports = main;
}
