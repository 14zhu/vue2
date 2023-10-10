import { observe } from './observe'
import Dep from './observe/dep'
import Watcher from './observe/watcher'

export function initState(vm) {
  const opts = vm.$options
  if (opts.data) {
    initData(vm)
  }
  if (opts.computed) {
    initComputed(vm)
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

function initComputed(vm) {
  let computed = vm.$options.computed
  const watchers = (vm._computedWatchers = {})
  Object.keys(computed).forEach((key) => {
    const userDef = computed[key]
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    const watcher = new Watcher(vm, getter, { lazy: true })
    watchers[key] = watcher
    defineComputed(vm, key, userDef)
  })
}

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {})
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter,
  })
}

function createComputedGetter(key) {
  return function () {
    const watcher = this._computedWatchers[key]
    if (watcher.dirty) {
      watcher.evaluate()
    }
    if (Dep.target) {
      watcher.depend()
    }
    return watcher.value
  }
}
