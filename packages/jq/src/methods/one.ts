import $ from '../$';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';
import './on';
import { EventCallback } from './utils/event';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 通过事件委托同时添加多个事件处理函数，触发一次后自动解绑
     * @param events
     * 一个对象：
     *
     * 键名为事件名，多个事件名用空格分隔，可包含命名空间；
     *
     * 键值为事件处理函数
     * @param selector CSS 选择器
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     */
    one(
      events: PlainObject<EventCallback | false>,
      selector: string | null | undefined,
      data?: any,
    ): this;

    /**
     * 同时添加多个事件处理函数，触发一次后自动解绑
     * @param events
     * 一个对象：
     *
     * 键名为事件名，多个事件名用空格分隔，可包含命名空间；
     *
     * 键值为事件处理函数
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     */
    one(events: PlainObject<EventCallback | false>, data?: any): this;

    /**
     * 通过事件委托添加事件处理函数，并传入参数，触发一次后自动解绑
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param selector CSS 选择器
     * @param data
     * 事件触发时，传递给事件处理函数的数据
     *
     * 如果 `data` 是 `string` 类型，则必须提供 `selector` 参数；`selector` 参数可以是 `null`
     * @param callback 事件处理函数
     */
    one(
      eventName: string,
      selector: string | null | undefined,
      data: any,
      callback: EventCallback | false,
    ): this;

    /**
     * 通过事件委托添加事件处理函数，触发一次后自动解绑
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param selector CSS 选择器
     * @param callback 事件处理函数
     */
    one(
      eventName: string,
      selector: string,
      callback: EventCallback | false,
    ): this;

    /**
     * 添加事件处理函数，并传入参数，触发一次后自动解绑
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param data 事件触发时，传递给事件处理函数的数据
     * @param callback 事件处理函数
     */
    one(eventName: string, data: any, callback: EventCallback | false): this;

    /**
     * 添加事件处理函数，触发一次后自动解绑
     * @param eventName
     * 事件名称，多个事件名可以用空格分隔
     *
     * 事件名中可以包含命名空间，如 `click.myPlugin`
     * @param callback 事件处理函数
     */
    one(eventName: string, callback: EventCallback | false): this;
  }
}

$.fn.one = function (
  this: JQ,
  types: PlainObject<EventCallback | false> | string,
  selector?: any,
  data?: any,
  callback?: any,
): JQ {
  // @ts-ignore
  return this.on(types, selector, data, callback, true);
};
