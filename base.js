var Base = {
  lazyLoad: (function () {
    var store = []
    var poll = null

    var _inView = function (el) {
      var coords = el.getBoundingClientRect()
      return ((coords.top > 0 && coords.left > 0 && coords.top) <= (window.innerHeight || document.documentElement.clientHeight) + parseInt(offset))
    }

    var _pollImages = function () {
      for (var i = store.length; i--;) {
        var self = store[i]
        if (_inView(self)) {
          self.src = self.getAttribute('data-src')
          store.splice(i, 1)
        }
      }
    }

    var _throttle = function () {
      clearTimeout(poll)
      poll = setTimeout(_pollImages, throttle)
    }

    var init = function (obj) {
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
  })()
}