import { isObjectLike, eachObject, eachArray } from '../shared/helper.js';
import type { PlainObject } from '../shared/helper.js';

// @ts-ignore
type Value = Record<string, Value> | string | number | boolean;

/**
 * 将数组或对象序列化，序列化后的字符串可作为 URL 查询字符串使用
 *
 * 若传入数组，则格式必须和 serializeArray 方法的返回值一样
 * @param obj 对象或数组
 * @example
```js
param({ width: 1680, height: 1050 });
// width=1680&height=1050
```
 * @example
```js
param({ foo: { one: 1, two: 2 }})
// foo[one]=1&foo[two]=2
```
 * @example
```js
param({ids: [1, 2, 3]})
// ids[]=1&ids[]=2&ids[]=3
```
 * @example
```js
param([
  {"name":"name","value":"mdui"},
  {"name":"password","value":"123456"}
])
// name=mdui&password=123456
```
 */
export const param = (
  obj: { name: string; value: Value }[] | PlainObject<Value>,
): string => {
  if (!isObjectLike(obj) && !Array.isArray(obj)) {
    return '';
  }

  const args: string[] = [];

  const destructure = (key: string, value: Value): void => {
    let keyTmp;

    if (isObjectLike(value)) {
      eachObject(value, (i, v) => {
        keyTmp = Array.isArray(value) && !isObjectLike(v) ? '' : i;

        destructure(`${key}[${keyTmp}]`, v);
      });
    } else {
      keyTmp =
        value == null || value === '' ? '=' : `=${encodeURIComponent(value)}`;

      args.push(encodeURIComponent(key) + keyTmp);
    }
  };

  if (Array.isArray(obj)) {
    eachArray(obj, ({ name, value }) => {
      return destructure(name, value);
    });
  } else {
    eachObject(obj, destructure);
  }

  return args.join('&');
};
