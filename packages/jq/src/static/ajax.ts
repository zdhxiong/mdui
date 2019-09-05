import $ from '../$';
import ajax from '../functions/ajax';
import AjaxOptions from '../interfaces/AjaxOptions';

declare module '../interfaces/JQStatic' {
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
    ajax(options: AjaxOptions): Promise<any>;
  }
}

$.ajax = ajax;
