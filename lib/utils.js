'use strict'

// 移除 HTML 文本中的标签，合并多个空白为单个
function removeTagsAndSpaces (html) {
  if (!html || typeof html !== 'string') {
    return html
  }

  return html
    .replace(/<[^>]+?>/gm, '') // 移除 html 标签
    .replace(/\s+/gm, ' ') // 合并空格
    .trim()
}

module.exports = {
  removeTagsAndSpaces
}
