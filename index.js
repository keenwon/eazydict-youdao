'use strict';

const debug = require('./lib/debug');
const fetch = require('./lib/fetch');
const parser = require('./lib/parser');
const assign = require('lodash.assign');
const defaultConfigs = require('./defaultConfig');
const {
  EDOutput,
  CODES
} = require('eazydict-standard-output');

/**
 * 入口
 */
function main(words, userConfigs) {
  debug('run with arguments %O', {
    words,
    userConfigs
  });

  let configs = assign({}, defaultConfigs, userConfigs);

  debug('use configs %O', configs);

  if (!words) {
    return Promise.reject(new Error('请输入要查询的文字'));
  }

  // 编码
  let keywords = encodeURIComponent(words);

  const url = `http://www.youdao.com/w/eng/${keywords}`;
  debug(`fetch url ${url}`);

  return fetch(url, configs)
    .then(body => parser(body, configs))
    .catch(error => {
      if (error.name === 'FetchError') {
        return new EDOutput(CODES.NETWORK_ERROR);
      }

      return new EDOutput(CODES.OTHER);
    })
    .then(output => {
      // 添加插件信息
      output.pluginName = 'Youdao';
      output.words = words;
      output.url = url;

      debug('output: %O', output);

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
