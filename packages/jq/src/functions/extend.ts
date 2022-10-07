import { isUndefined, eachObject, eachArray } from '../shared/helper.js';
import type { PlainObject } from '../shared/helper.js';

/**
 * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。（属性值为 `undefined` 的不会合并）
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
export function extend<
  T extends PlainObject,
  U extends PlainObject,
  V extends PlainObject,
  W extends PlainObject,
>(target: T, object1: U, object2: V, object3: W): T & U & V & W;

/**
 * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。（属性值为 `undefined` 的不会合并）
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
export function extend<
  T extends PlainObject,
  U extends PlainObject,
  V extends PlainObject,
>(target: T, object1: U, object2: V): T & U & V;

/**
 * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。（属性值为 `undefined` 的不会合并）
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
export function extend<T extends PlainObject, U extends PlainObject>(
  target: T,
  object1: U,
): T & U;

/**
 * 将所有对象的属性都添加到第一个对象，并返回合并后的对象。（属性值为 `undefined` 的不会合并）
 * @param target 其他参数的属性将合并到该参数
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
export function extend(
  target: PlainObject,
  ...objectN: PlainObject[]
): PlainObject;

export function extend(
  target: PlainObject,
  ...objectN: PlainObject[]
): PlainObject {
  eachArray(objectN, (object) => {
    eachObject(object, (prop, value) => {
      if (!isUndefined(value)) {
        target[prop] = value;
      }
    });
  });

  return target;
}
