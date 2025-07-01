import { $ } from '../$.js';
import { getFormControlsValue } from './serializeArray.js';
import type { JQ } from '../shared/core.js';

type Value = string | number | (string | number)[];

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 把表单元素的值转换为对象。
     *
     * 若存在相同的键名，则对应的值会转为数组。
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
 */
$.fn.serializeObject = function (this: JQ): Record<string, Value> {
  const result: Record<string, Value> = {};

  getFormControlsValue(this).forEach((element) => {
    const { name, value } = element;

    if (!Object.prototype.hasOwnProperty.call(result, name)) {
      result[name] = value;
    } else {
      const originalValue = result[name];

      if (!Array.isArray(originalValue)) {
        result[name] = [originalValue];
      }

      // value 可能是数组，合并到原有数组中
      if (Array.isArray(value)) {
        (result[name] as (string | number)[]).push(...value);
      } else {
        (result[name] as (string | number)[]).push(value);
      }
    }
  });

  return result;
};
