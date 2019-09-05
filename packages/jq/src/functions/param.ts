import { isObjectLike } from '../utils';
import each from './each';
import PlainObject from '../interfaces/PlainObject';

/**
 * 将数组或对象序列化，序列化后的字符串可作为 URL 查询字符串使用
 * @param obj 数组或对象
 * @example
```js
param( { width:1680, height:1050 } );
// width=1680&height=1050
```
```js
param( { foo: { one: 1,two: 2 } } )
// foo[one]=1&foo[two]=2
```
```js
param( { ids: [1, 2, 3] } )
// ids[]=1&ids[]=2&ids[]=3
```
 */
function param(obj: any[] | PlainObject): string {
  if (!isObjectLike(obj)) {
    return '';
  }

  const args: any[] = [];

  function destructure(key: any, value: any): void {
    let keyTmp;

    if (isObjectLike(value)) {
      each(value, (i, v) => {
        if (Array.isArray(value) && !isObjectLike(v)) {
          keyTmp = '';
        } else {
          keyTmp = i;
        }

        destructure(`${key}[${keyTmp}]`, v);
      });
    } else {
      if (value !== null && value !== '') {
        keyTmp = `=${encodeURIComponent(value)}`;
      } else {
        keyTmp = '';
      }

      args.push(encodeURIComponent(key) + keyTmp);
    }
  }

  each(obj, destructure);

  return args.join('&');
}

export default param;
