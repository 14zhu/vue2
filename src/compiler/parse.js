import * as htmlparser2 from 'htmlparser2'

export function parseHTML(html) {
  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      attrs,
      children: [],
      parent: null,
    }
  }
  const ELEMENT_TYPE = 1
  const TEXT_TYPE = 3
  const stack = []
  let currentParent = null
  let root = null
  const parser = new htmlparser2.Parser({
    onopentag: (name, attrs) => {
      const ast = createASTElement(name, attrs)
      if (!root) root = ast
      if (currentParent) {
        currentParent.children.push(ast)
        ast.parent = currentParent
      }
      stack.push(ast)
      currentParent = ast
    },
    ontext: (text) => {
      if (currentParent && currentParent.type === ELEMENT_TYPE) {
        text = text.replace(/\s+/g, ' ').trim()
        text &&
          currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent,
          })
      }
    },
    onclosetag: () => {
      stack.pop()
      currentParent = stack[stack.length - 1]
    },
  })
  parser.write(html)
  parser.end()
  return root
}
