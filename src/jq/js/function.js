var emptyArray = [];
var slice = emptyArray.slice;
var concat = emptyArray.concat;
var isArray = Array.isArray;

var documentElement = document.documentElement;

/**
 * 是否是类数组的数据
 * @param obj
 * @returns {boolean}
 */
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
  var i;
  var prop;

  if (isArrayLike(obj)) {
    for (i = 0; i < obj.length; i++) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        return obj;
      }
    }
  } else {
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (callback.call(obj[prop], prop, obj[prop]) === false) {
          return obj;
        }
      }
    }
  }

  return obj;
}

function map(elems, callback) {
  var value;
  var ret = [];

  each(elems, function (i, elem) {
    value = callback(elem, i);
    if (value !== null && value !== undefined) {
      ret.push(value);
    }
  });

  return concat.apply([], ret);
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
 * 返回去重后的数组
 * @param arr
 * @returns {Array}
 */
function unique(arr) {
  var unique = [];
  for (var i = 0; i < arr.length; i++) {
    if (unique.indexOf(arr[i]) === -1) {
      unique.push(arr[i]);
    }
  }

  return unique;
}

/**
 * 是否是 null
 * @param obj
 * @returns {boolean}
 */
function isNull(obj) {
  return obj === null;
}

/**
 * 判断一个节点名
 * @param ele
 * @param name
 * @returns {boolean}
 */
function nodeName(ele, name) {
  return ele.nodeName && ele.nodeName.toLowerCase() === name.toLowerCase();
}

function isFunction(fn) {
  return typeof fn === 'function';
}

function isString(obj) {
  return typeof obj === 'string';
}

function isObject(obj) {
  return typeof obj === 'object';
}

/**
 * 除去 null 后的 object 类型
 * @param obj
 * @returns {*|boolean}
 */
function isObjectLike(obj) {
  return isObject(obj) && !isNull(obj);
}

function isWindow(win) {
  return win && win === win.window;
}

function isDocument(doc) {
  return doc && doc.nodeType === doc.DOCUMENT_NODE;
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
