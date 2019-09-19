import each from '../functions/each';
import PlainObject from '../interfaces/PlainObject';
import { isUndefined } from '../utils';

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
function extend<
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
function extend<
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
function extend<
  T extends PlainObject,
  U extends PlainObject,
  V extends PlainObject,
  W extends PlainObject,
  X extends PlainObject
>(target: T, object1: U, object2: V, object3: W, object4: X): T & U & V & W & X;

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
function extend<
  T extends PlainObject,
  U extends PlainObject,
  V extends PlainObject,
  W extends PlainObject
>(target: T, object1: U, object2: V, object3: W): T & U & V & W;

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
function extend<
  T extends PlainObject,
  U extends PlainObject,
  V extends PlainObject
>(target: T, object1: U, object2: V): T & U & V;

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
function extend<T extends PlainObject, U extends PlainObject>(
  target: T,
  object1: U,
): T & U;

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
function extend(
  target: PlainObject,
  object1: PlainObject,
  ...objectN: PlainObject[]
): PlainObject;

function extend(
  target: PlainObject,
  object1: PlainObject,
  ...objectN: PlainObject[]
): PlainObject {
  objectN.unshift(object1);

  each(objectN, (_, object) => {
    each(object, (prop, value) => {
      if (!isUndefined(value)) {
        target[prop] = value;
      }
    });
  });

  return target;
}

export default extend;
