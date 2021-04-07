import each from './each.js';
import TypeOrArray from '../types/TypeOrArray.js';
import { isUndefined, isString, toCamelCase } from '../utils.js';
import { weakMap } from './utils/data.js';

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
const removeData = (
  element: Element | Document | Window,
  name?: TypeOrArray<string>,
): void => {
  const data = weakMap.get(element);

  if (isUndefined(data)) {
    return;
  }

  const remove = (nameItem: string): void => {
    nameItem = toCamelCase(nameItem);
    delete data[nameItem];
  };

  if (isUndefined(name)) {
    weakMap.delete(element);
    return;
  }

  if (isString(name)) {
    name
      .split(' ')
      .filter((nameItem) => nameItem)
      .forEach((nameItem) => remove(nameItem));
  } else {
    each(name, (_, nameItem) => remove(nameItem));
  }

  weakMap.set(element, data);
};

export default removeData;
