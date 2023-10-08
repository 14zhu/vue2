import { newArrayProto } from './array'

class Observer {
  constructor(data) {
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
    })
    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto
      this.observeArray(data)
    } else {
      this.walk(data)
    }
  }
  walk(data) {
    Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
  }
  observeArray(data) {
    data.forEach((item) => {
      observe(item)
    })
  }
}

function defineReactive(target, key, value) {
  observe(value)
  Object.defineProperty(target, key, {
    get() {
      return value
    },
    set(newValue) {
      if (newValue === value) return
      observe(newValue)
      value = newValue
    },
  })
}

function observe(data) {
  if (typeof data !== 'object' || data === null) {
    return
  }
  if (data.__ob__ && data.__ob__ instanceof Observer) {
    return data.__ob__
  }
  return new Observer(data)
}

export { observe }
