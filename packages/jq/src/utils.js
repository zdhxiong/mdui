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

function isObject(obj) {
  return typeof obj === 'object';
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
    for (let i = 0; i < obj.length; i += 1) {
      if (callback.call(obj[i], i, obj[i]) === false) {
        return obj;
      }
    }
  } else {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i += 1) {
      if (callback.call(obj[keys[i]], keys[i], obj[keys[i]]) === false) {
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
  let value;
  const ret = [];

  each(elems, (i, elem) => {
    value = callback(elem, i);

    if (value !== null && value !== undefined) {
      ret.push(value);
    }
  });

  return [].concat(...ret);
}

/**
 * 把对象合并到第一个参数中，并返回第一个参数
 * @param first
 * @param second
 * @returns {*}
 */
function merge(first, second) {
  each(second, (i, val) => {
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
  const result = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (result.indexOf(arr[i]) === -1) {
      result.push(arr[i]);
    }
  }

  return result;
}

export {
  each,
  map,
  merge,
  unique,
  isNodeName,
  isObjectLike,
  isFunction,
  isString,
  isObject,
  isWindow,
  isDocument,
  isArrayLike,
};
