import { $ } from '../$.js';
import { getFormControls } from '../shared/form.js';
import './each.js';
import './val.js';
import type { JQ } from '../shared/core.js';

interface NameValuePair {
  name: string;
  value: string | number;
}

interface NameValuePairOriginal {
  name: string;
  value: string | number | (string | number)[];
}

/**
 * 表单控件的 name、value 组成的数组。其中 value 为原始值
 */
export const getFormControlsValue = (
  $elements: JQ,
): NameValuePairOriginal[] => {
  const result: NameValuePairOriginal[] = [];

  $elements.each((_, element) => {
    const elements = (
      element instanceof HTMLFormElement ? getFormControls(element) : [element]
    ) as HTMLInputElement[];

    $(elements).each((_, element) => {
      const $element = $(element);
      const type = element.type;
      const nodeName = element.nodeName.toLowerCase();

      if (
        nodeName !== 'fieldset' &&
        element.name &&
        !element.disabled &&
        [
          'input',
          'select',
          'textarea',
          'keygen',
          'mdui-checkbox',
          'mdui-radio-group',
          'mdui-switch',
          'mdui-text-field',
          'mdui-select',
          'mdui-slider',
          'mdui-range-slider',
          'mdui-segmented-button-group',
        ].includes(nodeName) &&
        !['button', 'image', 'reset', 'file'].includes(type) &&
        (!['radio', 'checkbox'].includes(type) || element.checked) &&
        (!['mdui-checkbox', 'mdui-switch'].includes(nodeName) ||
          element.checked)
      ) {
        result.push({
          name: element.name,
          value: $element.val()!,
        });
      }
    });
  });

  return result;
};

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
 *
 * 包含哪些表单元素，参考：https://www.w3.org/TR/html401/interact/forms.html#h-17.13.2
 * 其中不包含 type="submit"，因为表单不是通过点击按钮提交的
 *
 * @returns {Array}
 */
$.fn.serializeArray = function (this: JQ): NameValuePair[] {
  return getFormControlsValue(this)
    .map((element) => {
      if (!Array.isArray(element.value)) {
        return element as NameValuePair;
      }

      return element.value.map((value) => ({
        name: element.name,
        value,
      }));
    })
    .flat();
};
