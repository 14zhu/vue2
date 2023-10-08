const oldArrayProto = Array.prototype
export const newArrayProto = Object.create(oldArrayProto)
const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
methods.forEach((method) => {
  newArrayProto[method] = function (...args) {
    const result = oldArrayProto[method].apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
        break
    }
    if (inserted) ob.observeArray(inserted)
    return result
  }
})
