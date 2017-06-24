'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const fetch = require('./lib/fetch');
const stubs = {
  'node-fetch': fetch
};
const youdao = proxyquire('../index.js', stubs);

const mocha = require('mocha');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.should();
chai.use(chaiAsPromised);

/* eslint-disable no-console, max-nested-callbacks */
describe('入参测试', function () {

  describe('# test', function () {

    it('英文单词', function () {
      return youdao('world').should.be.resolved;
    });

  });

});