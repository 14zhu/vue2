import { initMixin } from './init'
import { initLifecycle } from './lifecycle'
import Watcher, { nextTick } from './observe/watcher'

function Vue(options) {
  this._init(options)
}

Vue.prototype.$nextTick = nextTick

initMixin(Vue)
initLifecycle(Vue)

Vue.prototype.$watch = function (expOrFn, cb) {
  new Watcher(this, expOrFn, { user: true }, cb)
}

export default Vue
