import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/each';
import mdui from '../mdui';
import '../jq_extends/methods/mutation';
import { isUndefined } from 'mdui.jq/es/utils';
import { TYPE_API_INIT, entries, mutation } from '../utils/mutation';

declare module '../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 传入了两个参数时，注册并执行初始化函数
     *
     * 没有传入参数时，执行初始化
     * @param selector CSS 选择器
     * @param apiInit 初始化函数
     * @example
```js
mdui.mutation();
```
     * @example
```js
mdui.mutation();
```
     */
    mutation(selector?: string, apiInit?: TYPE_API_INIT): void;
  }
}

mdui.mutation = function (selector?: string, apiInit?: TYPE_API_INIT): void {
  if (isUndefined(selector) || isUndefined(apiInit)) {
    $(document).mutation();
    return;
  }

  entries[selector] = apiInit!;
  $(selector).each((i, element) => mutation(selector, apiInit, i, element));
};
