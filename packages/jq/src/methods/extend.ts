import $ from '../$';
import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { JQ } from '../JQ';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 在 $ 的原型链上扩展方法
     * @param obj
     * @example
```js
$.fn.extend({
  customFunc: function () {}
})

// 然后就可以这样使用扩展的方法了
$(document).customFunc()
```
     */
    extend(obj: PlainObject): this;
  }
}

$.fn.extend = function (this: JQ, obj: PlainObject): JQ {
  each(obj, (prop, value) => {
    // 在 JQ 对象上扩展方法时，需要自己添加 typescript 的类型定义
    $.fn[prop] = value;
  });

  return this;
};
