import $ from '../../$';
import contains from '../../functions/contains';
import data from '../../functions/data';
import JQElement from '../../types/JQElement';
import { isObjectLike } from '../../utils';
import '../find';

type Handler = {
  e: string; // 事件名
  fn: Function; // 事件处理函数
  i: number; // 事件ID
  proxy: any;
  sel?: string; // 选择器
};

type Handlers = {
  // 元素ID
  [elementIndex: number]: Handler[];
};

// 存储事件
const handlers: Handlers = {};

// 元素ID
let mduiElementId = 1;

/**
 * 为元素赋予一个唯一的ID
 */
function getElementId(element: JQElement): number {
  const key = 'mduiElementId';

  if (!data(element, key)) {
    mduiElementId += 1;
    data(element, key, mduiElementId);
  }

  return data(element, key);
}

/**
 * 获取匹配的事件
 * @param element
 * @param eventName
 * @param func
 * @param selector
 */
function getHandlers(
  element: JQElement,
  eventName: string,
  func?: Function,
  selector?: string,
): Handler[] {
  return (handlers[getElementId(element)] || []).filter(
    handler =>
      handler &&
      (!eventName || handler.e === eventName) &&
      (!func || handler.fn.toString() === func.toString()) &&
      (!selector || handler.sel === selector),
  );
}

/**
 * 添加事件监听
 * @param element
 * @param eventName
 * @param func
 * @param data
 * @param selector
 */
function add(
  element: JQElement,
  eventName: string,
  func: Function,
  data?: any,
  selector?: string,
): void {
  const elementId = getElementId(element);

  if (!handlers[elementId]) {
    handlers[elementId] = [];
  }

  // 传入 data.useCapture 来设置 useCapture: true
  let useCapture = false;
  if (isObjectLike(data) && data.useCapture) {
    useCapture = true;
  }

  eventName.split(' ').forEach(event => {
    function callFn(e: Event, elem: JQElement): void {
      // 因为鼠标事件模拟事件的 detail 属性是只读的，因此在 e._detail 中存储参数
      const result = func.apply(
        elem,
        // @ts-ignore
        e._detail === undefined ? [e] : [e].concat(e._detail),
      );

      if (result === false) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    function proxyFn(e: Event): void {
      // @ts-ignore
      e._data = data;

      if (selector) {
        // 事件代理
        $(element)
          .find(selector)
          .get()
          .reverse()
          .forEach(elem => {
            if (
              elem === e.target ||
              contains(elem as HTMLElement, e.target as HTMLElement)
            ) {
              callFn(e, elem);
            }
          });
      } else {
        // 不使用事件代理
        callFn(e, element);
      }
    }

    const handler: Handler = {
      e: event,
      fn: func,
      sel: selector,
      i: handlers[elementId].length,
      proxy: proxyFn,
    };

    handlers[elementId].push(handler);
    element.addEventListener(handler.e, proxyFn, useCapture);
  });
}

/**
 * 移除事件监听
 * @param element
 * @param eventName
 * @param func
 * @param selector
 */
function remove(
  element: JQElement,
  eventName: string,
  func?: Function,
  selector?: string,
): void {
  (eventName || '').split(' ').forEach(event => {
    getHandlers(element, event, func, selector).forEach(handler => {
      delete handlers[getElementId(element)][handler.i];
      element.removeEventListener(handler.e, handler.proxy, false);
    });
  });
}

export { add, remove };
