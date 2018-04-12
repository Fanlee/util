var Base = {
  /**
   * 图片懒加载
   */
  lazyLoad: (function() {
    var store = []
    var poll = null

    var _inView = function(el) {
      var coords = el.getBoundingClientRect()
      return ((coords.top > 0 && coords.left > 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))
    }

    var _pollImages = function() {
      for (var i = store.length; i--;) {
        var self = store[i]
        if (_inView(self)) {
          self.src = self.getAttribute('data-src')
          store.splice(i, 1)
        }
      }
    }

    var _throttle = function() {
      clearTimeout(poll)
      poll = setTimeout(_pollImages, throttle)
    }

    var init = function(obj) {
      var els = document.querySelectorAll('[data-src]')
      var opts = obj || {}
      offset = opts.offset || 0
      throttle = opts.throttle || 250

      for (var i = 0; i < els.length; i++) {
        store.push(els[i])
      }

      _throttle()

      if (document.addEventListener) {
        window.addEventListener('scroll', _throttle, false)
      } else {
        window.attachEvent('onscroll', _throttle)
      }
    }

    return {
      init: init,
      render: _throttle
    }
  })(),

  /**
   * 函数防抖
   * @param {Function} func  回调函数
   * @param {Number} wait  间隔时间
   * @param {Boolean} immediate 是否在移入的时候立刻执行函数
   */
  debounce: function(func, wait, immediate) {
    var timeout, result;

    var debounced = function() {
      // 修复回调函数this,event指向问题
      var context = this;
      var args = arguments;

      if (timeout) clearTimeout(timeout);

      if (immediate) {
        // 如果已经执行过，不再执行
        var callNow = !timeout;
        timeout = setTimeout(function() {
          timeout = null;
        }, wait)
        if (callNow) {
          result = func.apply(context, args)
        }
      } else {
        timeout = setTimeout(function() {
          func.apply(context, args)
        }, wait);
      }
      return result
    }
    // 取消防抖
    debounced.cancel = function() {
      clearTimeout(timeout)
      timeout = null
    }

    return debounced
  }
}