import $ from '../../$';
import { isObjectLike } from '../../utils';

// 存储事件
const handlers = {
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
let mduiElementId = 1;

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
  return (handlers[getElementId(element)] || [])
    .filter(handler => handler
      && (!eventName || handler.e === eventName)
      && (!func || handler.fn.toString() === func.toString())
      && (!selector || handler.sel === selector));
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
  const elementId = getElementId(element);

  if (!handlers[elementId]) {
    handlers[elementId] = [];
  }

  // 传入 data.useCapture 来设置 useCapture: true
  let useCapture = false;
  if (isObjectLike(data) && data.useCapture) {
    useCapture = true;
  }

  eventName.split(' ').forEach((event) => {
    const handler = {
      e: event,
      fn: func,
      sel: selector,
      i: handlers[elementId].length,
    };

    function callFn(e, elem) {
      // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
      /* eslint no-underscore-dangle: 0 */
      const result = func.apply(elem, e._detail === undefined ? [e] : [e].concat(e._detail));

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
          .forEach((elem) => {
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
  (eventName || '').split(' ').forEach((event) => {
    getHandlers(element, event, func, selector).forEach((handler) => {
      delete handlers[getElementId(element)][handler.i];
      element.removeEventListener(handler.e, handler.proxy, false);
    });
  });
}

export {
  fnFalse,
  add,
  remove,
};
