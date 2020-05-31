import $ from 'mdui.jq/es/$';
import { JQ } from 'mdui.jq/es/JQ';
import each from 'mdui.jq/es/functions/each';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
import { entries, mutation } from '../../utils/mutation';

declare module 'mdui.jq/es/JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 执行在当前元素及其子元素内注册的初始化函数
     */
    mutation(): this;
  }
}

$.fn.mutation = function (this: JQ): JQ {
  return this.each((i, element) => {
    const $this = $(element);

    each(entries, (selector: string, apiInit) => {
      if ($this.is(selector)) {
        mutation(selector, apiInit, i, element);
      }

      $this.find(selector).each((i, element) => {
        mutation(selector, apiInit, i, element);
      });
    });
  });
};
