import $ from '../$';
import each from '../functions/each';
import extend from '../functions/extend';
import PlainObject from '../interfaces/PlainObject';

/**
 * 比 ../functions/extend 函数多了一个 extend<T>(target: T): this & T 的用法
 */
declare module '../interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param object2 该对象的属性将合并到第一个参数
     * @param object3 该对象的属性将合并到第一个参数
     * @param object4 该对象的属性将合并到第一个参数
     * @param object5 该对象的属性将合并到第一个参数
     * @param object6 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
  { key3: value3 },
  { key4: value4 },
  { key5: value5 },
  { key6: value6 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
  key3: value3,
  key4: value4,
  key5: value5,
  key6: value6,
}
```
     */
    extend<
      T extends PlainObject,
      U extends PlainObject,
      V extends PlainObject,
      W extends PlainObject,
      X extends PlainObject,
      Y extends PlainObject,
      Z extends PlainObject
    >(
      target: T,
      object1: U,
      object2: V,
      object3: W,
      object4: X,
      object5: Y,
      object6: Z,
    ): T & U & V & W & X & Y & Z;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param object2 该对象的属性将合并到第一个参数
     * @param object3 该对象的属性将合并到第一个参数
     * @param object4 该对象的属性将合并到第一个参数
     * @param object5 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
  { key3: value3 },
  { key4: value4 },
  { key5: value5 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
  key3: value3,
  key4: value4,
  key5: value5,
}
```
     */
    extend<
      T extends PlainObject,
      U extends PlainObject,
      V extends PlainObject,
      W extends PlainObject,
      X extends PlainObject,
      Y extends PlainObject
    >(
      target: T,
      object1: U,
      object2: V,
      object3: W,
      object4: X,
      object5: Y,
    ): T & U & V & W & X & Y;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param object2 该对象的属性将合并到第一个参数
     * @param object3 该对象的属性将合并到第一个参数
     * @param object4 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
  { key3: value3 },
  { key4: value4 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
  key3: value3,
  key4: value4,
}
```
     */
    extend<
      T extends PlainObject,
      U extends PlainObject,
      V extends PlainObject,
      W extends PlainObject,
      X extends PlainObject
    >(
      target: T,
      object1: U,
      object2: V,
      object3: W,
      object4: X,
    ): T & U & V & W & X;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param object2 该对象的属性将合并到第一个参数
     * @param object3 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
  { key3: value3 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
  key3: value3,
}
```
     */
    extend<
      T extends PlainObject,
      U extends PlainObject,
      V extends PlainObject,
      W extends PlainObject
    >(
      target: T,
      object1: U,
      object2: V,
      object3: W,
    ): T & U & V & W;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param object2 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
}
```
     */
    extend<T extends PlainObject, U extends PlainObject, V extends PlainObject>(
      target: T,
      object1: U,
      object2: V,
    ): T & U & V;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
}
```
     */
    extend<T extends PlainObject, U extends PlainObject>(
      target: T,
      object1: U,
    ): T & U;

    /**
     * 将对象属性扩展到 $ 命名空间中
     * @param target 该对象的属性将扩展到 $ 命名空间中
     * @example
```js
$.extend({
  customFunc: function () {}
})

// 然后就可以这样调用自定义方法了
$.customFunc()
```
     */
    extend<T extends PlainObject>(target: T): this & T;

    /**
     * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。
     * @param target 其他参数的属性将合并到该参数
     * @param object1 该对象的属性将合并到第一个参数
     * @param objectN 额外的对象，这些对象的属性将合并到第一个对象
     * @example
```js
var object = extend(
  { key: value },
  { key1: value1 },
  { key2: value2 },
);
// 此时第一个对象和返回值都是
{
  key: value,
  key1: value1,
  key2: value2,
}
```
     */
    extend(
      target: PlainObject,
      object1: PlainObject,
      ...objectN: PlainObject[]
    ): PlainObject;
  }
}

$.extend = function (...objectN: PlainObject[]): any {
  if (objectN.length === 1) {
    each(objectN[0], (prop, value) => {
      this[prop] = value;
    });

    return this;
  }

  return extend(
    objectN.shift() as PlainObject,
    objectN.shift() as PlainObject,
    ...objectN,
  );
};
