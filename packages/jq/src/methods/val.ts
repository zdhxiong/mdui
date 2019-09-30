import $ from '../$';
import each from '../functions/each';
import map from '../functions/map';
import { JQ } from '../JQ';
import { isElement, isFunction, isUndefined, toElement } from '../utils';
import './each';
import './is';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
    /**
     * 设置当前元素的值
     * @param value
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
     * 获取当前元素的值
     * @example
```js
$('#input').val()
```
     */
    val(): string | number | string[] | undefined;
  }
}

each(['val', 'html', 'text'], (nameIndex, name) => {
  const props: { [index: number]: string } = {
    0: 'value',
    1: 'innerHTML',
    2: 'textContent',
  };
  const propName = props[nameIndex];

  function get($elements: JQ): any {
    // text() 获取所有元素的文本
    if (nameIndex === 2) {
      // @ts-ignore
      return map($elements, element => toElement(element)[propName]).join('');
    }

    // 空集合时，val() 和 html() 返回 undefined
    if (!$elements.length) {
      return undefined;
    }

    // val() 和 html() 仅获取第一个元素的内容
    const firstElement = $elements[0];

    // select multiple 返回数组
    if (nameIndex === 0 && $(firstElement).is('select[multiple]')) {
      return map(
        $(firstElement).find('option:checked'),
        element => (element as HTMLOptionElement).value,
      );
    }

    // @ts-ignore
    return firstElement[propName];
  }

  function set(element: HTMLElement, value: any): void {
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
  }

  $.fn[name] = function(this: JQ, value?: any): any {
    // 获取值
    if (!arguments.length) {
      return get(this);
    }

    // 设置值
    return this.each((i, element) => {
      const computedValue = isFunction(value)
        ? value.call(element, i, get($(element)))
        : value;

      // value 是数组，则选中数组中的元素，反选不在数组中的元素
      if (nameIndex === 0 && Array.isArray(computedValue)) {
        // select[multiple]
        if ($(element).is('select[multiple]')) {
          map(
            $(element).find('option'),
            option =>
              ((option as HTMLOptionElement).selected =
                computedValue.indexOf((option as HTMLOptionElement).value) >
                -1),
          );
        }

        // 其他 checkbox, radio 等元素
        else {
          (element as HTMLInputElement).checked =
            computedValue.indexOf((element as HTMLInputElement).value) > -1;
        }
      } else {
        set(element, computedValue);
      }
    });
  };
});
