var JQ = function (arr) {
  var _this = this;

  for (var i = 0; i < arr.length; i++) {
    _this[i] = arr[i];
  }

  _this.length = arr.length;

  return this;
};

/**
 * @param selector {String|Function|Node|Window|NodeList|Array|JQ=}
 * @returns {JQ}
 */
var $ = function (selector) {
  var arr = [];
  var i = 0;

  if (!selector) {
    return new JQ(arr);
  }

  if (selector instanceof JQ) {
    return selector;
  }

  if (isString(selector)) {
    var els;
    var tempParent;
    selector = selector.trim();

    // 创建 HTML 字符串
    if (selector[0] === '<' && selector[selector.length - 1] === '>') {
      // HTML
      var toCreate = 'div';
      if (selector.indexOf('<li') === 0) {
        toCreate = 'ul';
      }

      if (selector.indexOf('<tr') === 0) {
        toCreate = 'tbody';
      }

      if (selector.indexOf('<td') === 0 || selector.indexOf('<th') === 0) {
        toCreate = 'tr';
      }

      if (selector.indexOf('<tbody') === 0) {
        toCreate = 'table';
      }

      if (selector.indexOf('<option') === 0) {
        toCreate = 'select';
      }

      tempParent = document.createElement(toCreate);
      tempParent.innerHTML = selector;
      for (i = 0; i < tempParent.childNodes.length; i++) {
        arr.push(tempParent.childNodes[i]);
      }
    }

    // 选择器
    else {

      // id 选择器
      if (selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
        els = [document.getElementById(selector.slice(1))];
      }

      // 其他选择器
      else {
        els = document.querySelectorAll(selector);
      }

      for (i = 0; i < els.length; i++) {
        if (els[i]) {
          arr.push(els[i]);
        }
      }
    }
  }

  // function
  else if (isFunction(selector)) {
    return $(document).ready(selector);
  }

  // Node
  else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  }

  // NodeList
  else if (selector.length > 0 && selector[0].nodeType) {
    for (i = 0; i < selector.length; i++) {
      arr.push(selector[i]);
    }
  }

  return new JQ(arr);
};

$.fn = JQ.prototype;

/**
 * 扩展函数和原型属性
 * @param obj
 */
$.extend = $.fn.extend = function (obj) {
  if (obj === undefined) {
    return this;
  }

  var length = arguments.length;
  var prop;
  var i;
  var options;

  // $.extend(obj)
  if (length === 1) {
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        this[prop] = obj[prop];
      }
    }

    return this;
  }

  // $.extend({}, defaults[, obj])
  for (i = 1; i < length; i++) {
    options = arguments[i];
    for (prop in options) {
      if (options.hasOwnProperty(prop)) {
        obj[prop] = options[prop];
      }
    }
  }

  return obj;
};

$.extend({

  /**
   * 遍历对象
   * @param obj {String|Array|Object}
   * @param callback {Function}
   * @returns {Array|Object}
   */
  each: each,

  /**
   * 合并两个数组，返回的结果会修改第一个数组的内容
   * @param first {Array}
   * @param second {Array}
   * @returns {Array}
   */
  merge: merge,

  /**
   * 删除数组中重复元素
   * @param arr {Array}
   * @returns {Array}
   */
  unique: unique,

  /**
   * 通过遍历集合中的节点对象，通过函数返回一个新的数组，null 或 undefined 将被过滤掉。
   * @param elems
   * @param callback
   * @returns {Array}
   */
  map: map,

  /**
   * 一个 DOM 节点是否包含另一个 DOM 节点
   * @param parent {Node} 父节点
   * @param node {Node} 子节点
   * @returns {Boolean}
   */
  contains: function (parent, node) {
    if (parent && !node) {
      return documentElement.contains(parent);
    }

    return parent !== node && parent.contains(node);
  },

  /**
   * 将数组或对象序列化
   * @param obj
   * @returns {String}
   */
  param: function (obj) {
    if (!isObjectLike(obj)) {
      return '';
    }

    var args = [];
    each(obj, function (key, value) {
      destructure(key, value);
    });

    return args.join('&');

    function destructure(key, value) {
      var keyTmp;

      if (isObjectLike(value)) {
        each(value, function (i, v) {
          if (isArray(value) && !isObjectLike(v)) {
            keyTmp = '';
          } else {
            keyTmp = i;
          }

          destructure(key + '[' + keyTmp + ']', v);
        });
      } else {
        if (!isNull(value) && value !== '') {
          keyTmp = '=' + encodeURIComponent(value);
        } else {
          keyTmp = '';
        }

        args.push(encodeURIComponent(key) + keyTmp);
      }
    }
  },
});

