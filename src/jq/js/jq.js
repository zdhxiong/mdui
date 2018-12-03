/**
 * JQ 1.0.0 (https://github.com/zdhxiong/mdui.JQ#readme)
 * Copyright 2018-2018 zdhxiong
 * Licensed under MIT
 */
var $ = (function () {
  'use strict';

  var JQ = function JQ(arr) {
    var self = this;

    for (var i = 0; i < arr.length; i += 1) {
      self[i] = arr[i];
    }

    self.length = arr.length;

    return this;
  };

  function $(selector) {
    var arr = [];

    if (!selector) {
      return new JQ(arr);
    }

    if (selector instanceof JQ) {
      return selector;
    }

    if (typeof selector === 'string') {
      var html = selector.trim();

      if (html[0] === '<' && html[html.length - 1] === '>') {
        // 创建 HTML 字符串
        var toCreate = 'div';

        if (html.indexOf('<li') === 0) {
          toCreate = 'ul';
        }

        if (html.indexOf('<tr') === 0) {
          toCreate = 'tbody';
        }

        if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
          toCreate = 'tr';
        }

        if (html.indexOf('<tbody') === 0) {
          toCreate = 'table';
        }

        if (html.indexOf('<option') === 0) {
          toCreate = 'select';
        }

        var tempParent = document.createElement(toCreate);
        tempParent.innerHTML = html;

        for (var i = 0; i < tempParent.childNodes.length; i += 1) {
          arr.push(tempParent.childNodes[i]);
        }
      } else {
        // 选择器
        var elems = selector[0] === '#' && !selector.match(/[ .<>:~]/)
          ? [document.getElementById(selector.slice(1))]
          : document.querySelectorAll(selector);

        for (var i$1 = 0; i$1 < elems.length; i$1 += 1) {
          if (elems[i$1]) {
            arr.push(elems[i$1]);
          }
        }
      }
    } else if (typeof selector === 'function') {
      // function
      return $(document).ready(selector);
    } else if (selector.nodeType || selector === window || selector === document) {
      // Node
      arr.push(selector);
    } else if (selector.length > 0 && selector[0].nodeType) {
      // NodeList
      for (var i$2 = 0; i$2 < selector.length; i$2 += 1) {
        arr.push(selector[i$2]);
      }
    }

    return new JQ(arr);
  }

  $.fn = JQ.prototype;

  function extend() {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    if (!args.length) {
      return this;
    }

    // $.extend(obj)
    if (args.length === 1) {
      Object.keys(args[0]).forEach(function (prop) {
        this$1[prop] = args[0][prop];
      });

      return this;
    }

    // $.extend({}, defaults[, obj])
    var target = args.shift();

    var loop = function ( i ) {
      Object.keys(args[i]).forEach(function (prop) {
        target[prop] = args[i][prop];
      });
    };

    for (var i = 0; i < args.length; i += 1) loop( i );

    return target;
  }

  $.fn.extend = extend;
  $.extend = extend;

  /**
   * 判断一个节点名
   * @param ele
   * @param name
   * @returns {boolean}
   */
  function isNodeName(ele, name) {
    return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
  }

  /**
   * 除去 null 后的 object 类型
   * @param obj
   * @returns {*|boolean}
   */
  function isObjectLike(obj) {
    return typeof obj === 'object' && obj !== null;
  }

  function isFunction(fn) {
    return typeof fn === 'function';
  }

  function isString(obj) {
    return typeof obj === 'string';
  }

  function isWindow(win) {
    return win && win === win.window;
  }

  function isDocument(doc) {
    return doc && doc.nodeType === doc.DOCUMENT_NODE;
  }

  function isArrayLike(obj) {
    return typeof obj.length === 'number';
  }

  /**
   * 循环数组或对象
   * @param obj
   * @param callback
   * @returns {*}
   */
  function each(obj, callback) {
    if (isArrayLike(obj)) {
      for (var i = 0; i < obj.length; i += 1) {
        if (callback.call(obj[i], i, obj[i]) === false) {
          return obj;
        }
      }
    } else {
      var keys = Object.keys(obj);
      for (var i$1 = 0; i$1 < keys.length; i$1 += 1) {
        if (callback.call(obj[keys[i$1]], keys[i$1], obj[keys[i$1]]) === false) {
          return obj;
        }
      }
    }

    return obj;
  }

  /**
   * 遍历数组或对象，通过函数返回一个新的数组或对象，null 和 undefined 将被过滤掉。
   * @param elems
   * @param callback
   * @returns {Array}
   */
  function map(elems, callback) {
    var ref;

    var value;
    var ret = [];

    each(elems, function (i, elem) {
      value = callback(elem, i);

      if (value !== null && value !== undefined) {
        ret.push(value);
      }
    });

    return (ref = []).concat.apply(ref, ret);
  }

  /**
   * 把对象合并到第一个参数中，并返回第一个参数
   * @param first
   * @param second
   * @returns {*}
   */
  function merge(first, second) {
    each(second, function (i, val) {
      first.push(val);
    });

    return first;
  }

  /**
   * 删除数组中重复元素
   * @param arr {Array}
   * @returns {Array}
   */
  function unique(arr) {
    var result = [];

    for (var i = 0; i < arr.length; i += 1) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }

    return result;
  }

  var elementDisplay = {};

  /**
   * 获取元素的默认 display 样式值，用于 .show() 方法
   * @param nodeName
   * @returns {*}
   */
  function defaultDisplay(nodeName) {
    var element;
    var display;

    if (!elementDisplay[nodeName]) {
      element = document.createElement(nodeName);
      document.body.appendChild(element);
      display = getComputedStyle(element, '').getPropertyValue('display');
      element.parentNode.removeChild(element);
      if (display === 'none') {
        display = 'block';
      }

      elementDisplay[nodeName] = display;
    }

    return elementDisplay[nodeName];
  }

  $.extend({
    each: each,
    merge: merge,
    unique: unique,
    map: map,

    /**
     * 一个 DOM 节点是否包含另一个 DOM 节点
     * @param parent {Node} 父节点
     * @param node {Node} 子节点
     * @returns {Boolean}
     */
    contains: function contains(parent, node) {
      if (parent && !node) {
        return document.documentElement.contains(parent);
      }

      return parent !== node && parent.contains(node);
    },

    /**
     * 将数组或对象序列化
     * @param obj
     * @returns {String}
     */
    param: function param(obj) {
      if (!isObjectLike(obj)) {
        return '';
      }

      var args = [];

      function destructure(key, value) {
        var keyTmp;

        if (isObjectLike(value)) {
          each(value, function (i, v) {
            if (Array.isArray(value) && !isObjectLike(v)) {
              keyTmp = '';
            } else {
              keyTmp = i;
            }

            destructure((key + "[" + keyTmp + "]"), v);
          });
        } else {
          if (value !== null && value !== '') {
            keyTmp = "=" + (encodeURIComponent(value));
          } else {
            keyTmp = '';
          }

          args.push(encodeURIComponent(key) + keyTmp);
        }
      }

      each(obj, function (key, value) {
        destructure(key, value);
      });

      return args.join('&');
    },
  });

  $.fn.extend({
    /**
     * 遍历对象
     * @param callback {Function}
     * @return {JQ}
     */
    each: function each$1(callback) {
      return each(this, callback);
    },

    /**
     * 通过遍历集合中的节点对象，通过函数返回一个新的对象，null 或 undefined 将被过滤掉。
     * @param callback {Function}
     * @returns {JQ}
     */
    map: function map$1(callback) {
      return new JQ(map(this, function (el, i) { return callback.call(el, i, el); }));
    },

    /**
     * 获取指定 DOM 元素，没有 index 参数时，获取所有 DOM 的数组
     * @param index {Number=}
     * @returns {Node|Array}
     */
    get: function get(index) {
      return index === undefined
        ? [].slice.call(this)
        : this[index >= 0 ? index : index + this.length];
    },

    /**
     * array中提取的方法。从start开始，如果end 指出。提取不包含end位置的元素。
     * @param args {start, end}
     * @returns {JQ}
     */
    slice: function slice() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      return new JQ([].slice.apply(this, args));
    },

    /**
     * 筛选元素集合
     * @param selector {String|JQ|Node|Function}
     * @returns {JQ}
     */
    filter: function filter(selector) {
      if (isFunction(selector)) {
        return this.map(function (index, ele) { return (selector.call(ele, index, ele) ? ele : undefined); });
      }

      var $selector = $(selector);

      return this.map(function (index, ele) { return ($selector.index(ele) > -1 ? ele : undefined); });
    },

    /**
     * 从元素集合中删除指定的元素
     * @param selector {String|Node|JQ|Function}
     * @return {JQ}
     */
    not: function not(selector) {
      var $excludes = this.filter(selector);

      return this.map(function (index, ele) { return ($excludes.index(ele) > -1 ? undefined : ele); });
    },

    /**
     * 获取元素相对于 document 的偏移
     * @returns {Object}
     */
    offset: function offset() {
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
    offsetParent: function offsetParent() {
      return this.map(function () {
        var parent = this.offsetParent;

        while (parent && $(parent).css('position') === 'static') {
          parent = parent.offsetParent;
        }

        return parent || document.documentElement;
      });
    },

    /**
     * 获取元素相对于父元素的偏移
     * @return {Object}
     */
    position: function position() {
      var self = this;

      if (!self[0]) {
        return null;
      }

      var offsetParent;
      var offset;
      var parentOffset = {
        top: 0,
        left: 0,
      };

      if (self.css('position') === 'fixed') {
        offset = self[0].getBoundingClientRect();
      } else {
        offsetParent = self.offsetParent();
        offset = self.offset();
        if (!isNodeName(offsetParent[0], 'html')) {
          parentOffset = offsetParent.offset();
        }

        parentOffset = {
          top: parentOffset.top + offsetParent.css('borderTopWidth'),
          left: parentOffset.left + offsetParent.css('borderLeftWidth'),
        };
      }

      return {
        top: offset.top - parentOffset.top - self.css('marginTop'),
        left: offset.left - parentOffset.left - self.css('marginLeft'),
        width: offset.width,
        height: offset.height,
      };
    },

    /**
     * 显示指定元素
     * @returns {JQ}
     */
    show: function show() {
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
    hide: function hide() {
      return this.each(function () {
        this.style.display = 'none';
      });
    },

    /**
     * 切换元素的显示状态
     * @returns {JQ}
     */
    toggle: function toggle() {
      return this.each(function () {
        this.style.display = this.style.display === 'none' ? '' : 'none';
      });
    },

    /**
     * 是否含有指定的 CSS 类
     * @param className {String}
     * @returns {boolean}
     */
    hasClass: function hasClass(className) {
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
    removeAttr: function removeAttr(attr) {
      return this.each(function () {
        this.removeAttribute(attr);
      });
    },

    /**
     * 删除属性值
     * @param name {String}
     * @returns {JQ}
     */
    removeProp: function removeProp(name) {
      return this.each(function () {
        try {
          delete this[name];
        } catch (e) {
          // empty
        }
      });
    },

    /**
     * 获取当前对象中第n个元素
     * @param index {Number}
     * @returns {JQ}
     */
    eq: function eq(index) {
      var ret = index === -1
        ? this.slice(index)
        : this.slice(index, +index + 1);

      return new JQ(ret);
    },

    /**
     * 获取对象中第一个元素
     * @returns {JQ}
     */
    first: function first() {
      return this.eq(0);
    },

    /**
     * 获取对象中最后一个元素
     * @returns {JQ}
     */
    last: function last() {
      return this.eq(-1);
    },

    /**
     * 获取一个元素的位置。
     * 当 elem 参数没有给出时，返回当前元素在兄弟节点中的位置。
     * 有给出了 elem 参数时，返回 elem 元素在当前对象中的位置
     * @param elem {Selector|Node=}
     * @returns {Number}
     */
    index: function index(elem) {
      if (!elem) {
        // 获取当前 JQ 对象的第一个元素在同辈元素中的位置
        return this
          .eq(0)
          .parent()
          .children()
          .get()
          .indexOf(this[0]);
      }

      if (isString(elem)) {
        // 返回当前 JQ 对象的第一个元素在指定选择器对应的元素中的位置
        return $(elem)
          .eq(0)
          .parent()
          .children()
          .get()
          .indexOf(this[0]);
      }

      // 返回指定元素在当前 JQ 对象中的位置
      return this
        .get()
        .indexOf(elem);
    },

    /**
     * 根据选择器、DOM元素或 JQ 对象来检测匹配元素集合，
     * 如果其中至少有一个元素符合这个给定的表达式就返回true
     * @param selector {String|Node|NodeList|Array|JQ|Window}
     * @returns boolean
     */
    is: function is(selector) {
      var self = this[0];

      if (!self || selector === undefined || selector === null) {
        return false;
      }

      if (isString(selector)) {
        if (self === document || self === window) {
          return false;
        }

        var matchesSelector = self.matches
          || self.matchesSelector
          || self.webkitMatchesSelector
          || self.mozMatchesSelector
          || self.oMatchesSelector
          || self.msMatchesSelector;

        return matchesSelector.call(self, selector);
      }

      if (selector === document || selector === window) {
        return self === selector;
      }

      if (selector.nodeType || isArrayLike(selector)) {
        var $compareWith = selector.nodeType ? [selector] : selector;

        for (var i = 0; i < $compareWith.length; i += 1) {
          if ($compareWith[i] === self) {
            return true;
          }
        }

        return false;
      }

      return false;
    },

    /**
     * 根据 CSS 选择器找到后代节点的集合
     * @param selector {String}
     * @returns {JQ}
     */
    find: function find(selector) {
      var foundElements = [];

      this.each(function (i, _this) {
        var nodeType = _this.nodeType;

        if (nodeType !== 1 && nodeType !== 9) {
          // 不是 element 和 document 则跳过
          return;
        }

        merge(foundElements, _this.querySelectorAll(selector));
      });

      return new JQ(foundElements);
    },

    /**
     * 找到直接子元素的元素集合
     * @param selector {String=}
     * @returns {JQ}
     */
    children: function children(selector) {
      var children = [];

      this.each(function (_, _this) {
        each(_this.childNodes, function (__, childNode) {
          if (childNode.nodeType !== 1) {
            return;
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
    has: function has(selector) {
      var $targets = isString(selector) ? this.find(selector) : $(selector);
      var length = $targets.length;

      return this.filter(function () {
        for (var i = 0; i < length; i += 1) {
          if ($.contains(this, $targets[i])) {
            return true;
          }
        }

        return false;
      });
    },

    /**
     * 取得同辈元素的集合
     * @param selector {String=}
     * @returns {JQ}
     */
    siblings: function siblings(selector) {
      return this.prevAll(selector).add(this.nextAll(selector));
    },

    /**
     * 返回首先匹配到的父节点，包含父节点
     * @param selector {String}
     * @returns {JQ}
     */
    closest: function closest(selector) {
      var self = this;

      if (!self.is(selector)) {
        self = self.parents(selector).eq(0);
      }

      return self;
    },

    /**
     * 删除所有匹配的元素
     * @returns {JQ}
     */
    remove: function remove() {
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
    add: function add(selector) {
      return new JQ(unique(merge(this.get(), $(selector))));
    },

    /**
     * 删除子节点
     * @returns {JQ}
     */
    empty: function empty() {
      return this.each(function () {
        this.innerHTML = '';
      });
    },

    /**
     * 通过深度克隆来复制集合中的所有元素。
     * (通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和jquery中利用一个参数来确定是否复制数据和事件处理不相同。)
     * @returns {JQ}
     */
    clone: function clone() {
      return this.map(function () {
        return this.cloneNode(true);
      });
    },

    /**
     * 用新元素替换当前元素
     * @param newContent {String|Node|NodeList|JQ}
     * @returns {JQ}
     */
    replaceWith: function replaceWith(newContent) {
      return this.before(newContent).remove();
    },

    /**
     * 将表单元素的值组合成键值对数组
     * @returns {Array}
     */
    serializeArray: function serializeArray() {
      var result = [];
      var elem = this[0];

      if (!elem || !elem.elements) {
        return result;
      }

      $([].slice.call(elem.elements)).each(function () {
        var $elem = $(this);
        var type = $elem.attr('type');
        if (
          this.nodeName.toLowerCase() !== 'fieldset'
          && !this.disabled
          && ['submit', 'reset', 'button'].indexOf(type) === -1
          && (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
        ) {
          result.push({
            name: $elem.attr('name'),
            value: $elem.val(),
          });
        }
      });

      return result;
    },

    /**
     * 将表单元素或对象序列化
     * @returns {String}
     */
    serialize: function serialize() {
      var result = [];

      each(this.serializeArray(), function (i, elem) {
        result.push(((encodeURIComponent(elem.name)) + "=" + (encodeURIComponent(elem.value))));
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
      }

      // 设置值
      return this.each(function (i, elem) {
        elem[props[nameIndex]] = value;
      });
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
    function set(elem, key, value) {
      if (nameIndex === 0) {
        elem.setAttribute(key, value);
      } else if (nameIndex === 1) {
        elem[key] = value;
      } else {
        elem.style[key] = value;
      }
    }

    function get(elem, key) {
      if (!elem) {
        return undefined;
      }

      if (nameIndex === 0) {
        return elem.getAttribute(key);
      }

      if (nameIndex === 1) {
        return elem[key];
      }

      return window.getComputedStyle(elem, null).getPropertyValue(key);
    }

    $.fn[name] = function (key, value) {
      var argLength = arguments.length;

      if (argLength === 1 && isString(key)) {
        // 获取值
        return get(this[0], key);
      }

      // 设置值
      return this.each(function (i, elem) {
        if (argLength === 2) {
          set(elem, key, value);
        } else {
          each(key, function (k, v) {
            set(elem, k, v);
          });
        }
      });
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
    $.fn[(name + "Class")] = function (className) {
      if (!className) {
        return this;
      }

      var classes = className.split(' ');

      return this.each(function (i, elem) {
        each(classes, function (j, cls) {
          elem.classList[name](cls);
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
        var elem = this[0];

        if (isWindow(elem)) {
          return elem[("inner" + prop)];
        }

        if (isDocument(elem)) {
          return elem.documentElement[("scroll" + prop)];
        }

        var $elem = $(elem);

        // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
        var IEFixValue = 0;
        var isWidth = name === 'width';
        if ('ActiveXObject' in window) { // 判断是 IE 浏览器
          if ($elem.css('box-sizing') === 'border-box') {
            IEFixValue = parseFloat($elem.css(("padding-" + (isWidth ? 'left' : 'top'))))
              + parseFloat($elem.css(("padding-" + ((isWidth ? 'right' : 'bottom')))))
              + parseFloat($elem.css(("border-" + (isWidth ? 'left' : 'top') + "-width")))
              + parseFloat($elem.css(("border-" + (isWidth ? 'right' : 'bottom') + "-width")));
          }
        }

        return parseFloat($(elem).css(name)) + IEFixValue;
      }

      // 设置
      /* eslint no-restricted-globals: 0 */
      if (!isNaN(Number(val)) && val !== '') {
        val += 'px';
      }

      return this.css(name, val);
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
    $.fn[("inner" + prop)] = function () {
      var value = this[name]();
      var $elem = $(this[0]);

      if ($elem.css('box-sizing') !== 'border-box') {
        value += parseFloat($elem.css(("padding-" + (name === 'width' ? 'left' : 'top'))));
        value += parseFloat($elem.css(("padding-" + (name === 'width' ? 'right' : 'bottom'))));
      }

      return value;
    };
  });

  function dir(nodes, selector, nameIndex, node) {
    var ret = [];
    var elem;

    nodes.each(function (j, _this) {
      elem = _this[node];
      while (elem) {
        if (nameIndex === 2) {
          // prevUntil
          if (!selector || (selector && $(elem).is(selector))) {
            break;
          }

          ret.push(elem);
        } else if (nameIndex === 0) {
          // prev
          if (!selector || (selector && $(elem).is(selector))) {
            ret.push(elem);
          }

          break;
        } else if (!selector || (selector && $(elem).is(selector))) {
          // prevAll
          ret.push(elem);
        }

        elem = elem[node];
      }
    });

    return new JQ(unique(ret));
  }

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
    $.fn[("prev" + name)] = function (selector) {
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
    $.fn[("next" + name)] = function (selector) {
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
    $.fn[("parent" + name)] = function (selector) {
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

      if (isString(newChild) && (newChild[0] !== '<' || newChild[newChild.length - 1] !== '>')) {
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;
        newChilds = [].slice.call(tempDiv.childNodes);
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
      var $elem = $(selector);

      return this.each(function (i, _this) {
        $elem.each(function (j, elem) {
          elem.parentNode.insertBefore(
            $elem.length === 1 ? _this : _this.cloneNode(true),
            nameIndex === 0 ? elem : elem.nextSibling
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

  var dataNS = 'mduiElementDataStorage';

  $.extend({
    /**
     * 在指定元素上存储数据，或从指定元素上读取数据
     * @param elem 必须， DOM 元素
     * @param key 必须，键名
     * @param value 可选，值
     */
    data: function data(elem, key, value) {
      var data = {};

      if (value !== undefined) {
        // 根据 key、value 设置值
        data[key] = value;
      } else if (isObjectLike(key)) {
        // 根据键值对设置值
        data = key;
      } else if (key === undefined) {
        // 获取所有值
        var result = {};

        each(elem.attributes, function (i, attribute) {
          var name = attribute.name;

          if (name.indexOf('data-') === 0) {
            var prop = name.slice(5).replace(/-./g, function (u) { return u.charAt(1).toUpperCase(); });

            result[prop] = attribute.value;
          }
        });

        if (elem[dataNS]) {
          each(elem[dataNS], function (k, v) {
            result[k] = v;
          });
        }

        return result;
      } else if (elem[dataNS] && (key in elem[dataNS])) {
        // 获取指定值
        return elem[dataNS][key];
      } else {
        // 从 data- 中获取指定值
        var dataKey = elem.getAttribute(("data-" + key));

        if (dataKey) {
          return dataKey;
        }

        return undefined;
      }

      // 设置值
      if (!elem[dataNS]) {
        elem[dataNS] = {};
      }

      each(data, function (k, v) {
        elem[dataNS][k] = v;
      });

      return undefined;
    },

    /**
     * 移除指定元素上存放的数据
     * @param elem 必须，DOM 元素
     * @param key 必须，键名
     */
    removeData: function removeData(elem, key) {
      if (elem[dataNS] && elem[dataNS][key]) {
        elem[dataNS][key] = null;
        delete elem[dataNS][key];
      }
    },
  });

  $.fn.extend({
    /**
     * 在元素上读取或设置数据
     * @param key 必须
     * @param value
     * @returns {*}
     */
    data: function data(key, value) {
      if (value === undefined) {
        if (isObjectLike(key)) {
          // 同时设置多个值
          return this.each(function (i, elem) {
            $.data(elem, key);
          });
        }

        if (this[0]) {
          // 获取值
          return $.data(this[0], key);
        }

        return undefined;
      }

      // 设置值
      return this.each(function (i, elem) {
        $.data(elem, key, value);
      });
    },

    /**
     * 移除元素上存储的数据
     * @param key 必须
     * @returns {*}
     */
    removeData: function removeData(key) {
      return this.each(function (i, elem) {
        $.removeData(elem, key);
      });
    },
  });

  !function(){try{return new e("test")}catch(e){}var e=function(e,t){t=t||{bubbles:!1,cancelable:!1};var n=document.createEvent("MouseEvent");return n.initMouseEvent(e,t.bubbles,t.cancelable,window,0,0,0,0,0,!1,!1,!1,!1,0,null),n};e.prototype=Event.prototype,window.MouseEvent=e;}();

  !function(){function t(t,e){e=e||{bubbles:!1,cancelable:!1,detail:void 0};var n=document.createEvent("CustomEvent");return n.initCustomEvent(t,e.bubbles,e.cancelable,e.detail),n}"function"!=typeof window.CustomEvent&&(t.prototype=window.Event.prototype,window.CustomEvent=t);}();

  // 存储事件
  var handlers = {
    // i: { // 元素ID
    //   j: { // 事件ID
    //     e: 事件名
    //     fn: 事件处理函数
    //     i: 事件ID
    //     proxy:
    //     sel: 选择器
    //   }
    // }
  };

  // 元素ID
  var mduiElementId = 1;

  function fnFalse() {
    return false;
  }

  /**
   * 为元素赋予一个唯一的ID
   * @param element
   * @returns {number|*}
   */
  function getElementId(element) {
    if (!element.mduiElementId) {
      mduiElementId += 1;
      element.mduiElementId = mduiElementId;
    }

    return element.mduiElementId;
  }

  /**
   * 获取匹配的事件
   * @param element
   * @param eventName
   * @param func
   * @param selector
   * @returns {Array}
   */
  function getHandlers(element, eventName, func, selector) {
    return (handlers[getElementId(element)] || []).filter(function (handler) { return handler
      && (!eventName || handler.e === eventName)
      && (!func || handler.fn.toString() === func.toString())
      && (!selector || handler.sel === selector); });
  }

  /**
   * 添加事件监听
   * @param element
   * @param eventName
   * @param func
   * @param data
   * @param selector
   */
  function add(element, eventName, func, data, selector) {
    var elementId = getElementId(element);

    if (!handlers[elementId]) {
      handlers[elementId] = [];
    }

    // 传入 data.useCapture 来设置 useCapture: true
    var useCapture = false;
    if (isObjectLike(data) && data.useCapture) {
      useCapture = true;
    }

    eventName.split(' ').forEach(function (event) {
      var handler = {
        e: event,
        fn: func,
        sel: selector,
        i: handlers[elementId].length,
      };

      function callFn(e, elem) {
        // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
        /* eslint no-underscore-dangle: 0 */
        var result = func.apply(elem, e._detail === undefined ? [e] : [e].concat(e._detail));

        if (result === false) {
          e.preventDefault();
          e.stopPropagation();
        }
      }

      function proxyfn(e) {
        e._data = data;

        if (selector) {
          // 事件代理
          $(element)
            .find(selector)
            .get()
            .reverse()
            .forEach(function (elem) {
              if (elem === e.target || $.contains(elem, e.target)) {
                callFn(e, elem);
              }
            });
        } else {
          // 不使用事件代理
          callFn(e, element);
        }
      }

      handler.proxy = proxyfn;
      handlers[elementId].push(handler);
      element.addEventListener(handler.e, proxyfn, useCapture);
    });
  }

  /**
   * 移除事件监听
   * @param element
   * @param eventName
   * @param func
   * @param selector
   */
  function remove(element, eventName, func, selector) {
    (eventName || '').split(' ').forEach(function (event) {
      getHandlers(element, event, func, selector).forEach(function (handler) {
        delete handlers[getElementId(element)][handler.i];
        element.removeEventListener(handler.e, handler.proxy, false);
      });
    });
  }

  $.fn.extend({
    /**
     * DOM 加载完毕后调用的函数
     * @param callback
     * @returns {ready}
     */
    ready: function ready(callback) {
      if (/complete|loaded|interactive/.test(document.readyState) && document.body) {
        callback($);
      } else {
        document.addEventListener('DOMContentLoaded', function () {
          callback($);
        }, false);
      }

      return this;
    },

    /**
     * 绑定事件
     *
     * $().on({eventName: fn}, selector, data);
     * $().on({eventName: fn}, selector)
     * $().on({eventName: fn})
     * $().on(eventName, selector, data, fn);
     * $().on(eventName, selector, fn);
     * $().on(eventName, data, fn);
     * $().on(eventName, fn);
     * $().on(eventName, false);
     *
     * @param eventName
     * @param selector
     * @param data
     * @param callback
     * @param one 是否是 one 方法，只在 JQ 内部使用
     * @returns
     */
    on: function on(eventName, selector, data, callback, one) {
      var self = this;

      // 默认
      // $().on(event, selector, data, callback)

      // event 使用 事件:函数 键值对
      // event = {
      //   'event1': callback1,
      //   'event2': callback2
      // }
      //
      // $().on(event, selector, data)
      if (eventName && !isString(eventName)) {
        each(eventName, function (type, fn) {
          self.on(type, selector, data, fn);
        });

        return self;
      }

      // selector 不存在
      // $().on(event, data, callback)
      if (!isString(selector) && !isFunction(callback) && callback !== false) {
        callback = data;
        data = selector;
        selector = undefined;
      }

      // data 不存在
      // $().on(event, callback)
      if (isFunction(data) || data === false) {
        callback = data;
        data = undefined;
      }

      // callback 为 false
      // $().on(event, false)
      if (callback === false) {
        callback = fnFalse;
      }

      if (one === 1) {
        var origCallback = callback;
        callback = function () {
          self.off(eventName, selector, callback);
          /* eslint prefer-rest-params: 0 */
          return origCallback.apply(this, arguments);
        };
      }

      return this.each(function () {
        add(this, eventName, callback, data, selector);
      });
    },

    /**
     * 绑定事件，只触发一次
     * @param eventName
     * @param selector
     * @param data
     * @param callback
     */
    one: function one(eventName, selector, data, callback) {
      var self = this;

      if (!isString(eventName)) {
        each(eventName, function (type, fn) {
          type.split(' ').forEach(function (eName) {
            self.on(eName, selector, data, fn, 1);
          });
        });
      } else {
        eventName.split(' ').forEach(function (eName) {
          self.on(eName, selector, data, callback, 1);
        });
      }

      return this;
    },

    /**
     * 取消绑定事件
     *
     * $().off(eventName, selector);
     * $().off(eventName, callback);
     * $().off(eventName, false);
     *
     */
    off: function off(eventName, selector, callback) {
      var self = this;

      // event 使用 事件:函数 键值对
      // event = {
      //   'event1': callback1,
      //   'event2': callback2
      // }
      //
      // $().off(event, selector)
      if (eventName && !isString(eventName)) {
        each(eventName, function (type, fn) {
          self.off(type, selector, fn);
        });

        return self;
      }

      // selector 不存在
      // $().off(event, callback)
      if (!isString(selector) && !isFunction(callback) && callback !== false) {
        callback = selector;
        selector = undefined;
      }

      // callback 为 false
      // $().off(event, false)
      if (callback === false) {
        callback = fnFalse;
      }

      return self.each(function () {
        remove(this, eventName, callback, selector);
      });
    },

    /**
     * 触发一个事件
     * @param eventName
     * @param data
     * @returns {*|JQ}
     */
    trigger: function trigger(eventName, data) {
      var isMouseEvent = ['click', 'mousedown', 'mouseup', 'mousemove'].indexOf(eventName) > -1;
      var evt;

      if (isMouseEvent) {
        // Note: MouseEvent 无法传入 detail 参数
        evt = new MouseEvent(eventName, {
          bubbles: true,
          cancelable: true,
        });
      } else {
        evt = new CustomEvent(eventName, {
          detail: data,
          bubbles: true,
          cancelable: true,
        });
      }

      evt._detail = data;

      return this.each(function () {
        this.dispatchEvent(evt);
      });
    },
  });

  var globalOptions = {};
  var jsonpID = 0;

  // 全局事件名
  var ajaxEvent = {
    ajaxStart: 'start.mdui.ajax',
    ajaxSuccess: 'success.mdui.ajax',
    ajaxError: 'error.mdui.ajax',
    ajaxComplete: 'complete.mdui.ajax',
  };

  /**
   * 判断此请求方法是否通过查询字符串提交参数
   * @param method 请求方法，大写
   * @returns {boolean}
   */
  function isQueryStringData(method) {
    return ['GET', 'HEAD'].indexOf(method) >= 0;
  }

  /**
   * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
   * @param url
   * @param query 参数 key=value
   * @returns {string}
   */
  function appendQuery(url, query) {
    return ((url + "&" + query)).replace(/[&?]{1,2}/, '?');
  }

  $.extend({

    /**
     * 为 ajax 请求设置全局配置参数
     * @param options
     */
    ajaxSetup: function ajaxSetup(options) {
      $.extend(globalOptions, options || {});
    },

    /**
     * 发送 ajax 请求
     * @param options
     */
    ajax: function ajax(options) {
      // 配置参数
      var defaults = {
        // 请求方式
        method: 'GET',
        // 请求的数据，查询字符串或对象
        data: false,
        // 是否把数据转换为查询字符串发送，为 false 时不进行自动转换。
        processData: true,
        // 是否为异步请求
        async: true,
        // 是否从缓存中读取，只对 GET/HEAD 请求有效，dataType 为 jsonp 时为 false
        cache: true,
        // HTTP 访问认证的用户名
        username: '',
        // HTTP 访问认证的密码
        password: '',
        // 一个键值对，随着请求一起发送
        headers: {},
        // 设置 XHR 对象
        xhrFields: {},
        // 一个 HTTP 代码和函数的对象
        statusCode: {},
        // 预期服务器返回的数据类型 text、json、jsonp
        dataType: 'text',
        // jsonp 请求的回调函数名称
        jsonp: 'callback',
        // （string 或 Function）使用指定的回调函数名代替自动生成的回调函数名
        jsonpCallback: function () {
          jsonpID += 1;

          return ("mduijsonp_" + (Date.now()) + "_" + jsonpID);
        },
        // 发送信息至服务器时内容编码类型
        contentType: 'application/x-www-form-urlencoded',
        // 设置请求超时时间（毫秒）
        timeout: 0,
        // 是否在 document 上触发全局 ajax 事件
        global: true,
        // beforeSend:    function (XMLHttpRequest) 请求发送前执行，返回 false 可取消本次 ajax 请求
        // success:       function (data, textStatus, XMLHttpRequest) 请求成功时调用
        // error:         function (XMLHttpRequest, textStatus) 请求失败时调用
        // statusCode:    {404: function ()}
        //                200-299之间的状态码表示成功，参数和 success 回调一样；其他状态码表示失败，参数和 error 回调一样
        // complete:      function (XMLHttpRequest, textStatus) 请求完成后回调函数 (请求成功或失败之后均调用)
      };

      // 回调函数
      var callbacks = [
        'beforeSend',
        'success',
        'error',
        'statusCode',
        'complete' ];

      // 是否已取消请求
      var isCanceled = false;

      // 保存全局配置
      var globals = globalOptions;

      // 事件参数
      var eventParams = {};

      // 合并全局参数到默认参数，全局回调函数不覆盖
      each(globals, function (key, value) {
        if (callbacks.indexOf(key) < 0) {
          defaults[key] = value;
        }
      });

      // 参数合并
      options = $.extend({}, defaults, options);

      /**
       * 触发全局事件
       * @param event string 事件名
       * @param xhr XMLHttpRequest 事件参数
       */
      function triggerEvent(event, xhr) {
        if (options.global) {
          $(document).trigger(event, xhr);
        }
      }

      /**
       * 触发 XHR 回调和事件
       * @param callback string 回调函数名称
       * @param args
       */
      function triggerCallback(callback) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

        var result1;
        var result2;

        if (callback) {
          // 全局回调
          if (callback in globals) {
            result1 = globals[callback].apply(globals, args);
          }

          // 自定义回调
          if (options[callback]) {
            result2 = options[callback].apply(options, args);
          }

          // beforeSend 回调返回 false 时取消 ajax 请求
          if (callback === 'beforeSend' && (result1 === false || result2 === false)) {
            isCanceled = true;
          }
        }
      }

      // 请求方式转为大写
      var method = options.method.toUpperCase();

      // 默认使用当前页面 URL
      if (!options.url) {
        options.url = window.location.toString();
      }

      // 需要发送的数据
      // GET/HEAD 请求和 processData 为 true 时，转换为查询字符串格式，特殊格式不转换
      var sendData;
      if (
        (isQueryStringData(method) || options.processData)
        && options.data
        && [ArrayBuffer, Blob, Document, FormData].indexOf(options.data.constructor) < 0
      ) {
        sendData = isString(options.data) ? options.data : $.param(options.data);
      } else {
        sendData = options.data;
      }

      // 对于 GET、HEAD 类型的请求，把 data 数据添加到 URL 中
      if (isQueryStringData(method) && sendData) {
        // 查询字符串拼接到 URL 中
        options.url = appendQuery(options.url, sendData);
        sendData = null;
      }

      // JSONP
      if (options.dataType === 'jsonp') {
        // URL 中添加自动生成的回调函数名
        var callbackName = isFunction(options.jsonpCallback)
          ? options.jsonpCallback()
          : options.jsonpCallback;
        var requestUrl = appendQuery(options.url, ((options.jsonp) + "=" + callbackName));

        eventParams.options = options;

        triggerEvent(ajaxEvent.ajaxStart, eventParams);
        triggerCallback('beforeSend', null);

        if (isCanceled) {
          return undefined;
        }

        var abortTimeout;

        // 创建 script
        var script = document.createElement('script');
        script.type = 'text/javascript';

        // 创建 script 失败
        script.onerror = function () {
          if (abortTimeout) {
            clearTimeout(abortTimeout);
          }

          triggerEvent(ajaxEvent.ajaxError, eventParams);
          triggerCallback('error', null, 'scripterror');

          triggerEvent(ajaxEvent.ajaxComplete, eventParams);
          triggerCallback('complete', null, 'scripterror');
        };

        script.src = requestUrl;

        // 处理
        window[callbackName] = function (data) {
          if (abortTimeout) {
            clearTimeout(abortTimeout);
          }

          eventParams.data = data;

          triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
          triggerCallback('success', data, 'success', null);

          $(script).remove();
          script = null;
          delete window[callbackName];
        };

        $('head').append(script);

        if (options.timeout > 0) {
          abortTimeout = setTimeout(function () {
            $(script).remove();
            script = null;

            triggerEvent(ajaxEvent.ajaxError, eventParams);
            triggerCallback('error', null, 'timeout');
          }, options.timeout);
        }

        return undefined;
      }

      // GET/HEAD 请求的缓存处理
      if (isQueryStringData(method) && !options.cache) {
        options.url = appendQuery(options.url, ("_=" + (Date.now())));
      }

      // 创建 XHR
      var xhr = new XMLHttpRequest();

      xhr.open(method, options.url, options.async, options.username, options.password);

      if (
        options.contentType
        || (
          sendData
          && !isQueryStringData(method)
          && options.contentType !== false
        )
      ) {
        xhr.setRequestHeader('Content-Type', options.contentType);
      }

      // 设置 Accept
      if (options.dataType === 'json') {
        xhr.setRequestHeader('Accept', 'application/json, text/javascript');
      }

      // 添加 headers
      if (options.headers) {
        each(options.headers, function (key, value) {
          xhr.setRequestHeader(key, value);
        });
      }

      // 检查是否是跨域请求
      if (options.crossDomain === undefined) {
        options.crossDomain = /^([\w-]+:)?\/\/([^/]+)/.test(options.url)
          && RegExp.$2 !== window.location.host;
      }

      if (!options.crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
      }

      if (options.xhrFields) {
        each(options.xhrFields, function (key, value) {
          xhr[key] = value;
        });
      }

      eventParams.xhr = xhr;
      eventParams.options = options;

      var xhrTimeout;

      xhr.onload = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        // 包含成功或错误代码的字符串
        var textStatus;

        // AJAX 返回的 HTTP 响应码是否表示成功
        var isHttpStatusSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 0;

        var responseData;

        if (isHttpStatusSuccess) {
          if (xhr.status === 204 || method === 'HEAD') {
            textStatus = 'nocontent';
          } else if (xhr.status === 304) {
            textStatus = 'notmodified';
          } else {
            textStatus = 'success';
          }

          if (options.dataType === 'json') {
            try {
              responseData = JSON.parse(xhr.responseText);
              eventParams.data = responseData;
            } catch (err) {
              textStatus = 'parsererror';

              triggerEvent(ajaxEvent.ajaxError, eventParams);
              triggerCallback('error', xhr, textStatus);
            }

            if (textStatus !== 'parsererror') {
              triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
              triggerCallback('success', responseData, textStatus, xhr);
            }
          } else {
            responseData = xhr.responseType === 'text' || xhr.responseType === ''
              ? xhr.responseText
              : xhr.response;
            eventParams.data = responseData;

            triggerEvent(ajaxEvent.ajaxSuccess, eventParams);
            triggerCallback('success', responseData, textStatus, xhr);
          }
        } else {
          textStatus = 'error';

          triggerEvent(ajaxEvent.ajaxError, eventParams);
          triggerCallback('error', xhr, textStatus);
        }

        // statusCode
        each([globals.statusCode, options.statusCode], function (i, func) {
          if (func && func[xhr.status]) {
            if (isHttpStatusSuccess) {
              func[xhr.status](responseData, textStatus, xhr);
            } else {
              func[xhr.status](xhr, textStatus);
            }
          }
        });

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, textStatus);
      };

      xhr.onerror = function () {
        if (xhrTimeout) {
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvent.ajaxError, eventParams);
        triggerCallback('error', xhr, xhr.statusText);

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, 'error');
      };

      xhr.onabort = function () {
        var textStatus = 'abort';

        if (xhrTimeout) {
          textStatus = 'timeout';
          clearTimeout(xhrTimeout);
        }

        triggerEvent(ajaxEvent.ajaxError, eventParams);
        triggerCallback('error', xhr, textStatus);

        triggerEvent(ajaxEvent.ajaxComplete, eventParams);
        triggerCallback('complete', xhr, textStatus);
      };

      // ajax start 回调
      triggerEvent(ajaxEvent.ajaxStart, eventParams);
      triggerCallback('beforeSend', xhr);

      if (isCanceled) {
        return xhr;
      }

      // Timeout
      if (options.timeout > 0) {
        xhrTimeout = setTimeout(function () {
          xhr.abort();
        }, options.timeout);
      }

      // 发送 XHR
      xhr.send(sendData);

      return xhr;
    },
  });

  // 监听全局事件
  //
  // 通过 $(document).on('success.mdui.ajax', function (event, params) {}) 调用时，包含两个参数
  // event: 事件对象
  // params: {
  //   xhr: XMLHttpRequest 对象
  //   options: ajax 请求的配置参数
  //   data: ajax 请求返回的数据
  // }

  // 全局 Ajax 事件快捷方法
  // $(document).ajaxStart(function (event, xhr, options) {})
  // $(document).ajaxSuccess(function (event, xhr, options, data) {})
  // $(document).ajaxError(function (event, xhr, options) {})
  // $(document).ajaxComplete(function (event, xhr, options) {})
  each(ajaxEvent, function (name, eventName) {
    $.fn[name] = function (fn) {
      return this.on(eventName, function (e, params) {
        fn(e, params.xhr, params.options, params.data);
      });
    };
  });

  return $;

}());
