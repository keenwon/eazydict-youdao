'use strict';

const cheerio = require('cheerio');

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
    trans.push($(item).text().split('. '));
  });

  /**
   * 可能是中文
   */
  if (!trans.length) {
    $containor.find('.wordGroup').each((index, item) => {
      let $span = $(item).find('span');
      let tran = [];

      $span.each(function (i) {
        tran.push($(this).text().trim());
      });

      trans.push(tran);
    });
  }

  return trans;
}

module.exports = parser;