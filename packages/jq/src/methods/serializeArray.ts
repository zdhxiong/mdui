import JQElement from '../types/JQElement';
import { isNodeName } from '../utils';
import { JQ } from '../JQ';
import $ from '../$';
import './each';
import './attr';
import './val';

interface NameValuePair {
  name: string;
  value: string;
}

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 把表单元素的值组合成由 name 和 value 的键值对组成的数组
     * @example
```js
$('form').serializeArray()
// [ {"name":"name","value":"mdui"}, {"name":"password","value":""} ]
```
     */
    serializeArray(): NameValuePair[];
  }
}

/**
 * 将表单元素的值组合成键值对数组
 * @returns {Array}
 */
$.fn.serializeArray = function(this: JQ): NameValuePair[] {
  const result: NameValuePair[] = [];
  const formElement = this[0];

  if (!formElement || !(formElement instanceof HTMLFormElement)) {
    return result;
  }

  $([].slice.call(formElement.elements)).each(function() {
    const $item = $(this);
    const type = $item.attr('type');

    if (
      !isNodeName(this, 'fieldset') &&
      // @ts-ignore
      !this.disabled &&
      // @ts-ignore
      ['submit', 'reset', 'button'].indexOf(type) === -1 &&
      // @ts-ignore
      (['radio', 'checkbox'].indexOf(type) === -1 || this.checked)
    ) {
      const name = $item.attr('name');

      if (name) {
        result.push({
          name,
          value: $item.val(),
        });
      }
    }
  });

  return result;
};
