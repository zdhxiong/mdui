默认使用 `position: fixed`，会自动在 `body` 上添加 `padding-bottom`。

下列两种情况默认使用 `position: absolute`：
1. 指定了 `scroll-target` 属性。此时会在 scroll-target 的元素上添加 `padding-bottom`。
2. 位于 `<mdui-layout></mdui-layout>` 组件中。此时不会添加 `padding-bottom`。
