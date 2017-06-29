'use strict';

const cheerio = require('cheerio');
const {
  EazydictStandardOutput,
  Phonetic,
  Translate
} = require('./EazydictStandardOutput');
const {
  removeTagsAndSpaces
} = require('./utils');

let $;

/**
 * 解析 HTML
 */
function parser(html) {
  $ = cheerio.load(html, {
    decodeEntities: false
  });

  let $containor = $('#phrsListTab');

  const output = new EazydictStandardOutput();

  /**
   * containor 为空，可能是：
   *    1.中英混合单词
   *    2.错误页
   */
  if (!$containor || !$containor.length) {
    return output;
  }

  output.phonetics = _parsePhonetics($containor);
  output.translates = _parseTrans($containor);

  return output;
}

/**
 * 提取音标
 */
function _parsePhonetics($containor) {
  let phonetics = [];

  $containor.find('.pronounce').each((index, item) => {
    let content = removeTagsAndSpaces($(item).html());

    if (!content) {
      return;
    }

    let data = content.split(' ');
    let phonetic = new Phonetic(...data);

    phonetics.push(phonetic);
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
      result = new Translate(...array);
    } else {
      result = new Translate('', text);
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
      let tran = new Translate(...array);

      trans.push(tran);
    });
  }

  return trans;
}

module.exports = parser;