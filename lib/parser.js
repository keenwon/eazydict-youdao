'use strict';

const debug = require('./debug');
const cheerio = require('cheerio');
const {
  EDOutput,
  Phonetic,
  Translate,
  CODES
} = require('eazydict-standard-output');
const {
  removeTagsAndSpaces
} = require('./utils');

let $;

function main(html) {
  try {
    return parser(html);
  } catch (e) {
    return new EDOutput(CODES.PARSE_ERROR, e.message);
  }
}

/**
 * 解析 HTML
 */
function parser(html) {
  $ = cheerio.load(html, {
    decodeEntities: false
  });

  const $containor = $('#phrsListTab');
  const $webContainor = $('#webTrans');

  const output = new EDOutput();

  /**
   * containor 为空，可能是：
   *    1.中英混合单词
   *    2.错误页
   */
  if (!$containor || !$containor.length) {
    return output;
  }

  output.phonetics = _parsePhonetics($containor);

  let normalTrans = _parseNormalTrans($containor);
  let webTrans = _parseWebTrans($webContainor);
  output.translates = normalTrans.concat(webTrans);

  return output;
}

/**
 * 提取音标
 */
function _parsePhonetics($containor) {
  let phonetics = [];

  $containor.find('.pronounce').each((index, item) => {
    let html = $(item).html();
    let content = removeTagsAndSpaces($(item).html());

    debug(`phonetics parse html: ${html}`);
    debug(`phonetics parse content: ${content}`);

    if (!content) {
      return;
    }

    let data = content.split(' ');
    let phonetic;

    // 有可能出现只有一个音标的情况，例如: keyword
    if (data.length > 1) {
      phonetic = new Phonetic(...data);
    } else {
      phonetic = new Phonetic('', ...data);
    }

    debug('phonetics object: %O', phonetic);

    phonetics.push(phonetic);
  });

  return phonetics;
}

/**
 * 提取常规翻译
 */
function _parseNormalTrans($containor) {
  let trans = [];

  $containor.find('li').each((index, item) => {
    let text = $(item).text();
    let result;

    debug(`translate parse text ${text}`);

    // 判断开头有没有词语类型 eg: n vt vi
    if (/^[a-z]+\./i.test(text)) {
      let array = $(item).text().split('. ');
      result = new Translate(...array);
    } else {
      result = new Translate('', text);
    }

    debug('translate object: %O', result);

    trans.push(result);
  });

  /**
   * 可能是中文
   */
  if (!trans.length) {
    $containor.find('.contentTitle a').each((index, item) => {
      let html = $(item).html();
      let tran = removeTagsAndSpaces(html);

      trans.push(new Translate('', tran));

      debug(`translate parse html: ${html}`);
      debug('translate object: %O', tran);
    });
  }

  return trans;
}

/**
 * 提取网络翻译
 */
function _parseWebTrans($containor) {
  let trans = [];

  // 网络释义
  $containor.find('.wt-container .title > span').each((index, item) => {
    let text = removeTagsAndSpaces($(item).text());
    let result = new Translate('网络', text);

    debug(`web translate parse text ${text}`);
    debug('web translate object: %O', result);

    trans.push(result);
  });

  // 有网络释义的话，结束解析，否则进一步提取短语
  if (trans.length) {
    return trans;
  }

  $containor.find('#webPhrase .wordGroup').slice(0, 5)
    .each((index, item) => {
      let text = removeTagsAndSpaces($(item).html());
      let result = new Translate('网络释义', text);

      debug(`web translate parse text ${text}`);
      debug('web translate object: %O', result);

      trans.push(result);
    });

  return trans;
}

module.exports = main;
