import { $ } from '../$.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 删除集合中所有元素上指定的 JavaScript 属性值
     * @param name 属性名
     * @example
```js
$('input').removeProp('disabled')
```
     */
    removeProp(name: string): this;
  }
}

$.fn.removeProp = function (this: JQ, name: string): JQ {
  return this.each((_, element) => {
    try {
      // @ts-ignore
      delete element[name];
    } catch (_err) {
      /* empty */
    }
  });
};
