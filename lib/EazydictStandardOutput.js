'use strict';

/**
 * EazyDict 词典插件标准输出对象
 */
class EazydictStandardOutput {

  constructor() {
    this.phonetics = [];
    this.translates = [];
  }

}

/**
 * 音标
 */
class Phonetic {
  constructor(type, value) {
    // 音标类型，例如 美
    this.type = type;

    // 音标值，例如 [həˈləʊ]
    this.value = value;
  }
}

/**
 * 翻译
 */
class Translate {
  constructor(type, trans) {
    // 词性，例如 n vt
    this.type = type;

    // 翻译
    this.trans = trans;
  }
}

module.exports = EazydictStandardOutput;
module.exports.EazydictStandardOutput = EazydictStandardOutput;
module.exports.Phonetic = Phonetic;
module.exports.Translate = Translate