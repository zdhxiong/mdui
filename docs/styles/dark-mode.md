mdui 的所有组件都支持暗色模式，并且支持根据操作系统的设置自动切换主题。

<style>
.dark-mode-light-visible,
.dark-mode-dark-visible {
  display: none;
}

.mdui-theme-light {
  .dark-mode-light-visible {
    display: inline-block;
  }
}
.mdui-theme-dark {
  .dark-mode-dark-visible {
    display: inline-block;
  }
}

@media (prefers-color-scheme: light) {
  .mdui-theme-auto .dark-mode-light-visible {
    display: inline-block;
  }
}
@media (prefers-color-scheme: dark) {
  .mdui-theme-auto .dark-mode-dark-visible {
    display: inline-block;
  }
}
</style>

你可以随时点击文档页面右上角的 <mdui-icon class="dark-mode-light-visible" name="light_mode--outlined" style="vertical-align: middle"></mdui-icon><mdui-icon class="dark-mode-dark-visible" name="dark_mode--outlined" style="vertical-align: middle"></mdui-icon> 图标来切换主题，以查看各个组件在不同主题下的显示效果。

如果要使用暗色模式，只需在 `<html>` 标签上添加 `mdui-theme-dark` 类即可：

```html
<html class="mdui-theme-dark">

</html>
```

如果要支持根据操作系统设置自动切换主题，只需在 `<html>` 标签上添加 `mdui-theme-auto` 类即可：

```html
<html class="mdui-theme-auto">

</html>
```

也支持在页面的不同容器上使用不同主题。例如下面的示例，在 `<html>` 上设置暗色模式，但在页面中的一个 `<div>` 上添加了 `mdui-theme-light` 类，这样该 div 中的元素将显示为亮色模式，而页面其余部分则为暗色模式：

```html
<html class="mdui-theme-dark">
  <body>
    <div class="mdui-theme-light">
      <!-- 这里是亮色模式 -->
    </div>

    <!-- 这里是暗色模式 -->
  </body>
</html>
```

除了直接添加 CSS 类外，mdui 还提供了两个函数，可以更便捷的操作主题：

* [`getTheme`](/docs/2/functions/getTheme)：获取当前页面、或指定元素上的主题。
* [`setTheme`](/docs/2/functions/setTheme)：设置当前页面、或指定元素上的主题。

----

需要注意的是，mdui 在 `:root` 及 `.mdui-theme-light`、`.mdui-theme-dark`、`.mdui-theme-auto` 选择器上设置了 `color` 和 `background-color` 样式，如果你不喜欢这些默认样式，可以自行进行覆盖。

下面示例将亮色模式下的页面背景设为纯白，文字设为纯黑；且暗色模式下页面背景设为纯黑，文字设为纯白：

```css
:root,
.mdui-theme-light {
  color: #000;
  background-color: #fff;
}

.mdui-theme-dark {
  color: #fff;
  background-color: #000;
}

@media (prefers-color-scheme: dark) {
  .mdui-theme-auto {
    color: #fff;
    background-color: #000;
  }
}
```
