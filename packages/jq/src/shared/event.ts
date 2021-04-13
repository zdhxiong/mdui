import $ from '../$.js';
import contains from '../functions/contains.js';
import { isObjectLike } from './core.js';
import '../methods/find.js';
import '../methods/get.js';

export type EventCallback = (
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

type ElementIdKey = Element | Document | Window | Function;
const elementIdMap = new WeakMap<ElementIdKey, number>();
let elementId = 1;

/**
 * 为元素赋予一个唯一的ID
 */
const getElementId = (element: ElementIdKey): number => {
  if (!elementIdMap.has(element)) {
    elementIdMap.set(element, ++elementId);
  }

  return elementIdMap.get(element)!;
};

// 存储唯一ID及事件处理
const handlersMap = new Map<number, Handler[]>();

/**
 * 获取元素上的事件处理器数组
 * @param element
 */
const getHandlers = (element: ElementIdKey): Handler[] => {
  const id = getElementId(element);
  return handlersMap.get(id) || handlersMap.set(id, []).get(id)!;
};

/**
 * 解析事件名中的命名空间
 */
export const parse = (type: string): { type: string; ns: string } => {
  const parts = type.split('.');

  return {
    type: parts[0],
    ns: parts.slice(1).sort().join(' '),
  };
};

/**
 * 命名空间匹配规则
 */
const matcherFor = (ns: string): RegExp => {
  return new RegExp('(?:^| )' + ns.replace(' ', ' .* ?') + '(?: |$)');
};

/**
 * 获取匹配的事件
 * @param element
 * @param type
 * @param func
 * @param selector
 */
const getMatchedHandlers = (
  element: Element | Document | Window,
  type: string,
  func?: Function,
  selector?: string,
): Handler[] => {
  const event = parse(type);

  return getHandlers(element).filter((handler) => {
    return (
      handler &&
      (!event.type || handler.type === event.type) &&
      (!event.ns || matcherFor(event.ns).test(handler.ns)) &&
      (!func || getElementId(handler.func) === getElementId(func)) &&
      (!selector || handler.selector === selector)
    );
  });
};

/**
 * 添加事件监听
 * @param element
 * @param types
 * @param func
 * @param data
 * @param selector
 */
export const add = (
  element: Element | Document | Window,
  types: string,
  func: Function,
  data?: any,
  selector?: string,
): void => {
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

    const callFn = (e: Event, elem: Element | Document | Window): void => {
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
    };

    const proxyFn = (e: Event): void => {
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
    };

    const handler: Handler = {
      type: event.type,
      ns: event.ns,
      func,
      selector,
      id: getHandlers(element).length,
      proxy: proxyFn,
    };

    getHandlers(element).push(handler);

    element.addEventListener(handler.type, proxyFn, useCapture);
  });
};

/**
 * 移除事件监听
 * @param element
 * @param types
 * @param func
 * @param selector
 */
export const remove = (
  element: Element | Document | Window,
  types?: string,
  func?: Function,
  selector?: string,
): void => {
  const handlersInElement = getHandlers(element);
  const removeEvent = (handler: Handler): void => {
    delete handlersInElement[handler.id];
    element.removeEventListener(handler.type, handler.proxy, false);
  };

  if (!types) {
    handlersInElement.forEach((handler) => {
      removeEvent(handler);
    });
  } else {
    types.split(' ').forEach((type) => {
      if (type) {
        getMatchedHandlers(element, type, func, selector).forEach((handler) => {
          removeEvent(handler);
        });
      }
    });
  }
};
