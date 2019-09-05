import JQElement from '../types/JQElement';
import { isUndefined } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import each from '../functions/each';
import './each';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置当前元素的值
     * @param value
     * @example
```js
$('#input').val('input value')
```
     */
    val(value: string | number | string[]): this;

    /**
     * 获取当前元素的值
     * @example
```js
$('#input').val()
```
     */
    val(): string;
  }
}

each(['val', 'html', 'text'], (nameIndex, name) => {
  const props = {
    0: 'value',
    1: 'innerHTML',
    2: 'textContent',
  };

  const defaults = {
    0: undefined,
    1: undefined,
    2: null,
  };

  $.fn[name] = function<T extends JQElement>(this: JQ<T>, value?: any): any {
    // 获取值
    if (isUndefined(value)) {
      // @ts-ignore
      return this[0] ? this[0][props[nameIndex]] : defaults[nameIndex];
    }

    // 设置值
    return this.each((_, element) => {
      // @ts-ignore
      element[props[nameIndex]] = value;
    });
  };
});
