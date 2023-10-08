import { compileToFunction } from './compiler'
import { mountComponent } from './lifecycle'
import { initState } from './state'

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    initState(vm)
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    const opts = vm.$options
    el = document.querySelector(el)
    if (!el) return console.error('不是正确的el属性!')
    let template
    if (opts.template) {
      template = opts.template
    } else {
      template = el.outerHTML
    }
    if (template) {
      opts.render = compileToFunction(template)
    }
    mountComponent(vm, el)
  }
}
