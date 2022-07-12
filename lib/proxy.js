'use strict'

const HttpsProxyAgent = require('https-proxy-agent')
const SocksProxyAgent = require('socks-proxy-agent')

function proxy(url) {
  if (!url) {
    return null
  }

  if (url.startsWith('socks')) {
    return new SocksProxyAgent(url)
  }

  if (url.startsWith('http')) {
    return new HttpsProxyAgent(url)
  }

  return null
}

module.exports = proxy
