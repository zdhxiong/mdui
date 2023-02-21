默认使用 `position: fixed`，会自动在 `body` 上添加 `padding-left` 或 `padding-right`。

下列两种情况默认使用 `position: absolute`：
1. 指定了 `contained` 属性。此时会在父元素上添加 `padding-left` 或 `padding-right`。
2. 位于 `<mdui-layout></mdui-layout>` 组件中。此时不会添加 `padding-left` 或 `padding-right`。
