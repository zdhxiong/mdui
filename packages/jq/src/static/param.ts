import $ from '../$';
import param from '../functions/param';
import PlainObject from '../interfaces/PlainObject';

declare module '../interfaces/JQStatic' {
  interface JQStatic {
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
    param(obj: any[] | PlainObject): string;
  }
}

$.param = param;
