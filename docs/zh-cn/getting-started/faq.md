## 使用自闭合标签为何无法显示组件？ {#no-self-closing}

mdui 是基于 Web Components 开发的组件库，Web Components 规范不支持自闭合标签，因此请确保为 mdui 组件添加结束标签。

```html
<!-- 错误用法 -->
<mdui-text-field/>

<!-- 正确用法 -->
<mdui-text-field></mdui-text-field>
```

## 如何在组件加载完成前隐藏组件？ {#waiting-load}

由于 mdui 组件是通过 JavaScript 进行注册的，因此在 js 文件加载并注册组件之前，组件可能会暂时显示为无样式状态。以下两种方法可以解决这个问题：

一种方法是使用 CSS 的 [`:defined`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:defined) 伪类来隐藏未注册的 mdui 组件。以下 CSS 代码将隐藏所有未注册的 mdui 组件，并在组件注册完成后立即显示：

```css
:not(:defined) {
  visibility: hidden;
}
```

另一种方法是使用 JavaScript 的 [`customElements.whenDefined()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CustomElementRegistry/whenDefined) 方法。这个方法返回一个 promise，当指定的组件注册完成后，该 promise 将被 resolve。为了处理某些组件由于特殊原因无法加载的情况，你可以配合使用 [`Promise.allSettled()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled) 方法。

以下示例首先通过 `opacity: 0` 将 `<body>` 隐藏，然后在组件注册完成后，使页面淡入显示。同时，示例使用了 `Promise.allSettled()` 来等待所有 promise 完成，确保即使某个组件无法加载，页面也能正常显示：

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
