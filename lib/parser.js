'use strict';

const cheerio = require('cheerio');
const {
  removeTagsAndSpaces
} = require('./utils');

let $;

/**
 * 解析 HTML
 */
function parser(html) {
  $ = cheerio.load(html);
  let $containor = $('#phrsListTab');

  const output = {
    phonetics: [],
    trans: []
  };

  /**
   * containor 为空，可能是：
   *    1.中英混合单词
   *    2.错误页
   */
  if (!$containor) {
    return output;
  }

  output.phonetics = _parsePhonetics($containor);
  output.trans = _parseTrans($containor);

  return output;
}

/**
 * 提取音标
 */
function _parsePhonetics($containor) {
  let phonetics = [];

  $containor.find('.pronounce').each((index, item) => {
    let content = $(item).text().trim();

    if (!content) {
      return;
    }

    phonetics.push(
      content.split('\n')
        .map(i => i.trim())
        .filter(i => !!i)
    );
  });

  return phonetics;
}

/**
 * 提取翻译
 */
function _parseTrans($containor) {
  let trans = [];

  $containor.find('li').each((index, item) => {
    let text = $(item).text();
    let result;

    // 判断开头有没有词语类型 eg: n vt vi
    if (/^[a-z]+\./i.test(text)) {
      let array = $(item).text().split('. ');
      result = {
        type: array[0],
        tran: array[1]
      };
    } else {
      result = {
        type: '',
        trans: text
      };
    }

    trans.push(result);
  });

  /**
   * 可能是中文
   */
  if (!trans.length) {
    $containor.find('.wordGroup').each((index, item) => {
      let html = $(item).html();
      let array = removeTagsAndSpaces(html).split('. ');

      trans.push({
        type: array[0],
        trans: array[1]
      });
    });
  }

  return trans;
}

module.exports = parser;