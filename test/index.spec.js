'use strict'

/* eslint-disable no-console, max-nested-callbacks, global-require */

const proxyquire = require('proxyquire').noPreserveCache()
const fetch = require('./lib/fetch')
fetch['@global'] = true

const stubs = {
  'node-fetch': fetch
}

let youdao
let resetData

// 区分"线上测试"和"集成测试"
if (process.env.NODE_ENV === 'testing') {
  youdao = proxyquire('../index.js', stubs)
  resetData = fetch.resetData
} else {
  youdao = require('../index.js')
  resetData = () => {
    // do nothing
  }
}

const chai = require('chai')
const Joi = require('joi')
const chaiAsPromised = require('chai-as-promised')
chai.should()
chai.use(chaiAsPromised)

describe('主程序测试', function () {
  describe('# 功能测试', function () {
    it('英文单词', function () {
      resetData('en_word')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(2)
          .required(),
        translates: Joi.array()
          .length(8)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('world').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('英文短语', function () {
      resetData('en_phrase')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(5)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('hello world').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('中文单词', function () {
      resetData('cn_word')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(7)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('世界').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('中文短语', function () {
      resetData('cn_phrase')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(1)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('你好世界').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('中英单词', function () {
      resetData('en_cn_word')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(0)
          .required(),
        examples: Joi.array()
          .length(2)
          .required()
      })
        .unknown()
        .required()

      return youdao('hello世界').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('中英短语', function () {
      resetData('en_cn_phrase')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(10)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('你好 world').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('数字', function () {
      resetData('number')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(11)
          .required(),
        examples: Joi.array()
          .length(3)
          .required()
      })
        .unknown()
        .required()

      return youdao('797').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('搜索建议', function () {
      resetData('suggest')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(0)
          .required(),
        examples: Joi.array()
          .length(0)
          .required(),
        suggests: Joi.array()
          .length(2)
          .required()
      })
        .unknown()
        .required()

      return youdao('ffdad').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('插件名和 URL', function () {
      resetData('en_word')

      const url = `http://www.youdao.com/w/eng/${encodeURIComponent('test')}`
      const schema = Joi.object({
        pluginName: Joi.string()
          .equal('Youdao')
          .required(),
        url: Joi.string()
          .equal(url)
          .required()
      })
        .unknown()
        .required()

      return youdao('test').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })
  })

  describe('# 异常测试', function () {
    it('查询乱码 & 错误页等', function () {
      resetData('error')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(0)
          .required(),
        error: Joi.any().optional()
      })
        .unknown()
        .required()

      return youdao('#WQE').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('被跳转到首页', function () {
      resetData('notfound')

      const schema = Joi.object({
        phonetics: Joi.array()
          .length(0)
          .required(),
        translates: Joi.array()
          .length(0)
          .required(),
        error: Joi.any().optional()
      })
        .unknown()
        .required()

      return youdao('////').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })

    it('查询空关键字', function () {
      resetData('notfound')

      return youdao('').should.eventually.rejected
    })

    it('网络异常', function () {
      this.timeout(8000)

      resetData('network_error')

      const schema = Joi.object({
        phonetics: Joi.array()
          .empty()
          .required(),
        translates: Joi.array()
          .empty()
          .required(),
        error: Joi.object({
          code: Joi.number()
            .integer(1)
            .required(),
          type: Joi.string().required(),
          message: Joi.string()
            .allow('')
            .optional()
        })
      })
        .unknown()
        .required()

      return youdao('network_error').then(result => {
        schema.validate(result).should.not.have.property('error')
      })
    })
  })
})
