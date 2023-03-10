## 使用自闭和标签为何无法显示组件？ {#no-self-closing}

mdui 是使用 Web Components 开发的组件库，Web Components 不支持使用自闭和标签来定义，所以请始终为 mdui 组件添加结束标记。

```html
<!-- 错误用法 -->
<mdui-text-field/>

<!-- 正确用法 -->
<mdui-text-field></mdui-text-field>
```

## 如何在组件加载完之前隐藏组件？ {#waiting-load}

由于 mdui 组件是使用 JavaScript 来注册的，因此在 js 文件加载完并注册组件之前，组件可能会短暂地显示为无样式状态。有两种方式来解决这个问题：

一种方式是使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/CSS/:defined" target="_blank" rel="nofollow">`:defined`</a> 伪类来隐藏尚未注册的 mdui 组件。下面的 CSS 代码将隐藏所有未注册的 mdui 组件，且在组件注册完成后，会立即显示：

```css
:not(:defined) {
  visibility: hidden;
}
```

另一种方式是使用 <a href="https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/whenDefined" target="_blank" rel="nofollow">`customElements.whenDefined()`</a> 方法，该方法返回 promise，且该 promise 会在指定组件注册完成后被 resolve。为了兼容某些组件由于某些特殊原因无法加载的情况，你可以和 <a href="https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled" target="_blank" rel="nofollow">`Promise.allSettled()`</a> 一起使用。

下面这个示例先通过 `opacity: 0` 把 `<body>` 隐藏，并在组件注册完后，使页面淡入显示。且使用了 `Promise.allSettled()` 来等待所有 promise 完成，确保了即使某个组件无法加载，页面也能正常显示：

```html
<style>
  body {
    opacity: 0;
  }

  body.ready {
    opacity: 1;
    transition: 0.25s opacity;
  }
</style>

<script type="module">
  await Promise.allSettled([
    customElements.whenDefined('mdui-button'),
    customElements.whenDefined('mdui-card'),
    customElements.whenDefined('mdui-checkbox')
  ]);

  // 现在 button, card, checkbox 组件已经注册完成，添加 ready class，使页面淡入显示
  document.body.classList.add('ready');
</script>
```
