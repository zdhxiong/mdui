import JQ from './JQ';
import $ from './$';
import {
  each,
  map,
  merge,
  unique,
  isObjectLike,
  isFunction,
  isNodeName,
  isString,
  isWindow,
  isDocument,
  isArrayLike,
} from './utils';

const elementDisplay = {};

/**
 * 获取元素的默认 display 样式值，用于 .show() 方法
 * @param nodeName
 * @returns {*}
 */
function defaultDisplay(nodeName) {
  let element;
  let display;

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
  each,
  merge,
  unique,
  map,

  /**
   * 一个 DOM 节点是否包含另一个 DOM 节点
   * @param parent {Node} 父节点
   * @param node {Node} 子节点
   * @returns {Boolean}
   */
  contains(parent, node) {
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
  param(obj) {
    if (!isObjectLike(obj)) {
      return '';
    }

    const args = [];

    function destructure(key, value) {
      let keyTmp;

      if (isObjectLike(value)) {
        each(value, (i, v) => {
          if (Array.isArray(value) && !isObjectLike(v)) {
            keyTmp = '';
          } else {
            keyTmp = i;
          }

          destructure(`${key}[${keyTmp}]`, v);
        });
      } else {
        if (value !== null && value !== '') {
          keyTmp = `=${encodeURIComponent(value)}`;
        } else {
          keyTmp = '';
        }

        args.push(encodeURIComponent(key) + keyTmp);
      }
    }

    each(obj, (key, value) => {
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
  each(callback) {
    return each(this, callback);
  },

  /**
   * 通过遍历集合中的节点对象，通过函数返回一个新的对象，null 或 undefined 将被过滤掉。
   * @param callback {Function}
   * @returns {JQ}
   */
  map(callback) {
    return new JQ(map(this, (el, i) => callback.call(el, i, el)));
  },

  /**
   * 获取指定 DOM 元素，没有 index 参数时，获取所有 DOM 的数组
   * @param index {Number=}
   * @returns {Node|Array}
   */
  get(index) {
    return index === undefined
      ? [].slice.call(this)
      : this[index >= 0 ? index : index + this.length];
  },

  /**
   * array中提取的方法。从start开始，如果end 指出。提取不包含end位置的元素。
   * @param args {start, end}
   * @returns {JQ}
   */
  slice(...args) {
    return new JQ([].slice.apply(this, args));
  },

  /**
   * 筛选元素集合
   * @param selector {String|JQ|Node|Function}
   * @returns {JQ}
   */
  filter(selector) {
    if (isFunction(selector)) {
      return this.map((index, ele) => (selector.call(ele, index, ele) ? ele : undefined));
    }

    const $selector = $(selector);

    return this.map((index, ele) => ($selector.index(ele) > -1 ? ele : undefined));
  },

  /**
   * 从元素集合中删除指定的元素
   * @param selector {String|Node|JQ|Function}
   * @return {JQ}
   */
  not(selector) {
    const $excludes = this.filter(selector);

    return this.map((index, ele) => ($excludes.index(ele) > -1 ? undefined : ele));
  },

  /**
   * 获取元素相对于 document 的偏移
   * @returns {Object}
   */
  offset() {
    if (this[0]) {
      const offset = this[0].getBoundingClientRect();

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
  offsetParent() {
    return this.map(function () {
      let parent = this.offsetParent;

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
  position() {
    const self = this;

    if (!self[0]) {
      return null;
    }

    let offsetParent;
    let offset;
    let parentOffset = {
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
  show() {
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
  hide() {
    return this.each(function () {
      this.style.display = 'none';
    });
  },

  /**
   * 切换元素的显示状态
   * @returns {JQ}
   */
  toggle() {
    return this.each(function () {
      this.style.display = this.style.display === 'none' ? '' : 'none';
    });
  },

  /**
   * 是否含有指定的 CSS 类
   * @param className {String}
   * @returns {boolean}
   */
  hasClass(className) {
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
  removeAttr(attr) {
    return this.each(function () {
      this.removeAttribute(attr);
    });
  },

  /**
   * 删除属性值
   * @param name {String}
   * @returns {JQ}
   */
  removeProp(name) {
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
  eq(index) {
    const ret = index === -1
      ? this.slice(index)
      : this.slice(index, +index + 1);

    return new JQ(ret);
  },

  /**
   * 获取对象中第一个元素
   * @returns {JQ}
   */
  first() {
    return this.eq(0);
  },

  /**
   * 获取对象中最后一个元素
   * @returns {JQ}
   */
  last() {
    return this.eq(-1);
  },

  /**
   * 获取一个元素的位置。
   * 当 elem 参数没有给出时，返回当前元素在兄弟节点中的位置。
   * 有给出了 elem 参数时，返回 elem 元素在当前对象中的位置
   * @param elem {Selector|Node=}
   * @returns {Number}
   */
  index(elem) {
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
  is(selector) {
    const self = this[0];

    if (!self || selector === undefined || selector === null) {
      return false;
    }

    if (isString(selector)) {
      if (self === document || self === window) {
        return false;
      }

      const matchesSelector = self.matches
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
      const $compareWith = selector.nodeType ? [selector] : selector;

      for (let i = 0; i < $compareWith.length; i += 1) {
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
  find(selector) {
    const foundElements = [];

    this.each((i, _this) => {
      const { nodeType } = _this;

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
  children(selector) {
    const children = [];

    this.each((_, _this) => {
      each(_this.childNodes, (__, childNode) => {
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
  has(selector) {
    const $targets = isString(selector) ? this.find(selector) : $(selector);
    const { length } = $targets;

    return this.filter(function () {
      for (let i = 0; i < length; i += 1) {
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
  siblings(selector) {
    return this.prevAll(selector).add(this.nextAll(selector));
  },

  /**
   * 返回首先匹配到的父节点，包含父节点
   * @param selector {String}
   * @returns {JQ}
   */
  closest(selector) {
    let self = this;

    if (!self.is(selector)) {
      self = self.parents(selector).eq(0);
    }

    return self;
  },

  /**
   * 删除所有匹配的元素
   * @returns {JQ}
   */
  remove() {
    return this.each((i, _this) => {
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
  add(selector) {
    return new JQ(unique(merge(this.get(), $(selector))));
  },

  /**
   * 删除子节点
   * @returns {JQ}
   */
  empty() {
    return this.each(function () {
      this.innerHTML = '';
    });
  },

  /**
   * 通过深度克隆来复制集合中的所有元素。
   * (通过原生 cloneNode 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和jquery中利用一个参数来确定是否复制数据和事件处理不相同。)
   * @returns {JQ}
   */
  clone() {
    return this.map(function () {
      return this.cloneNode(true);
    });
  },

  /**
   * 用新元素替换当前元素
   * @param newContent {String|Node|NodeList|JQ}
   * @returns {JQ}
   */
  replaceWith(newContent) {
    return this.before(newContent).remove();
  },

  /**
   * 将表单元素的值组合成键值对数组
   * @returns {Array}
   */
  serializeArray() {
    const result = [];
    const elem = this[0];

    if (!elem || !elem.elements) {
      return result;
    }

    $([].slice.call(elem.elements)).each(function () {
      const $elem = $(this);
      const type = $elem.attr('type');
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
  serialize() {
    const result = [];

    each(this.serializeArray(), (i, elem) => {
      result.push(`${encodeURIComponent(elem.name)}=${encodeURIComponent(elem.value)}`);
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
each(['val', 'html', 'text'], (nameIndex, name) => {
  const props = {
    0: 'value',
    1: 'innerHTML',
    2: 'textContent',
  };

  const defaults = {
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
    return this.each((i, elem) => {
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
each(['attr', 'prop', 'css'], (nameIndex, name) => {
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
    const argLength = arguments.length;

    if (argLength === 1 && isString(key)) {
      // 获取值
      return get(this[0], key);
    }

    // 设置值
    return this.each((i, elem) => {
      if (argLength === 2) {
        set(elem, key, value);
      } else {
        each(key, (k, v) => {
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
each(['add', 'remove', 'toggle'], (nameIndex, name) => {
  $.fn[`${name}Class`] = function (className) {
    if (!className) {
      return this;
    }

    const classes = className.split(' ');

    return this.each((i, elem) => {
      each(classes, (j, cls) => {
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
}, (prop, name) => {
  $.fn[name] = function (val) {
    if (val === undefined) {
      // 获取
      const elem = this[0];

      if (isWindow(elem)) {
        return elem[`inner${prop}`];
      }

      if (isDocument(elem)) {
        return elem.documentElement[`scroll${prop}`];
      }

      const $elem = $(elem);

      // IE10、IE11 在 box-sizing:border-box 时，不会包含 padding 和 border，这里进行修复
      let IEFixValue = 0;
      const isWidth = name === 'width';
      if ('ActiveXObject' in window) { // 判断是 IE 浏览器
        if ($elem.css('box-sizing') === 'border-box') {
          IEFixValue = parseFloat($elem.css(`padding-${isWidth ? 'left' : 'top'}`))
            + parseFloat($elem.css(`padding-${(isWidth ? 'right' : 'bottom')}`))
            + parseFloat($elem.css(`border-${isWidth ? 'left' : 'top'}-width`))
            + parseFloat($elem.css(`border-${isWidth ? 'right' : 'bottom'}-width`));
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
}, (prop, name) => {
  $.fn[`inner${prop}`] = function () {
    let value = this[name]();
    const $elem = $(this[0]);

    if ($elem.css('box-sizing') !== 'border-box') {
      value += parseFloat($elem.css(`padding-${name === 'width' ? 'left' : 'top'}`));
      value += parseFloat($elem.css(`padding-${name === 'width' ? 'right' : 'bottom'}`));
    }

    return value;
  };
});

function dir(nodes, selector, nameIndex, node) {
  const ret = [];
  let elem;

  nodes.each((j, _this) => {
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
each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`prev${name}`] = function (selector) {
    // prevAll、prevUntil 需要把元素的顺序倒序处理，以便和 jQuery 的结果一致
    const $nodes = nameIndex === 0 ? this : $(this.get().reverse());

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
each(['', 'All', 'Until'], (nameIndex, name) => {
  $.fn[`next${name}`] = function (selector) {
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
each(['', 's', 'sUntil'], (nameIndex, name) => {
  $.fn[`parent${name}`] = function (selector) {
    // parents、parentsUntil 需要把元素的顺序反向处理，以便和 jQuery 的结果一致
    const $nodes = nameIndex === 0 ? this : $(this.get().reverse());

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
each(['append', 'prepend'], (nameIndex, name) => {
  $.fn[name] = function (newChild) {
    let newChilds;
    const copyByClone = this.length > 1;

    if (isString(newChild)) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;
      newChilds = [].slice.call(tempDiv.childNodes);
    } else {
      newChilds = $(newChild).get();
    }

    if (nameIndex === 1) {
      // prepend
      newChilds.reverse();
    }

    return this.each((i, _this) => {
      each(newChilds, (j, child) => {
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
each(['insertBefore', 'insertAfter'], (nameIndex, name) => {
  $.fn[name] = function (selector) {
    const $elem = $(selector);

    return this.each((i, _this) => {
      $elem.each((j, elem) => {
        elem.parentNode.insertBefore(
          $elem.length === 1 ? _this : _this.cloneNode(true),
          nameIndex === 0 ? elem : elem.nextSibling,
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
}, (name, original) => {
  $.fn[name] = function (selector) {
    $(selector)[original](this);
    return this;
  };
});
