import { observe } from './observe'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[target][key]
    },
    set(value) {
      vm[target][key] = value
    },
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data
  vm._data = data
  observe(data)
  Object.keys(data).forEach((key) => proxy(vm, '_data', key))
}
