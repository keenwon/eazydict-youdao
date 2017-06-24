'use strict';

const fetch = require('node-fetch');
const { JSDOM } = require('jsdom');

function parser(html) {
  let dom = new JSDOM(html);
  let $containor = dom.window.document.querySelector('#phrsListTab');

  // 提取音标
  let phonetics = [];
  $containor.querySelectorAll('.pronounce').forEach(item => {
    phonetics.push(
      item.textContent.split('\n')
        .map(i => i.trim())
        .filter(i => !!i)
    );
  });

  // 提取翻译
  let trans = [];
  $containor.querySelectorAll('li').forEach(item => {
    trans.push(item.textContent);
  });

  return {
    phonetics,
    trans
  };
}

function main(keyword) {
  // 模拟浏览器的头信息
  /* eslint-disable max-len */
  const headers = new fetch.Headers({
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8',
    'Cache-Control': 'max-age=0',
    'Connection': 'keep-alive',
    'Host': 'www.youdao.com',
    'Upgrade-Insecure-Requests': '1',
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.104 Safari/537.36'
  });
  /* eslint-enable max-len */

  const url = `http://www.youdao.com/w/eng/${keyword}`;

  fetch(url, { headers })
    .then(res => res.text())
    .then(body => parser(body))
    .then(data => {
      // eslint-disable-next-line
      console.log(data);
    });
}

main('hello');