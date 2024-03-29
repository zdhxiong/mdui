import { $ } from '../$.js';
import { removeAttribute } from '../shared/attributes.js';
import { eachArray } from '../shared/helper.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 移除集合中每个元素上的指定属性
     * @param attributeName 属性名，多个属性名可以用空格分隔
     * @example
```js
// 移除一个属性
$('div').removeAttr('title')
```
     * @example
```js
// 移除多个属性
$('div').removeAttr('title label');
```
     */
    removeAttr(attributeName: string): this;
  }
}

$.fn.removeAttr = function (this: JQ, attributeName: string): JQ {
  const names = attributeName.split(' ').filter((name) => name);

  return this.each(function () {
    eachArray(names, (name) => {
      removeAttribute(this, name);
    });
  });
};
