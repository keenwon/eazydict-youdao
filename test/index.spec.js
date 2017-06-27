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
chai.should();

describe('主程序测试', function () {

  describe('# 入参测试', function () {

    it('英文单词', function (done) {
      fetch.resetData('en_word');

      youdao('world')
        .then(result => {
          result.should.property('phonetics').with.lengthOf(2);
          result.should.property('trans').lengthOf.at.least(1);
          done();
        });
    });

    it('英文短语', function (done) {
      fetch.resetData('en_phrase');

      youdao('hello world')
        .then(result => {
          result.should.property('phonetics').with.lengthOf(0);
          result.should.property('trans').lengthOf.at.least(1);
          done();
        });
    });

    it('中文单词', function (done) {
      fetch.resetData('cn_word');

      youdao('世界')
        .then(result => {
          result.should.property('phonetics').with.lengthOf(0);
          result.should.property('trans').lengthOf.at.least(1);
          done();
        });
    });
  });

});