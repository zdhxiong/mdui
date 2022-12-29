/**
 * 触发自定义事件
 * @param element
 * @param type
 * @param options 通常只用到 cancelable 和 detail；bubbles、composed 统一不用
 */
export const emit = (
  element: HTMLElement,
  type: string,
  options?: CustomEventInit,
): CustomEvent => {
  const event = new CustomEvent(type, {
    bubbles: true,
    cancelable: false,
    composed: true,
    detail: {},
    ...options,
  });
  element.dispatchEvent(event);

  return event;
};
