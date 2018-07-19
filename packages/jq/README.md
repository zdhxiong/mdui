# mdui.JQ

拥有和 jQuery 相似 API 的轻量级 JavaScript 工具库。已作为 [MDUI](https://github.com/zdhxiong/mdui) 内置工具库使用。

文档：https://www.mdui.org/docs/jq

## 安装

使用 npm 或 yarn 安装。

```
npm install mdui.JQ --save
```

mdui.JQ 支持 CommonJS、AMD 和 ES6 模块化规范。

在 ES6 环境中，可以这样导入：

```js
import $ from mdui.JQ;
```

如果你不想使用构建环境，可以直接通过 <script> 标签引入 js 文件：

```html
<script src="./jq.min.js"></script>
```

然后你可以通过 `JQ` 来访问该对象。如果你想使用 `$` 来访问该对象，需要自行进行赋值：

```js
var $ = JQ;
```
