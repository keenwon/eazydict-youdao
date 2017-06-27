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

  describe('# 入参测试', function () {

    it('英文单词', function (done) {
      fetch.resetData('en_word');

      const schema = Joi.object({
        phonetics: Joi.array().length(2).required(),
        trans: Joi.array().min(1).required()
      });

      youdao('world')
        .then(result => {
          Joi.validate(result, schema).should.validate;
          done();
        });
    });

    it('英文短语', function (done) {
      fetch.resetData('en_phrase');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        trans: Joi.array().min(1).required()
      });

      youdao('hello world')
        .then(result => {
          Joi.validate(result, schema).should.validate;
          done();
        });
    });

    it('中文单词', function (done) {
      fetch.resetData('cn_word');

      const schema = Joi.object({
        phonetics: Joi.array().length(0).required(),
        trans: Joi.array().min(1).required()
      });

      youdao('世界')
        .then(result => {
          Joi.validate(result, schema).should.validate;
          done();
        });
    });
  });

});