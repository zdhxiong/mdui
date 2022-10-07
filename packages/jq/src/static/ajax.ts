import { $ } from '../$.js';
import { ajax } from '../functions/ajax.js';
import type { Options } from '../shared/ajax.js';

declare module '../shared/core.js' {
  interface JQStatic {
    /**
     * 发送 ajax 请求
     * @param options
     * @example
```js
ajax({
  method: "POST",
  url: "some.php",
  data: { name: "John", location: "Boston" }
}).then(function( msg ) {
  alert( "Data Saved: " + msg );
});
```
     */
    // eslint-disable-next-line
    ajax<T = any>(options: Options): Promise<T>;
  }
}

$.ajax = ajax;
