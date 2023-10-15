# @mdui/jq

拥有和 jQuery 相似 API 的轻量级 JavaScript 工具库。已作为 [mdui](https://github.com/zdhxiong/mdui) 内置工具库使用。

@mdui/jq 全部使用 typescript 开发，可获得完美的类型提示。

文档：https://www.mdui.org/docs/2/functions/jq

## 安装

```
npm install @mdui/jq --save
```

### 全量导入 `@mdui/jq`：

```js
import { $ } from '@mdui/jq';
```

## 按需导入所需模块

因为 `@mdui/jq` 的大部分方法都是 `$` 的原型链方法，导致构建工具的 Tree shaking 无法自动移除没有用到的方法。

`@mdui/jq` 中每一个方法都是一个模块，你可以仅导入需要用到的方法：

```js
// 导入 $ 函数
import { $ } from '@mdui/jq/$.js';

// 按需导入下面的原型链方法。导入对应的方法后，就能以这样的形式调用：$(document).method()
// 注意：这些方法都依赖 $，因此导入这些方法前需要先导入 @mdui/jq/$.js
import '@mdui/jq/methods/add.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/after.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/appendTo.js';
import '@mdui/jq/methods/attr.js';
import '@mdui/jq/methods/before.js';
import '@mdui/jq/methods/children.js';
import '@mdui/jq/methods/clone.js';
import '@mdui/jq/methods/closest.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/data.js';
import '@mdui/jq/methods/each.js';
import '@mdui/jq/methods/empty.js';
import '@mdui/jq/methods/eq.js';
import '@mdui/jq/methods/extend.js';
import '@mdui/jq/methods/filter.js';
import '@mdui/jq/methods/find.js';
import '@mdui/jq/methods/first.js';
import '@mdui/jq/methods/get.js';
import '@mdui/jq/methods/has.js';
import '@mdui/jq/methods/hasClass.js';
import '@mdui/jq/methods/height.js';
import '@mdui/jq/methods/hide.js';
import '@mdui/jq/methods/html.js';
import '@mdui/jq/methods/index.js';
import '@mdui/jq/methods/innerHeight.js';
import '@mdui/jq/methods/innerWidth.js';
import '@mdui/jq/methods/insertAfter.js';
import '@mdui/jq/methods/insertBefore.js';
import '@mdui/jq/methods/is.js';
import '@mdui/jq/methods/last.js';
import '@mdui/jq/methods/map.js';
import '@mdui/jq/methods/next.js';
import '@mdui/jq/methods/nextAll.js';
import '@mdui/jq/methods/nextUntil.js';
import '@mdui/jq/methods/not.js';
import '@mdui/jq/methods/off.js';
import '@mdui/jq/methods/offset.js';
import '@mdui/jq/methods/offsetParent.js';
import '@mdui/jq/methods/on.js';
import '@mdui/jq/methods/one.js';
import '@mdui/jq/methods/outerHeight.js';
import '@mdui/jq/methods/outerWidth.js';
import '@mdui/jq/methods/parent.js';
import '@mdui/jq/methods/parents.js';
import '@mdui/jq/methods/parentsUntil.js';
import '@mdui/jq/methods/position.js';
import '@mdui/jq/methods/prepend.js';
import '@mdui/jq/methods/prependTo.js';
import '@mdui/jq/methods/prev.js';
import '@mdui/jq/methods/prevAll.js';
import '@mdui/jq/methods/prevUntil.js';
import '@mdui/jq/methods/prop.js';
import '@mdui/jq/methods/remove.js';
import '@mdui/jq/methods/removeAttr.js';
import '@mdui/jq/methods/removeClass.js';
import '@mdui/jq/methods/removeData.js';
import '@mdui/jq/methods/removeProp.js';
import '@mdui/jq/methods/replaceAll.js';
import '@mdui/jq/methods/replaceWith.js';
import '@mdui/jq/methods/serialize.js';
import '@mdui/jq/methods/serializeArray.js';
import '@mdui/jq/methods/serializeObject.js';
import '@mdui/jq/methods/show.js';
import '@mdui/jq/methods/siblings.js';
import '@mdui/jq/methods/slice.js';
import '@mdui/jq/methods/text.js';
import '@mdui/jq/methods/toggle.js';
import '@mdui/jq/methods/toggleClass.js';
import '@mdui/jq/methods/trigger.js';
import '@mdui/jq/methods/val.js';
import '@mdui/jq/methods/width.js';

// 按需导入下面的静态方法。导入对应的方法后，就能以这样的形式调用：$.method()
// 注意：这些方法都依赖 $，因此导入这些方法前需要先导入 @mdui/jq/$
import '@mdui/jq/static/ajax.js';
import '@mdui/jq/static/ajaxSetup.js';
import '@mdui/jq/static/contains.js';
import '@mdui/jq/static/data.js';
import '@mdui/jq/static/each.js';
import '@mdui/jq/static/extend.js';
import '@mdui/jq/static/map.js';
import '@mdui/jq/static/merge.js';
import '@mdui/jq/static/param.js';
import '@mdui/jq/static/removeData.js';
import '@mdui/jq/static/unique.js';

// 上面提到的静态方法，也可以作为独立的函数使用。作为独立函数使用时，不需要依赖 $。
import { ajax, ajaxSetup, contains, data, each, extend, map, merge, param, removeData, unique } from '@mdui/jq/functions.js';
```
