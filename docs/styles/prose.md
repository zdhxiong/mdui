mdui 专门为优化文章样式提供了 `mdui-prose` CSS 类，为优化表格样式提供了 `mdui-table` CSS 类。

## 文章排版 {#prose}

在文章的父元素上添加 `mdui-prose` 类，就能优化整篇文章的显示样式。包括文章中的 `<table>` 表格样式也会获得优化。例如：

```html
<div class="mdui-prose">
  <h1>标题</h2>
  <p>正文</p>
  <table>

  </table>
</div>
```

## 表格样式 {#table}

在 `<table>` 元素上添加 `mdui-table` 类，就能优化表格的显示样式。例如：

```html
<table class="mdui-table">

</table>
```

在 `<table>` 元素的父元素上添加 `mdui-table` 类，除了优化表格显示样式外，还能使表格能在该元素内横向滚动。例如：

```html
<div class="mdui-table">
  <table>

  </table>
</div>
```
