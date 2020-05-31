import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';
import 'mdui.jq/es/methods/trigger';

/**
 * 触发组件上的事件
 * @param eventName 事件名
 * @param componentName 组件名
 * @param target 在该元素上触发事件
 * @param instance 组件实例
 * @param parameters 事件参数
 */
function componentEvent(
  eventName: string,
  componentName: string,
  target: HTMLElement | HTMLElement[] | JQ,
  instance?: any,
  parameters?: PlainObject,
): void {
  if (!parameters) {
    parameters = {};
  }

  // @ts-ignore
  parameters.inst = instance;

  const fullEventName = `${eventName}.mdui.${componentName}`;

  // jQuery 事件
  // @ts-ignore
  if (typeof jQuery !== 'undefined') {
    // @ts-ignore
    jQuery(target).trigger(fullEventName, parameters);
  }

  const $target = $(target);

  // mdui.jq 事件
  $target.trigger(fullEventName, parameters);

  // 原生事件，供使用 addEventListener 监听
  type EventParams = {
    detail?: any;
    bubbles: boolean;
    cancelable: boolean;
  };

  const eventParams: EventParams = {
    bubbles: true,
    cancelable: true,
    detail: parameters,
  };

  const eventObject: CustomEvent = new CustomEvent(fullEventName, eventParams);

  // @ts-ignore
  eventObject._detail = parameters;

  $target[0].dispatchEvent(eventObject);
}

export { componentEvent };
