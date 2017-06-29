'use strict';

/* eslint-disable no-console, max-nested-callbacks, global-require */

const proxyquire = require('proxyquire').noPreserveCache();
const fetch = require('./lib/fetch');
const stubs = {
  'node-fetch': fetch
};

let youdao;
let resetData;

/**
 * 区分"线上测试"和"集成测试"
 */
if (process.env.NODE_ENV === 'testing') {
  youdao = proxyquire('../index.js', stubs);
  resetData = fetch.resetData;
} else {
  youdao = require('../index.js');
  resetData = () => {
    // do nothing
  };
}

const mocha = require('mocha');
const chai = require('chai');
const Joi = require('joi');
const chaiJoi = require('chai-joi');
chai.should();
chai.use(chaiJoi);

describe('主程序测试', function () {

  describe('# 功能测试', function () {

    it('英文单词', function () {
      fetch.resetData('en_word');

      const schema = Joi.object({
        phonetics: Joi.array().length(2).required(),
        translates: Joi.array().min(1).required()
      });

      return youdao('world')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('英文短语', function () {
      fetch.resetData('en_phrase');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().min(1).required()
      });

      return youdao('hello world')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('中文单词', function () {
      fetch.resetData('cn_word');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().min(1).required()
      });

      return youdao('世界')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('中文短语', function () {
      fetch.resetData('cn_phrase');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().length(0).required()
      });

      return youdao('你好世界')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('中英单词', function () {
      fetch.resetData('en_cn_word');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().length(0).required()
      });

      return youdao('hello世界')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('中文短语', function () {
      fetch.resetData('en_cn_phrase');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().length(0).required()
      });

      return youdao('hello 世界')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

    it('数字', function () {
      fetch.resetData('number');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().length(1).required()
      });

      return youdao('123')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });
  });

  describe('# 异常测试', function () {

    it('查询乱码 & 错误页等', function () {
      fetch.resetData('error');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        translates: Joi.array().length(0).required()
      });

      return youdao('#WQE')
        .then(result => {
          Joi.validate(result, schema).should.validate;
        });
    });

  });

});