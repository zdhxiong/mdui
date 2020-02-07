import $ from 'mdui.jq/es/$';
import { isUndefined } from 'mdui.jq/es/utils';
import { JQ } from 'mdui.jq/es/JQ';
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
  instance?: object,
  parameters?: object,
): void {
  if (!parameters) {
    parameters = {};
  }

  // @ts-ignore
  parameters.inst = instance;

  const fullEventName = `${eventName}.mdui.${componentName}`;

  // jQuery 事件
  // @ts-ignore
  if (!isUndefined(jQuery)) {
    // @ts-ignore
    jQuery(target).trigger(fullEventName, parameters);
  }

  // mdui.jq 事件
  $(target).trigger(fullEventName, parameters);
}

export { componentEvent };
