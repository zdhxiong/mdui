> 你正在阅读的是 mdui 2 的文档！
>
> 若要阅读 mdui 1 的文档，请访问 [www.mdui.org/docs/](https://www.mdui.org/docs/)。

让我们通过 mdui 的 CDN 和一个最简单的页面模板来开始使用 mdui。

## 快速入门 {#getting-started}

使用 mdui 最简单的方式是直接从 CDN 引入 CSS 和 JS 文件。

如果你想使用 npm 安装 mdui，请参考 [安装](/docs/2/getting-started/installation) 章节。

**引入文件**

将下面代码添加到页面的 `<head>` 标签中：

```html
<link rel="stylesheet" href="https://unpkg.com/mdui@2.0.1/mdui.css">
<script src="https://unpkg.com/mdui@2.0.1/mdui.global.js"></script>
```

mdui 不依赖任何第三方库，引入上面两个文件后，就能正常工作了。

## 最简单的页面模板 {#template}

下面是一个最简单的页面模板，你可以自行在其中添加更多组件和内容，来构建一个网站。

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, shrink-to-fit=no"/>
    <meta name="renderer" content="webkit"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"/>

    <link rel="stylesheet" href="https://unpkg.com/mdui@2.0.1/mdui.css">
    <script src="https://unpkg.com/mdui@2.0.1/mdui.global.js"></script>

    <title>Hello, world!</title>
  </head>
  <body>
    <mdui-button>Hello, world!</mdui-button>
  </body>
</html>
```
