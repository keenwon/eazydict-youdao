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
if (process.env.NODE_ENV === 'online') {
  youdao = require('../index.js');
  resetData = () => {
    // do nothing
  };
} else {
  youdao = proxyquire('../index.js', stubs);
  resetData = fetch.resetData;
}

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

describe('Test', function () {

  describe('# 入参测试', function () {
    it('英文单词', function () {
      fetch.resetData('en_word');
      return youdao('world').should.be.fulfilled;
    });

    it('英文短语', function () {
      fetch.resetData('en_phrase');
      return youdao('hello world').should.be.fulfilled;
    });
  });

});