$.fn.extend({

  /**
   * 遍历对象
   * @param callback {Function}
   * @return {JQ}
   */
  each: function (callback) {
    return each(this, callback);
  },

  /**
   * 通过遍历集合中的节点对象，通过函数返回一个新的对象，null 或 undefined 将被过滤掉。
   * @param callback {Function}
   * @returns {JQ}
   */
  map: function (callback) {
    return new JQ(map(this, function (el, i) {
      return callback.call(el, i, el);
    }));
  },

  /**
   * 获取指定 DOM 元素，没有 index 参数时，获取所有 DOM 的数组
   * @param index {Number=}
   * @returns {Node|Array}
   */
  get: function (index) {
    return index === undefined ?
      slice.call(this) :
      this[index >= 0 ? index : index + this.length];
  },

  /**
   * array中提取的方法。从start开始，如果end 指出。提取不包含end位置的元素。
   * @param argument {start, end}
   * @returns {JQ}
   */
  slice: function (argument) {
    return new JQ(slice.apply(this, arguments));
  },

  /**
   * 筛选元素集合
   * @param selector {String|JQ|Node|Function}
   * @returns {JQ}
   */
  filter: function (selector) {
    if (isFunction(selector)) {
      return this.map(function (index, ele) {
        return selector.call(ele, index, ele) ? ele : undefined;
      });
    } else {
      var $selector = $(selector);
      return this.map(function (index, ele) {
        return $selector.index(ele) > -1 ? ele : undefined;
      });
    }
  },

  /**
   * 从元素集合中删除指定的元素
   * @param selector {String|Node|JQ|Function}
   * @return {JQ}
   */
  not: function (selector) {
    var $excludes = this.filter(selector);
    return this.map(function (index, ele) {
      return $excludes.index(ele) > -1 ? undefined : ele;
    });
  },

  /**
   * 获取元素相对于 document 的偏移
   * @returns {Object}
   */
  offset: function () {
    if (this[0]) {
      var offset = this[0].getBoundingClientRect();
      return {
        left: offset.left + window.pageXOffset,
        top: offset.top + window.pageYOffset,
        width: offset.width,
        height: offset.height,
      };
    }

    return null;
  },

  /**
   * 返回最近的用于定位的父元素
   * @returns {*|JQ}
   */
  offsetParent: function () {
    return this.map(function () {
      var offsetParent = this.offsetParent;

      while (offsetParent && $(offsetParent).css('position') === 'static') {
        offsetParent = offsetParent.offsetParent;
      }

      return offsetParent || documentElement;
    });
  },

  /**
   * 获取元素相对于父元素的偏移
   * @return {Object}
   */
  position: function () {
    var _this = this;

    if (!_this[0]) {
      return null;
    }

    var offsetParent;
    var offset;
    var parentOffset = {
      top: 0,
      left: 0,
    };

    if (_this.css('position') === 'fixed') {
      offset = _this[0].getBoundingClientRect();
    } else {
      offsetParent = _this.offsetParent();
      offset = _this.offset();
      if (!nodeName(offsetParent[0], 'html')) {
        parentOffset = offsetParent.offset();
      }

      parentOffset = {
        top: parentOffset.top + offsetParent.css('borderTopWidth'),
        left: parentOffset.left + offsetParent.css('borderLeftWidth'),
      };
    }

    return {
      top: offset.top - parentOffset.top - _this.css('marginTop'),
      left: offset.left - parentOffset.left - _this.css('marginLeft'),
      width: offset.width,
      height: offset.height,
    };
  },

  /**
   * 显示指定元素
   * @returns {JQ}
   */
  show: function () {
    return this.each(function () {
      if (this.style.display === 'none') {
        this.style.display = '';
      }

      if (window.getComputedStyle(this, '').getPropertyValue('display') === 'none') {
        this.style.display = defaultDisplay(this.nodeName);
      }
    });
  },

  /**
   * 隐藏指定元素
   * @returns {JQ}
   */
  hide: function () {
    return this.each(function () {
      this.style.display = 'none';
    });
  },

  /**
   * 切换元素的显示状态
   * @returns {JQ}
   */
  toggle: function () {
    return this.each(function () {
      this.style.display = this.style.display === 'none' ? '' : 'none';
    });
  },

  /**
   * 是否含有指定的 CSS 类
   * @param className {String}
   * @returns {boolean}
   */
  hasClass: function (className) {
    if (!this[0] || !className) {
      return false;
    }

    return this[0].classList.contains(className);
  },

  /**
   * 移除指定属性
   * @param attr {String}
   * @returns {JQ}
   */
  removeAttr: function (attr) {
    return this.each(function () {
      this.removeAttribute(attr);
    });
  },

  /**
   * 删除属性值
   * @param name {String}
   * @returns {JQ}
   */
  removeProp: function (name) {
    return this.each(function () {
      try {
        delete this[name];
      } catch (e) {}
    });
  },

  /**
   * 获取当前对象中第n个元素
   * @param index {Number}
   * @returns {JQ}
   */
  eq: function (index) {
    var ret = index === -1 ? this.slice(index) : this.slice(index, +index + 1);
    return new JQ(ret);
  },

  /**
   * 获取对象中第一个元素
   * @returns {JQ}
   */
  first: function () {
    return this.eq(0);
  },

  /**
   * 获取对象中最后一个元素
   * @returns {JQ}
   */
  last: function () {
    return this.eq(-1);
  },

  /**
   * 获取一个元素的位置。
   * 当 ele 参数没有给出时，返回当前元素在兄弟节点中的位置。
   * 有给出了 ele 参数时，返回 ele 元素在当前对象中的位置
   * @param ele {Selector|Node=}
   * @returns {Number}
   */
  index: function (ele) {
    if (!ele) {
      // 获取当前 JQ 对象的第一个元素在同辈元素中的位置
      return this.eq(0).parent().children().get().indexOf(this[0]);
    } else if (isString(ele)) {
      // 返回当前 JQ 对象的第一个元素在指定选择器对应的元素中的位置
      return $(ele).eq(0).parent().children().get().indexOf(this[0]);
    } else {
      // 返回指定元素在当前 JQ 对象中的位置
      return this.get().indexOf(ele);
    }
  },

  /**
   * 根据选择器、DOM元素或 JQ 对象来检测匹配元素集合，
   * 如果其中至少有一个元素符合这个给定的表达式就返回true
   * @param selector {String|Node|NodeList|Array|JQ|Window}
   * @returns boolean
   */
  is: function (selector) {
    var _this = this[0];

    if (!_this || selector === undefined || selector === null) {
      return false;
    }

    var $compareWith;
    var i;
    if (isString(selector)) {
      if (_this === document || _this === window) {
        return false;
      }

      var matchesSelector =
        _this.matches ||
        _this.matchesSelector ||
        _this.webkitMatchesSelector ||
        _this.mozMatchesSelector ||
        _this.oMatchesSelector ||
        _this.msMatchesSelector;

      return matchesSelector.call(_this, selector);
    } else if (selector === document || selector === window) {
      return _this === selector;
    } else {
      if (selector.nodeType || isArrayLike(selector)) {
        $compareWith = selector.nodeType ? [selector] : selector;
        for (i = 0; i < $compareWith.length; i++) {
          if ($compareWith[i] === _this) {
            return true;
          }
        }

        return false;
      }

      return false;
    }
  },

  /**
   * 根据 CSS 选择器找到后代节点的集合
   * @param selector {String}
   * @returns {JQ}
   */
  find: function (selector) {
    var foundElements = [];

    this.each(function (i, _this) {
      merge(foundElements, _this.querySelectorAll(selector));
    });

    return new JQ(foundElements);
  },

  /**
   * 找到直接子元素的元素集合
   * @param selector {String=}
   * @returns {JQ}
   */
  children: function (selector) {
    var children = [];
    this.each(function (i, _this) {
      each(_this.childNodes, function (i, childNode) {
        if (childNode.nodeType !== 1) {
          return true;
        }

        if (!selector || (selector && $(childNode).is(selector))) {
          children.push(childNode);
        }
      });
    });

    return new JQ(unique(children));
  },

  /**
   * 保留含有指定子元素的元素，去掉不含有指定子元素的元素
   * @param selector {String|Node|JQ|NodeList|Array}
   * @return {JQ}
   */
  has: function (selector) {
    var $targets = isString(selector) ? this.find(selector) : $(selector);
    var len = $targets.length;
    return this.filter(function () {
      for (var i = 0; i < len; i++) {
        if ($.contains(this, $targets[i])) {
          return true;
        }
      }
    });
  },

  /**
   * 取得同辈元素的集合
   * @param selector {String=}
   * @returns {JQ}
   */
  siblings: function (selector) {
    return this.prevAll(selector).add(this.nextAll(selector));
  },

  /**
   * 返回首先匹配到的父节点，包含父节点
   * @param selector {String}
   * @returns {JQ}
   */
  closest: function (selector) {
    var _this = this;

    if (!_this.is(selector)) {
      _this = _this.parents(selector).eq(0);
    }

    return _this;
  },

  /**
   * 删除所有匹配的元素
   * @returns {JQ}
   */
  remove: function () {
    return this.each(function (i, _this) {
      if (_this.parentNode) {
        _this.parentNode.removeChild(_this);
      }
    });
  },

  /**
   * 添加匹配的元素到当前对象中
   * @param selector {String|JQ}
   * @returns {JQ}
   */
  add: function (selector) {
    return new JQ(unique(merge(this.get(), $(selector))));
  },

  /**
   * 删除子节点
   * @returns {JQ}
   */
  empty: function () {
    return this.each(function () {
      this.innerHTML = '';
    });
  },

  /**
   * 通过深度克隆来复制集合中的所有元素。
   * (通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和jquery中利用一个参数来确定是否复制数据和事件处理不相同。)
   * @returns {JQ}
   */
  clone: function () {
    return this.map(function () {
      return this.cloneNode(true);
    });
  },

  /**
   * 用新元素替换当前元素
   * @param newContent {String|Node|NodeList|JQ}
   * @returns {JQ}
   */
  replaceWith: function (newContent) {
    return this.before(newContent).remove();
  },

  /**
   * 将表单元素的值组合成键值对数组
   * @returns {Array}
   */
  serializeArray: function () {
    var result = [];
    var $ele;
    var type;
    var ele = this[0];

    if (!ele || !ele.elements) {
      return result;
    }

    $(slice.call(ele.elements)).each(function () {
      $ele = $(this);
      type = $ele.attr('type');
      if (
        this.nodeName.toLowerCase() !== 'fieldset' &&
        !this.disabled &&
        ['submit', 'reset', 'button'].indexOf(type) === -1 &&
        (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
      ) {
        result.push({
          name: $ele.attr('name'),
          value: $ele.val(),
        });
      }
    });

    return result;
  },

  /**
   * 将表单元素或对象序列化
   * @returns {String}
   */
  serialize: function () {
    var result = [];
    each(this.serializeArray(), function (i, elm) {
      result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
    });

    return result.join('&');
  },
});

/**
 * val - 获取或设置元素的值
 * @param value {String=}
 * @return {*|JQ}
 */
/**
 * html - 获取或设置元素的 HTML
 * @param value {String=}
 * @return {*|JQ}
 */
/**
 * text - 获取或设置元素的内容
 * @param value {String=}
 * @return {*|JQ}
 */
each(['val', 'html', 'text'], function (nameIndex, name) {
  var props = {
    0: 'value',
    1: 'innerHTML',
    2: 'textContent',
  };

  var defaults = {
    0: undefined,
    1: undefined,
    2: null,
  };

  $.fn[name] = function (value) {
    if (value === undefined) {
      // 获取值
      return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
    } else {
      // 设置值
      return this.each(function (i, ele) {
        ele[props[nameIndex]] = value;
      });
    }
  };
});

/**
 * attr - 获取或设置元素的属性值
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
/**
 * prop - 获取或设置元素的属性值
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
/**
 * css - 获取或设置元素的样式
 * @param {name|props|key,value=}
 * @return {String|JQ}
 */
each(['attr', 'prop', 'css'], function (nameIndex, name) {
  var set = function (ele, key, value) {
    if (nameIndex === 0) {
      ele.setAttribute(key, value);
    } else if (nameIndex === 1) {
      ele[key] = value;
    } else {
      ele.style[key] = value;
    }
  };

  var get = function (ele, key) {
    if (!ele) {
      return undefined;
    }

    var value;
    if (nameIndex === 0) {
      value = ele.getAttribute(key);
    } else if (nameIndex === 1) {
      value = ele[key];
    } else {
      value = window.getComputedStyle(ele, null).getPropertyValue(key);
    }

    return value;
  };

  $.fn[name] = function (key, value) {
    var argLength = arguments.length;

    if (argLength === 1 && isString(key)) {
      // 获取值
      return get(this[0], key);
    } else {
      // 设置值
      return this.each(function (i, ele) {
        if (argLength === 2) {
          set(ele, key, value);
        } else {
          each(key, function (k, v) {
            set(ele, k, v);
          });
        }
      });
    }
  };
});

/**
 * addClass - 添加 CSS 类，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
/**
 * removeClass - 移除 CSS 类，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
/**
 * toggleClass - 切换 CSS 类名，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
each(['add', 'remove', 'toggle'], function (nameIndex, name) {
  $.fn[name + 'Class'] = function (className) {
    if (!className) {
      return this;
    }

    var classes = className.split(' ');
    return this.each(function (i, ele) {
      each(classes, function (j, cls) {
        ele.classList[name](cls);
      });
    });
  };
});

/**
 * width - 获取元素的宽度
 * @return {Number}
 */
/**
 * height - 获取元素的高度
 * @return {Number}
 */
each({
  Width: 'width',
  Height: 'height',
}, function (prop, name) {
  $.fn[name] = function (val) {
    if (val === undefined) {
      // 获取
      var ele = this[0];

      if (isWindow(ele)) {
        return ele['inner' + prop];
      }

      if (isDocument(ele)) {
        return ele.documentElement['scroll' + prop];
      }

      var $ele = $(ele);

      // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding，这里进行修复
      var IEFixValue = 0;
      if ('ActiveXObject' in window) { // 判断是 IE 浏览器
        if ($ele.css('box-sizing') === 'border-box') {
          IEFixValue =
            parseFloat($ele.css('padding-' + (name === 'width' ? 'left' : 'top'))) +
            parseFloat($ele.css('padding-' + (name === 'width' ? 'right' : 'bottom')));
        }
      }

      return parseFloat($(ele).css(name)) + IEFixValue;
    } else {
      // 设置
      if (!isNaN(Number(val)) && val !== '') {
        val += 'px';
      }

      return this.css(name, val);
    }
  };
});

/**
 * innerWidth - 获取元素的宽度，包含内边距
 * @return {Number}
 */
/**
 * innerHeight - 获取元素的高度，包含内边距
 * @return {Number}
 */
each({
  Width: 'width',
  Height: 'height',
}, function (prop, name) {
  $.fn['inner' + prop] = function () {
    var value = this[name]();
    var $ele = $(this[0]);

    if ($ele.css('box-sizing') !== 'border-box') {
      value += parseFloat($ele.css('padding-' + (name === 'width' ? 'left' : 'top')));
      value += parseFloat($ele.css('padding-' + (name === 'width' ? 'right' : 'bottom')));
    }

    return value;
  };
});

var dir = function (nodes, selector, nameIndex, node) {
  var ret = [];
  var ele;
  nodes.each(function (j, _this) {
    ele = _this[node];
    while (ele) {
      if (nameIndex === 2) {
        // prevUntil
        if (!selector || (selector && $(ele).is(selector))) {
          break;
        }

        ret.push(ele);
      } else if (nameIndex === 0) {
        // prev
        if (!selector || (selector && $(ele).is(selector))) {
          ret.push(ele);
        }

        break;
      } else {
        // prevAll
        if (!selector || (selector && $(ele).is(selector))) {
          ret.push(ele);
        }
      }

      ele = ele[node];
    }
  });

  return new JQ(unique(ret));
};

/**
 * prev - 取得前一个匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * prevAll - 取得前面所有匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * prevUntil - 取得前面的所有元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 'All', 'Until'], function (nameIndex, name) {
  $.fn['prev' + name] = function (selector) {

    // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
    var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
    return dir($nodes, selector, nameIndex, 'previousElementSibling');
  };
});

/**
 * next - 取得后一个匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * nextAll - 取得后面所有匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * nextUntil - 取得后面所有匹配的元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 'All', 'Until'], function (nameIndex, name) {
  $.fn['next' + name] = function (selector) {
    return dir(this, selector, nameIndex, 'nextElementSibling');
  };
});

/**
 * parent - 取得匹配的直接父元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * parents - 取得所有匹配的父元素
 * @param selector {String=}
 * @return {JQ}
 */
/**
 * parentUntil - 取得所有的父元素，直到遇到匹配的元素，不包含匹配的元素
 * @param selector {String=}
 * @return {JQ}
 */
each(['', 's', 'sUntil'], function (nameIndex, name) {
  $.fn['parent' + name] = function (selector) {

    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    var $nodes = nameIndex === 0 ? this : $(this.get().reverse());
    return dir($nodes, selector, nameIndex, 'parentNode');
  };
});

/**
 * append - 在元素内部追加内容
 * @param newChild {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * prepend - 在元素内部前置内容
 * @param newChild {String|Node|NodeList|JQ}
 * @return {JQ}
 */
each(['append', 'prepend'], function (nameIndex, name) {
  $.fn[name] = function (newChild) {
    var newChilds;
    var copyByClone = this.length > 1;

    if (isString(newChild)) {
      var tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;
      newChilds = slice.call(tempDiv.childNodes);
    } else {
      newChilds = $(newChild).get();
    }

    if (nameIndex === 1) {
      // prepend
      newChilds.reverse();
    }

    return this.each(function (i, _this) {
      each(newChilds, function (j, child) {
        // 一个元素要同时追加到多个元素中，需要先复制一份，然后追加
        if (copyByClone && i > 0) {
          child = child.cloneNode(true);
        }

        if (nameIndex === 0) {
          // append
          _this.appendChild(child);
        } else {
          // prepend
          _this.insertBefore(child, _this.childNodes[0]);
        }
      });
    });
  };
});

/**
 * insertBefore - 插入到指定元素的前面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * insertAfter - 插入到指定元素的后面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
each(['insertBefore', 'insertAfter'], function (nameIndex, name) {
  $.fn[name] = function (selector) {
    var $ele = $(selector);
    return this.each(function (i, _this) {
      $ele.each(function (j, ele) {
        ele.parentNode.insertBefore(
          $ele.length === 1 ? _this : _this.cloneNode(true),
          nameIndex === 0 ? ele : ele.nextSibling
        );
      });
    });
  };
});

/**
 * appendTo - 追加到指定元素内容
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * prependTo - 前置到指定元素内部
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * before - 插入到指定元素前面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * after - 插入到指定元素后面
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * replaceAll - 替换掉指定元素
 * @param selector {String|Node|NodeList|JQ}
 * @return {JQ}
 */
each({
  appendTo: 'append',
  prependTo: 'prepend',
  before: 'insertBefore',
  after: 'insertAfter',
  replaceAll: 'replaceWith',
}, function (name, original) {
  $.fn[name] = function (selector) {
    $(selector)[original](this);
    return this;
  };
});

