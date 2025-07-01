import { $ } from '../$.js';
import { map } from '../functions/map.js';
import {
  isElement,
  isFunction,
  isUndefined,
  toElement,
  eachArray,
} from '../shared/helper.js';
import './each.js';
import './find.js';
import './is.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置集合中每个元素的值
     * @param value
     * 元素的值。可以是字符串、数值、字符串数组、或回调函数
     *
     * 回调函数的第一个参数为元素的索引位置，第二个参数为元素的原有的值，`this` 指向当前元素
     *
     * 若元素为 `<input type="checkbox">`、`<input type="radio">`、`<option>`，则元素值、或函数返回值可以为数组，此时将选中值在数组中的元素，并取消选中值不在数组中的元素
     *
     * 若元素值、或函数返回值为 `undefined`，则会将元素值设为空
     * @example
```js
$('#input').val('input value')
```
     */
    val(
      value:
        | string
        | number
        | string[]
        | undefined
        | ((
            this: T,
            inDex: number,
            oldValue: string | number | string[],
          ) => string | number | string[] | void | undefined),
    ): this;

    /**
     * 获取集合中第一个元素的值
     *
     * 对于 `<select multiple="multiple">` 元素，将返回一个包含每个选择项的数组
     * @example
```js
$('#input').val()
```
     */
    val(): string | number | string[] | undefined;
  }
}

eachArray(['val', 'html', 'text'], (name, nameIndex) => {
  const props = ['value', 'innerHTML', 'textContent'];
  const propName = props[nameIndex];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const get = ($elements: JQ): any => {
    // text() 获取所有元素的文本
    if (nameIndex === 2) {
      return map($elements, (element) => {
        return toElement(element)[propName as 'textContent'];
      }).join('');
    }

    // 空集合时，val() 和 html() 返回 undefined
    if (!$elements.length) {
      return undefined;
    }

    // val() 和 html() 仅获取第一个元素的内容
    const firstElement = $elements[0];
    const $firstElement = $(firstElement);

    // select multiple 返回数组
    if (nameIndex === 0 && $firstElement.is('select[multiple]')) {
      return map(
        $firstElement.find('option:checked') as JQ<HTMLOptionElement>,
        (element) => element.value,
      );
    }

    // @ts-ignore
    return firstElement[propName];
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = (element: HTMLElement, value: any): void => {
    // text() 和 html() 赋值为 undefined，则保持原内容不变
    // val() 赋值为 undefined 则赋值为空
    if (isUndefined(value)) {
      if (nameIndex !== 0) {
        return;
      }

      value = '';
    }

    if (nameIndex === 1 && isElement(value)) {
      value = value.outerHTML;
    }

    // @ts-ignore
    element[propName] = value;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  $.fn[name as 'val'] = function (this: JQ, value?: any): any {
    // 获取值
    if (!arguments.length) {
      return get(this);
    }

    // 设置值
    return this.each((i, element) => {
      const $element = $(element);
      const computedValue = isFunction(value)
        ? value.call(element, i, get($element))
        : value;

      // value 是数组，则选中数组中的元素，反选不在数组中的元素
      if (nameIndex === 0 && Array.isArray(computedValue)) {
        // select[multiple]
        if ($element.is('select[multiple]')) {
          map($element.find('option') as JQ<HTMLOptionElement>, (option) => {
            return (option.selected = computedValue.includes(option.value));
          });
        }

        // 其他 checkbox, radio 等元素
        else {
          (element as HTMLInputElement).checked = computedValue.includes(
            (element as HTMLInputElement).value,
          );
        }
      } else {
        set(element, computedValue);
      }
    });
  };
});
