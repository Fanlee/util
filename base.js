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
   *   事件持续触发，但只有等事件停止触发后n秒才执行函数
   * @param {Function} func  回调函数
   * @param {Number} wait  间隔时间
   */
  debounce: function(func, wait) {
    var timeout, context, args

    return function() {
      context = this;
      args = arguments;

      if (timeout) clearTimeout(timeout);

      timeout = setTimeout(function() {
        func.apply(context, args)
      }, wait);
    }
  },

  /**
   * 函数节流
   *    持续触发的时候，每n秒执行一次函数
   * @param {Function} func 回调函数
   * @param {Number} wait 间隔时间
   */
  throttle: function(func, wait) {
    var previous = 0

    return function() {
      var now = Date.now()
      if (now - previous > wait) {
        func.apply(this, arguments)
        previous = now
      }
    }
  },
  /**
   * 数组去重
   * @param {Array} array 需要去重的数组
   */
  unique: function(array) {
    var obj = {}
    return array.filter(function(item) {
      return obj.hasOwnProperty(typeof item + JSON.stringify(item)) ? false : (obj[typeof item + JSON.stringify(item)] = true)
    })
  }
}