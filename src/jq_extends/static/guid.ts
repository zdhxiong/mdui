import $ from 'mdui.jq/es/$';
import { isUndefined } from 'mdui.jq/es/utils';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';

declare module 'mdui.jq/es/interfaces/JQStatic' {
  interface JQStatic {
    /**
     * 生成一个全局唯一的 ID
     * @param name 当该参数值对应的 guid 不存在时，会生成一个新的 guid，并返回；当该参数对应的 guid 已存在，则直接返回已有 guid
     * @example
```js
$.guid();
```
     * @example
```js
$.guid('test');
```
     */
    guid(name?: string): string;
  }
}

const GUID: PlainObject<string> = {};

$.guid = function (name?: string): string {
  if (!isUndefined(name) && !isUndefined(GUID[name])) {
    return GUID[name];
  }

  function s4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  const guid =
    '_' +
    s4() +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    '-' +
    s4() +
    s4() +
    s4();

  if (!isUndefined(name)) {
    GUID[name] = guid;
  }

  return guid;
};
