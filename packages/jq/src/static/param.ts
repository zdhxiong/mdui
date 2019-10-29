import $ from '../$';
import param from '../functions/param';
import PlainObject from '../interfaces/PlainObject';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
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
    param(obj: any[] | PlainObject): string;
  }
}

$.param = param;
