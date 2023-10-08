import { parseHTML } from './parse'

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function genProps(attrs) {
  if (typeof attrs !== 'object' || Object.keys(attrs).length === 0)
    return 'undefined'
  let str = ''
  const keys = Object.keys(attrs)
  keys.forEach((key) => {
    if (key === 'style') {
      let obj = {}
      attrs[key].split(';').forEach((item) => {
        item = item.trim()
        let [key, value] = item.split(':')
        obj[key] = value
      })
      attrs[key] = obj
    }
    str += `${key}:${JSON.stringify(attrs[key])},`
  })
  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === 1) {
    return codegen(node)
  } else {
    let text = node.text
    if (!defaultTagRE.test(text)) {
      return `_v(${JSON.stringify(text)})`
    } else {
      // 处理文本中的插值
      const tokens = []
      let match,
        lastIndex = 0
      defaultTagRE.lastIndex = 0
      while ((match = defaultTagRE.exec(text))) {
        let index = match.index
        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)))
        }
        tokens.push(`_s(${match[1].trim()})`)
        lastIndex = index + match[0].length
      }
      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)))
      }
      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(children) {
  return children.map((child) => gen(child)).join(',')
}

function codegen(ast) {
  const children = genChildren(ast.children)
  return `_c('${ast.tag}', ${genProps(ast.attrs)}${
    children.length ? `,${children}` : ''
  })`
}

export function compileToFunction(template) {
  // 解析html
  const ast = parseHTML(template)
  let code = codegen(ast)
  code = `with(this) {return ${code}}`
  return new Function(code)
}
