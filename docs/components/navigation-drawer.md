默认使用 `position: fixed`。
`modal` 为 `false`、且断点不是手机时，会自动在 `body` 上添加 `padding-left` 或 `padding-right`。

下列两种情况默认使用 `position: absolute`：
1. 指定了 `contained` 属性。`modal` 为 `false`、且断点不是手机时，会自动在父元素上添加 `padding-left` 或 `padding-right`。
2. 位于 `<mdui-layout></mdui-layout>` 组件中。此时不会添加 `padding-left` 或 `padding-right`。

modal 或 handset 时，drawer 为全屏
否则，drawer 固定宽度
