'use strict'

/* eslint-disable no-console, max-nested-callbacks */

const utils = require('../lib/utils')

const chai = require('chai')
chai.should()

describe('Utils 测试', function () {
  describe('# removeTagsAndSpaces 测试', function () {
    it('功能测试: 标签', function () {
      const html = '<span>hello</span>'
      const expect = 'hello'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    it('功能测试: 标签 + 属性', function () {
      const html = '<span class="a" name="b">hello</span>'
      const expect = 'hello'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    it('功能测试: 单独标签', function () {
      const html = '<span class="a" name="b">hello</span><br><br />'
      const expect = 'hello'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    it('功能测试: 嵌套标签', function () {
      const html = '<span class="a" name="b">hello <i>world</i></span><br><br />'
      const expect = 'hello world'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    it('功能测试: 多行', function () {
      const html = `<span class="a" name="b">
          hello
          <i>world</i>
        </span>
        <br>
        <br />`
      const expect = 'hello world'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    it('功能测试: 多空格', function () {
      const html = `<span class="a" name="b">
          你好   世界
          <i>!  </i>
        </span>
        <br>
        <br />`
      const expect = '你好 世界 !'

      utils.removeTagsAndSpaces(html).should.be.equal(expect)
    })

    // 各种类型的异常测试
    ;['', [], {}, false, true, 0, 1].forEach(item => {
      it(`异常测试，输入值：${JSON.stringify(item)}`, function () {
        utils.removeTagsAndSpaces(item).should.be.equal(item)
      })
    })
  })
})
