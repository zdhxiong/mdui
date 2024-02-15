mdui 提供了 `mdui-prose` 和 `mdui-table` CSS 类，专门用于优化文章和表格的样式。

## 文章排版 {#prose}

可以在文章的父元素上添加 `mdui-prose` 类，这样可以优化整篇文章的显示样式，包括文章中的 `<table>` 表格样式。例如：

```html
<div class="mdui-prose">
  <h1>标题</h1>
  <p>正文</p>
  <table>

  </table>
</div>
```

## 表格样式 {#table}

在 `<table>` 元素上添加 `mdui-table` 类，可以优化表格的显示样式。例如：

```html
<table class="mdui-table">

</table>
```

如果你希望表格能在其父元素内横向滚动，可以在 `<table>` 元素的父元素上添加 `mdui-table` 类。例如：

```html
<div class="mdui-table">
  <table>

  </table>
</div>
```
