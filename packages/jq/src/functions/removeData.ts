import each from '../functions/each';
import TypeOrArray from '../types/TypeOrArray';
import { isUndefined, isString, toCamelCase } from '../utils';
import dataNS from './utils/data';

/**
 * 移除指定元素上存放的数据
 * @param element 存放数据的元素
 * @param name
 * 数据键名
 *
 * 若未指定键名，将移除元素上所有数据
 *
 * 多个键名可以用空格分隔，或者用数组表示多个键名
  @example
```js
// 移除元素上键名为 name 的数据
removeData(document.body, 'name');
```
 * @example
```js
// 移除元素上键名为 name1 和 name2 的数据
removeData(document.body, 'name1 name2');
```
 * @example
```js
// 移除元素上键名为 name1 和 name2 的数据
removeData(document.body, ['name1', 'name2']);
```
 * @example
```js
// 移除元素上所有数据
removeData(document.body);
```
 */
function removeData(
  element: Element | Document | Window,
  name?: TypeOrArray<string>,
): void {
  // @ts-ignore
  if (!element[dataNS]) {
    return;
  }

  const remove = (nameItem: string): void => {
    nameItem = toCamelCase(nameItem);

    // @ts-ignore
    if (element[dataNS][nameItem]) {
      // @ts-ignore
      element[dataNS][nameItem] = null;
      // @ts-ignore
      delete element[dataNS][nameItem];
    }
  };

  if (isUndefined(name)) {
    // @ts-ignore
    element[dataNS] = null;
    // @ts-ignore
    delete element[dataNS];
    // @ts-ignore
  } else if (isString(name)) {
    name
      .split(' ')
      .filter((nameItem) => nameItem)
      .forEach((nameItem) => remove(nameItem));
  } else {
    each(name, (_, nameItem) => remove(nameItem));
  }
}

export default removeData;
