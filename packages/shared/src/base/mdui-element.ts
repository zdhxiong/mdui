import { LitElement } from 'lit';

export type UnpackCustomEvent<T> = T extends CustomEvent<infer U> ? U : never;

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class MduiElement<E> extends LitElement {
  /**
   * 触发自定义事件。若返回 false，表示事件被取消
   * @param type
   * @param options 通常只用到 cancelable 和 detail；bubbles、composed 统一不用
   */
  protected emit<K extends keyof E, D extends UnpackCustomEvent<E[K]>>(
    type: K,
    options?: CustomEventInit<D>,
  ): boolean {
    const event = new CustomEvent<D>(
      type as string,
      Object.assign(
        {
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {},
        },
        options,
      ),
    );

    return this.dispatchEvent(event);
  }
}

export interface MduiElement<E> {
  addEventListener<K extends keyof M, M extends E & HTMLElementEventMap>(
    type: K,
    listener: (this: this, ev: M[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M, M extends E & HTMLElementEventMap>(
    type: K,
    listener: (this: this, ev: M[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}
