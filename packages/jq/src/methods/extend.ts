import { PlainObject, eachObject } from '@mdui/shared/helpers.js';
import $ from '../$.js';
import { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ {
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
  eachObject(obj, (prop, value) => {
    // 在 JQ 对象上扩展方法时，需要自己添加 typescript 的类型定义
    $.fn[prop as never] = value;
  });

  return this;
};
