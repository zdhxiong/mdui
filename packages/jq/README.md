# mdui.JQ

[![GitHub version](https://badge.fury.io/gh/zdhxiong%2Fmdui.JQ.svg)](https://badge.fury.io/gh/zdhxiong%2Fmdui.JQ)
![Bower version](https://img.shields.io/bower/v/mdui.JQ.svg)
[![npm version](https://img.shields.io/npm/v/mdui.jq.svg)](https://www.npmjs.com/package/mdui.jq)
[![dependencies Status](https://david-dm.org/zdhxiong/mdui.JQ/status.svg)](https://david-dm.org/zdhxiong/mdui.JQ)
[![devDependencies Status](https://david-dm.org/zdhxiong/mdui.JQ/dev-status.svg)](https://david-dm.org/zdhxiong/mdui.JQ?type=dev)

拥有和 jQuery 相似 API 的轻量级 JavaScript 工具库。已作为 [MDUI](https://github.com/zdhxiong/mdui) 内置工具库使用。

文档：https://www.mdui.org/docs/jq

## 通过 `<script>` 标签引入 JS 文件：

```html
<script src="./jq.min.js"></script>
```

然后你可以通过 `JQ` 来访问该对象。如果你想使用 `$` 来访问该对象，需要自行进行赋值：

```js
var $ = JQ;
```

jq.js 和 jq.min.js 文件已经内置了 polyfill 文件，可直接兼容 IE 浏览器。

## 在 ES6 模块化环境中使用

通过 `npm` 安装 `mdui.jq`：

```
npm install mdui.jq --save
```

在 `JS` 文件中导入 `mdui.jq`：

```js
import $ from 'mdui.jq';
```

注意：在 ES6 模块化环境中，mdui.jq 默认没有包含 polyfill 文件。如果你的构建环境不会自动转换 ES6 API，则需要在导入 `mdui.jq` 前先导入 polyfill 文件：

```js
import 'mdn-polyfills/MouseEvent';
import 'mdn-polyfills/CustomEvent';
import 'promise-polyfill/src/polyfill';
```

## 在 ES6 环境中按需导入所需模块

因为 `mdui.jq` 的大部分方法都是 `$` 的原型链方法，导致构建工具的 Tree shaking 无法自动移除没有用到的方法。

`mdui.jq` 中每一个方法都是一个模块，你可以仅导入需要用到的方法：

```js
// 导入 $，其中已包含了 $.extend 和 $.fn.extend 方法
import $ from 'mdui.jq/src/$';

// 按需导入下面的原型链方法。导入对应的方法后，就能以这样的形式调用：$(document).method()
// 注意：这些方法都依赖 $，因此导入这些方法前需要先导入 mdui.jq/src/$
import 'mdui.jq/src/methods/add';
import 'mdui.jq/src/methods/addClass';
import 'mdui.jq/src/methods/after';
import 'mdui.jq/src/methods/ajaxComplete';
import 'mdui.jq/src/methods/ajaxError';
import 'mdui.jq/src/methods/ajaxStart';
import 'mdui.jq/src/methods/ajaxSuccess';
import 'mdui.jq/src/methods/append';
import 'mdui.jq/src/methods/appendTo';
import 'mdui.jq/src/methods/attr';
import 'mdui.jq/src/methods/before';
import 'mdui.jq/src/methods/children';
import 'mdui.jq/src/methods/clone';
import 'mdui.jq/src/methods/closest';
import 'mdui.jq/src/methods/css';
import 'mdui.jq/src/methods/data';
import 'mdui.jq/src/methods/each';
import 'mdui.jq/src/methods/empty';
import 'mdui.jq/src/methods/eq';
import 'mdui.jq/src/methods/filter';
import 'mdui.jq/src/methods/find';
import 'mdui.jq/src/methods/first';
import 'mdui.jq/src/methods/get';
import 'mdui.jq/src/methods/has';
import 'mdui.jq/src/methods/hasClass';
import 'mdui.jq/src/methods/height';
import 'mdui.jq/src/methods/hide';
import 'mdui.jq/src/methods/html';
import 'mdui.jq/src/methods/index';
import 'mdui.jq/src/methods/innerHeight';
import 'mdui.jq/src/methods/innerWidth';
import 'mdui.jq/src/methods/insertAfter';
import 'mdui.jq/src/methods/insertBefore';
import 'mdui.jq/src/methods/is';
import 'mdui.jq/src/methods/last';
import 'mdui.jq/src/methods/map';
import 'mdui.jq/src/methods/next';
import 'mdui.jq/src/methods/nextAll';
import 'mdui.jq/src/methods/nextUntil';
import 'mdui.jq/src/methods/not';
import 'mdui.jq/src/methods/off';
import 'mdui.jq/src/methods/offset';
import 'mdui.jq/src/methods/offsetParent';
import 'mdui.jq/src/methods/on';
import 'mdui.jq/src/methods/one';
import 'mdui.jq/src/methods/parent';
import 'mdui.jq/src/methods/parents';
import 'mdui.jq/src/methods/parentUntil';
import 'mdui.jq/src/methods/position';
import 'mdui.jq/src/methods/prepend';
import 'mdui.jq/src/methods/prependTo';
import 'mdui.jq/src/methods/prev';
import 'mdui.jq/src/methods/prevAll';
import 'mdui.jq/src/methods/prevUntil';
import 'mdui.jq/src/methods/prop';
import 'mdui.jq/src/methods/remove';
import 'mdui.jq/src/methods/removeAttr';
import 'mdui.jq/src/methods/removeClass';
import 'mdui.jq/src/methods/removeData';
import 'mdui.jq/src/methods/removeProp';
import 'mdui.jq/src/methods/replaceAll';
import 'mdui.jq/src/methods/replaceWith';
import 'mdui.jq/src/methods/serialize';
import 'mdui.jq/src/methods/serializeArray';
import 'mdui.jq/src/methods/show';
import 'mdui.jq/src/methods/siblings';
import 'mdui.jq/src/methods/slice';
import 'mdui.jq/src/methods/text';
import 'mdui.jq/src/methods/toggle';
import 'mdui.jq/src/methods/toggleClass';
import 'mdui.jq/src/methods/trigger';
import 'mdui.jq/src/methods/val';
import 'mdui.jq/src/methods/width';

// 按需导入函数，这些函数不依赖 $，无需先导入 $
// 如果你希望以 $.method() 的形式调用这些函数，需要自行将函数扩展到 $ 下，例如 $.extend({ ajax: ajax })
import ajax from 'mdui.jq/src/functions/ajax';
import ajaxSetup from 'mdui.jq/src/functions/ajaxSetup';
import contains from 'mdui.jq/src/functions/contains';
import data from 'mdui.jq/src/functions/data';
import each from 'mdui.jq/src/functions/each';
import map from 'mdui.jq/src/functions/map';
import merge from 'mdui.jq/src/functions/merge';
import param from 'mdui.jq/src/functions/param';
import removeData from 'mdui.jq/src/functions/removeData';
import unique from 'mdui.jq/src/functions/unique';
```
