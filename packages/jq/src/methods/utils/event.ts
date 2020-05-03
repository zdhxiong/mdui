import $ from '../../$';
import contains from '../../functions/contains';
import { isObjectLike } from '../../utils';
import '../find';

type EventCallback = (
  this: Element | Document | Window,
  event: Event,
  data?: any,
  ...dataN: any[]
) => void | false;

type Handler = {
  type: string; // 事件名
  ns: string; // 命名空间
  func: Function; // 事件处理函数
  id: number; // 事件ID
  proxy: any;
  selector?: string; // 选择器
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
function getElementId(element: Element | Document | Window | Function): number {
  const key = '_mduiEventId';

  // @ts-ignore
  if (!element[key]) {
    // @ts-ignore
    element[key] = ++mduiElementId;
  }

  // @ts-ignore
  return element[key];
}

/**
 * 解析事件名中的命名空间
 */
function parse(type: string): { type: string; ns: string } {
  const parts = type.split('.');

  return {
    type: parts[0],
    ns: parts.slice(1).sort().join(' '),
  };
}

/**
 * 命名空间匹配规则
 */
function matcherFor(ns: string): RegExp {
  return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
}

/**
 * 获取匹配的事件
 * @param element
 * @param type
 * @param func
 * @param selector
 */
function getHandlers(
  element: Element | Document | Window,
  type: string,
  func?: Function,
  selector?: string,
): Handler[] {
  const event = parse(type);

  return (handlers[getElementId(element)] || []).filter(
    (handler) =>
      handler &&
      (!event.type || handler.type === event.type) &&
      (!event.ns || matcherFor(event.ns).test(handler.ns)) &&
      (!func || getElementId(handler.func) === getElementId(func)) &&
      (!selector || handler.selector === selector),
  );
}

/**
 * 添加事件监听
 * @param element
 * @param types
 * @param func
 * @param data
 * @param selector
 */
function add(
  element: Element | Document | Window,
  types: string,
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

  types.split(' ').forEach((type) => {
    if (!type) {
      return;
    }

    const event = parse(type);

    function callFn(e: Event, elem: Element | Document | Window): void {
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
      if (e._ns && !matcherFor(e._ns).test(event.ns)) {
        return;
      }

      // @ts-ignore
      e._data = data;

      if (selector) {
        // 事件代理
        $(element)
          .find(selector)
          .get()
          .reverse()
          .forEach((elem) => {
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
      type: event.type,
      ns: event.ns,
      func,
      selector,
      id: handlers[elementId].length,
      proxy: proxyFn,
    };

    handlers[elementId].push(handler);

    element.addEventListener(handler.type, proxyFn, useCapture);
  });
}

/**
 * 移除事件监听
 * @param element
 * @param types
 * @param func
 * @param selector
 */
function remove(
  element: Element | Document | Window,
  types?: string,
  func?: Function,
  selector?: string,
): void {
  const handlersInElement = handlers[getElementId(element)] || [];
  const removeEvent = (handler: Handler): void => {
    delete handlersInElement[handler.id];
    element.removeEventListener(handler.type, handler.proxy, false);
  };

  if (!types) {
    handlersInElement.forEach((handler) => removeEvent(handler));
  } else {
    types.split(' ').forEach((type) => {
      if (type) {
        getHandlers(element, type, func, selector).forEach((handler) =>
          removeEvent(handler),
        );
      }
    });
  }
}

export { EventCallback, parse, add, remove };
