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
  },
  /**
   * 判断数据类型
   * @param {}
   */
  type: function(obj) {
    var classType = {}
    var typeArray = ['Boolean', 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']

    typeArray.map(function(item, index) {
      classType['[object ' + item + ']'] = item.toLowerCase()
    })

    // 兼容IE6 中，null 和 undefined 会被 Object.prototype.toString 识别成 [object Object]
    if (obj == null) {
      return obj + ''
    }

    return typeof obj === 'object' || typeof obj === 'function' ? classType[Object.prototype.toString.call(obj)] || 'object' : typeof obj
  },
  /**
   * 判断是否是纯粹的对象
   */
  isPlainObject: function(obj) {
    var proto, ctor
    var classType = {}

    // 相当于Object.prototype.toString
    var toString = classType.toString

    // 相当于Object.prototype.hasOwnProperty
    var hasOwn = classType.hasOwnProperty

    if (!obj || toString.call(obj) !== '[object Object]') {
      return false
    }

    proto = Object.getPrototypeOf(obj)

    // 没有原型的对象是纯粹的，Object.create(null) 就在这里返回 true
    if (!proto) {
      return true
    }

    /**
     * 以下判断通过 new Object 方式创建的对象
     * 判断 proto 是否有 constructor 属性，如果有就让 Ctor 的值为 proto.constructor
     * 如果是 Object 函数创建的对象，Ctor 在这里就等于 Object 构造函数
     */
    ctor = hasOwn.call(proto, 'constructor') && proto.constructor

    // 在这里判断 Ctor 构造函数是不是 Object 构造函数，用于区分自定义构造函数和 Object 构造函数
    return typeof ctor === 'function' && hasOwn.toString.call(ctor) === hasOwn.toString.call(Object)

  },
  /**
   * 判断是否是空的对象
   *    for循环一旦执行就说明有属性
   * @param {Object} 传入对象
   */
  isEmptyObject: function(obj) {
    var name
    for (name in obj) {
      return false
    }
    return true
  },
  /**
   * 判断是否有全局的window对象
   */
  isWindow: function(obj) {
    return obj != null && obj.window
  },
  /**
   * 判断是否是数组或者类数组
   */
  isArrayLike: function(obj) {
    var length = !!obj && 'length' in obj && obj.length
    var typeRes = this.type(obj)

    // 排除掉函数和window对象
    if (typeRes === 'function' || this.isWindow(obj)) {
      return false
    }

    return typeRes === 'array' || length === 0 || typeof length === 'number' && length > 0 && (length - 1) in obj
  }
}