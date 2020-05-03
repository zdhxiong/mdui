import $ from '../$';
import { JQ } from '../JQ';
import './each';
import './val';

interface NameValuePair {
  name: string;
  value: any;
}

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 把表单元素的值组合成由 `name` 和 `value` 的键值对组成的数组
     *
     * 该方法可对单独表单元素进行操作，也可以对整个 `<form>` 表单进行操作
     * @example
```js
$('form').serializeArray()
// [ {"name":"name","value":"mdui"}, {"name":"password","value":"123456"} ]
```
     */
    serializeArray(): NameValuePair[];
  }
}

/**
 * 将表单元素的值组合成键值对数组
 * @returns {Array}
 */
$.fn.serializeArray = function (this: JQ): NameValuePair[] {
  const result: NameValuePair[] = [];

  this.each((_, element) => {
    const elements =
      element instanceof HTMLFormElement ? element.elements : [element];

    $(elements).each((_, element) => {
      const $element = $(element);
      const type = (element as HTMLInputElement).type;
      const nodeName = element.nodeName.toLowerCase();

      if (
        nodeName !== 'fieldset' &&
        (element as HTMLInputElement).name &&
        !(element as HTMLInputElement).disabled &&
        ['input', 'select', 'textarea', 'keygen'].indexOf(nodeName) > -1 &&
        ['submit', 'button', 'image', 'reset', 'file'].indexOf(type) === -1 &&
        (['radio', 'checkbox'].indexOf(type) === -1 ||
          (element as HTMLInputElement).checked)
      ) {
        const value = $element.val();
        const valueArr = Array.isArray(value) ? value : [value];

        valueArr.forEach((value) => {
          result.push({
            name: (element as HTMLInputElement).name,
            value,
          });
        });
      }
    });
  });

  return result;
};
