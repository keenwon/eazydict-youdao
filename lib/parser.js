'use strict'

const debug = require('./debug')
const cheerio = require('cheerio')
const {
  EDOutput,
  Phonetic,
  Translate,
  Example,
  Suggest,
  CODES,
} = require('eazydict-standard-output')
const { removeTagsAndSpaces } = require('./utils')

let $

function main(html) {
  try {
    return parser(html)
  } catch (e) {
    return new EDOutput(CODES.PARSE_ERROR, e.message)
  }
}

// 解析 HTML
function parser(html) {
  $ = cheerio.load(html, {
    decodeEntities: false,
  })

  const $containor = $('#phrsListTab')
  const $suggestContainor = $('#results-contents')

  const output = new EDOutput()

  /**
   * containor 为空，可能是：
   *    1.中英混合单词
   *    2.错误页
   */
  if ((!$containor || !$containor.length) && (!$suggestContainor || !$suggestContainor.length)) {
    return output
  }

  output.phonetics = _parsePhonetics($containor)

  // 翻译
  const $webContainor = $('#webTrans')
  const normalTrans = _parseNormalTrans($containor)
  const webTrans = _parseWebTrans($webContainor)
  output.translates = normalTrans.concat(webTrans)

  // 例句
  const $examplesContainor = $('#examples')
  output.examples = _parseExamples($examplesContainor)

  output.suggests = _parseSuggests($suggestContainor)

  return output
}

// 提取音标
function _parsePhonetics($containor) {
  const phonetics = []

  $containor.find('.pronounce').each((index, item) => {
    const html = $(item).html()
    const content = removeTagsAndSpaces($(item).html())

    debug(`phonetics parse html: ${html}`)
    debug(`phonetics parse content: ${content}`)

    if (!content) {
      return
    }

    const data = content.split(' ')
    let phonetic

    // 有可能出现只有一个音标的情况，例如: keyword
    if (data.length > 1) {
      phonetic = new Phonetic(...data)
    } else {
      phonetic = new Phonetic('', ...data)
    }

    debug('phonetics object: %O', phonetic)

    phonetics.push(phonetic)
  })

  return phonetics
}

// 提取常规翻译
function _parseNormalTrans($containor) {
  const trans = []

  $containor.find('li').each((index, item) => {
    const text = $(item).text()
    let result

    debug(`translate parse text ${text}`)

    // 判断开头有没有词语类型 eg: n vt vi
    if (/^[a-z]+\./i.test(text)) {
      const array = $(item).text().split('. ')
      result = new Translate(...array)
    } else {
      result = new Translate('', text)
    }

    debug('translate object: %O', result)

    trans.push(result)
  })

  /**
   * 可能是中文
   */
  if (!trans.length) {
    $containor.find('.contentTitle a').each((index, item) => {
      const html = $(item).html()
      const tran = removeTagsAndSpaces(html)

      trans.push(new Translate('', tran))

      debug(`translate parse html: ${html}`)
      debug('translate object: %O', tran)
    })
  }

  return trans
}

// 提取网络翻译
function _parseWebTrans($containor) {
  const trans = []

  // 网络释义
  $containor.find('.wt-container .title > span').each((index, item) => {
    const text = removeTagsAndSpaces($(item).text())
    const result = new Translate('网络', text)

    debug(`web translate parse text ${text}`)
    debug('web translate object: %O', result)

    trans.push(result)
  })

  // 有网络释义的话，结束解析，否则进一步提取短语
  if (trans.length) {
    return trans
  }

  $containor.find('#webPhrase .wordGroup').each((index, item) => {
    const text = removeTagsAndSpaces($(item).html())
    const result = new Translate('网络释义', text)

    debug(`web translate parse text ${text}`)
    debug('web translate object: %O', result)

    trans.push(result)
  })

  return trans
}

// 提取例句
function _parseExamples($containor) {
  const examples = []

  // 网络释义
  $containor.find('#bilingual li').each((index, item) => {
    const $ps = $(item).find('p')
    const from = removeTagsAndSpaces($ps.eq(0).text())
    const to = removeTagsAndSpaces($ps.eq(1).text())
    const result = new Example(from, to)

    debug(`example parse 'from': ${from}`)
    debug(`example parse 'to': ${to}`)
    debug('example parse object: %O', result)

    examples.push(result)
  })

  return examples
}

// 提取搜索建议
function _parseSuggests($containor) {
  const suggests = []

  $containor.find('.typo-rel').each((index, item) => {
    const $p = $(item)
    const $word = $p.find('span')
    const word = removeTagsAndSpaces($word.html())

    // 移除 $word, 防止重复获取 word
    $word.remove()

    const translate = removeTagsAndSpaces($p.html())
    const suggest = new Suggest(word, translate)

    debug('suggest parse object: %O', suggest)

    suggests.push(suggest)
  })

  return suggests
}

module.exports = main
