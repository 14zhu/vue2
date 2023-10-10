import { popTarget, pushTarget } from './dep'

let id = 0

class Watcher {
  constructor(vm, cb, options) {
    this.id = id++
    this.getter = cb
    this.deps = []
    this.depIds = new Set()
    this.vm = vm
    this.lazy = options.lazy
    this.dirty = this.lazy
    this.lazy ? undefined : this.get()
  }
  get() {
    pushTarget(this)
    this.value = this.getter.call(this.vm)
    popTarget()
    return this.value
  }
  addDep(dep) {
    if (!this.depIds.has(dep.id)) {
      this.deps.push(dep)
      this.depIds.add(dep.id)
      dep.addSub(this)
    }
  }
  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }
  run() {
    this.get()
  }
  evaluate() {
    this.value = this.get()
    this.dirty = false
  }
  depend() {
    this.deps.forEach((dep) => dep.depend())
  }
}

let pending = false
let has = new Set()
let queue = []
function flushSchedulerQueue() {
  const flushQueue = queue.slice(0)
  queue = []
  has = new Set()
  pending = false
  flushQueue.forEach((watcher) => watcher.run())
}
function queueWatcher(watcher) {
  const id = watcher.id
  if (!has.has(id)) {
    has.add(id)
    queue.push(watcher)
    if (!pending) {
      nextTick(flushSchedulerQueue)
      pending = true
    }
  }
}

let callbacks = []
let waiting = false
function flushCallbacks() {
  const cbs = callbacks.slice(0)
  callbacks = []
  waiting = false
  cbs.forEach((cb) => cb())
}
export function nextTick(cb) {
  callbacks.push(cb)
  if (!waiting) {
    Promise.resolve().then(flushCallbacks)
    waiting = true
  }
}

export default Watcher
