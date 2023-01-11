import { $ } from '../$.js';
import { getFormControlsValue } from './serializeArray.js';
import type { JQ } from '../shared/core.js';

type Value = string | number | (string | number)[];

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 把表单元素的值转换为对象
     *
     * 该方法可对单独表单元素进行操作，也可以对整个 `<form>` 表单进行操作
     * @example
```js
$('form').serializeObject()
// { name: mdui, password: 123456 }
```
     */
    serializeObject(): Record<string, Value>;
  }
}

/**
 * 将表单元素的值转换为对象
 *
 * todo 单元测试
 */
$.fn.serializeObject = function (this: JQ): Record<string, Value> {
  const result: Record<string, Value> = {};

  getFormControlsValue(this).forEach((element) => {
    result[element.name] = element.value;
  });

  return result;
};
