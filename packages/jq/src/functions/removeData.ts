import JQElement from '../types/JQElement';
import dataNS from './utils/data';
import { isUndefined } from '../utils';

/**
 * 移除指定元素上存放的数据
 * @param element 存放数据的元素
 * @param name 数据键名，若为指定键名，将移除元素上所有数据
 * @example ````移除指定键名的数据
```js
removeData(document.body, 'name');
```
 * @example ````移除所有数据
```js
removeData(document.body);
```
 */
function removeData(element: JQElement, name?: string): void {
  // @ts-ignore
  if (!element[dataNS]) {
    return;
  }

  if (isUndefined(name)) {
    // @ts-ignore
    element[dataNS] = null;
    // @ts-ignore
    delete element[dataNS];
    // @ts-ignore
  } else if (element[dataNS][name]) {
    // @ts-ignore
    element[dataNS][name] = null;
    // @ts-ignore
    delete element[dataNS][name];
  }
}

export default removeData;
