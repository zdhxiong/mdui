# mdui.jq

[![GitHub version](https://badge.fury.io/gh/zdhxiong%2Fmdui.JQ.svg)](https://badge.fury.io/gh/zdhxiong%2Fmdui.JQ)
![Bower version](https://img.shields.io/bower/v/mdui.JQ.svg)
[![npm version](https://img.shields.io/npm/v/mdui.jq.svg)](https://www.npmjs.com/package/mdui.jq)
[![dependencies Status](https://david-dm.org/zdhxiong/mdui.JQ/status.svg)](https://david-dm.org/zdhxiong/mdui.JQ)
[![devDependencies Status](https://david-dm.org/zdhxiong/mdui.JQ/dev-status.svg)](https://david-dm.org/zdhxiong/mdui.JQ?type=dev)
[![CodeFactor](https://www.codefactor.io/repository/github/zdhxiong/mdui.jq/badge)](https://www.codefactor.io/repository/github/zdhxiong/mdui.jq)

拥有和 jQuery 相似 API 的轻量级 JavaScript 工具库。已作为 [MDUI](https://github.com/zdhxiong/mdui) 内置工具库使用。

mdui.jq 全部使用 typescript 开发，可获得完美的类型提示。

兼容至 IE11。

文档：https://www.mdui.org/docs/jq

## 通过 `<script>` 标签引入 JS 文件

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

在 `js` 文件中导入 `mdui.jq`：

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
// 导入 $ 函数
import $ from 'mdui.jq/es/$';

// 按需导入下面的原型链方法。导入对应的方法后，就能以这样的形式调用：$(document).method()
// 注意：这些方法都依赖 $，因此导入这些方法前需要先导入 mdui.jq/es/$
import 'mdui.jq/es/methods/add';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/after';
import 'mdui.jq/es/methods/ajaxComplete';
import 'mdui.jq/es/methods/ajaxError';
import 'mdui.jq/es/methods/ajaxStart';
import 'mdui.jq/es/methods/ajaxSuccess';
import 'mdui.jq/es/methods/append';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/before';
import 'mdui.jq/es/methods/children';
import 'mdui.jq/es/methods/clone';
import 'mdui.jq/es/methods/closest';
import 'mdui.jq/es/methods/css';
import 'mdui.jq/es/methods/data';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/empty';
import 'mdui.jq/es/methods/eq';
import 'mdui.jq/es/methods/extend';
import 'mdui.jq/es/methods/filter';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/first';
import 'mdui.jq/es/methods/get';
import 'mdui.jq/es/methods/has';
import 'mdui.jq/es/methods/hasClass';
import 'mdui.jq/es/methods/height';
import 'mdui.jq/es/methods/hide';
import 'mdui.jq/es/methods/html';
import 'mdui.jq/es/methods/index';
import 'mdui.jq/es/methods/innerHeight';
import 'mdui.jq/es/methods/innerWidth';
import 'mdui.jq/es/methods/insertAfter';
import 'mdui.jq/es/methods/insertBefore';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/last';
import 'mdui.jq/es/methods/map';
import 'mdui.jq/es/methods/next';
import 'mdui.jq/es/methods/nextAll';
import 'mdui.jq/es/methods/nextUntil';
import 'mdui.jq/es/methods/not';
import 'mdui.jq/es/methods/off';
import 'mdui.jq/es/methods/offset';
import 'mdui.jq/es/methods/offsetParent';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/one';
import 'mdui.jq/es/methods/outerHeight';
import 'mdui.jq/es/methods/outerWidth';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/parentsUntil';
import 'mdui.jq/es/methods/position';
import 'mdui.jq/es/methods/prepend';
import 'mdui.jq/es/methods/prependTo';
import 'mdui.jq/es/methods/prev';
import 'mdui.jq/es/methods/prevAll';
import 'mdui.jq/es/methods/prevUntil';
import 'mdui.jq/es/methods/prop';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeAttr';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/removeData';
import 'mdui.jq/es/methods/removeProp';
import 'mdui.jq/es/methods/replaceAll';
import 'mdui.jq/es/methods/replaceWith';
import 'mdui.jq/es/methods/serialize';
import 'mdui.jq/es/methods/serializeArray';
import 'mdui.jq/es/methods/show';
import 'mdui.jq/es/methods/siblings';
import 'mdui.jq/es/methods/slice';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/toggle';
import 'mdui.jq/es/methods/toggleClass';
import 'mdui.jq/es/methods/trigger';
import 'mdui.jq/es/methods/val';
import 'mdui.jq/es/methods/width';

// 按需导入下面的静态方法。导入对应的方法后，就能以这样的形式调用：$.method()
// 注意：这些方法都依赖 $，因此导入这些方法前需要先导入 mdui.jq/es/$
import 'mdui.jq/es/static/ajax';
import 'mdui.jq/es/static/ajaxSetup';
import 'mdui.jq/es/static/contains';
import 'mdui.jq/es/static/data';
import 'mdui.jq/es/static/each';
import 'mdui.jq/es/static/map';
import 'mdui.jq/es/static/merge';
import 'mdui.jq/es/static/param';
import 'mdui.jq/es/static/removeData';
import 'mdui.jq/es/static/unique';

// 上面提到的静态方法，也可以作为独立的函数使用。作为独立函数使用时，不需要依赖 $。
import ajax from 'mdui.jq/es/functions/ajax';
import ajaxSetup from 'mdui.jq/es/functions/ajaxSetup';
import contains from 'mdui.jq/es/functions/contains';
import data from 'mdui.jq/es/functions/data';
import each from 'mdui.jq/es/functions/each';
import map from 'mdui.jq/es/functions/map';
import merge from 'mdui.jq/es/functions/merge';
import param from 'mdui.jq/es/functions/param';
import removeData from 'mdui.jq/es/functions/removeData';
import unique from 'mdui.jq/es/functions/unique';
```
