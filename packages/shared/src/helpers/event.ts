/**
 * 触发自定义事件
 */
// eslint-disable-next-line
export const emit = <T = any>(
  element: HTMLElement,
  type: string,
  options?: CustomEventInit<T>,
) => {
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
