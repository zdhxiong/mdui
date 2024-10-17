列表是一种垂直排列的索引，用于展示文本或图片，便于用户快速浏览和访问相关信息。

## 使用方法 {#usage}

按需导入组件：

```js
import 'mdui/components/list.js';
import 'mdui/components/list-item.js';
import 'mdui/components/list-subheader.js';
```

按需导入组件的 TypeScript 类型：

```ts
import type { List } from 'mdui/components/list.js';
import type { ListItem } from 'mdui/components/list-item.js';
import type { ListSubheader } from 'mdui/components/list-subheader.js';
```

使用示例：

```html,example
<mdui-list>
  <mdui-list-subheader>Subheader</mdui-list-subheader>
  <mdui-list-item>Item 1</mdui-list-item>
  <mdui-list-item>Item 2</mdui-list-item>
</mdui-list>
```

## 示例 {#examples}

### 文本内容 {#example-text}

在 `<mdui-list-item>` 组件上设置 `headline` 属性，可以设定列表项的主文本，设置 `description` 属性，可以设定副文本。

```html,example,expandable
<mdui-list>
  <mdui-list-item headline="Headline"></mdui-list-item>
  <mdui-list-item headline="Headline" description="Supporting text"></mdui-list-item>
</mdui-list>
```

也可以通过 default slot 设定主文本，通过 `description` slot 设定副文本。

```html,example,expandable
<mdui-list>
  <mdui-list-item>Headline</mdui-list-item>
  <mdui-list-item>
    Headline
    <span slot="description">Supporting text</span>
  </mdui-list-item>
</mdui-list>
```

默认情况下，主文本和副文本无论长度如何，都会完全显示。你可以通过设置 `headline-line` 和 `description-line` 属性为主文本和副文本添加行数限制，最多可以限制为 3 行。

```html,example,expandable
<mdui-list>
  <mdui-list-item headline-line="1" description-line="2">
    Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline Headline
    <span slot="description">Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text Supporting text</span>
  </mdui-list-item>
</mdui-list>
```

### 两侧内容 {#example-side}

在 `<mdui-list-item>` 组件上设置 `icon` 和 `end-icon` 属性，可以在列表项的左侧和右侧添加 Material Icons 图标。

```html,example,expandable
<mdui-list>
  <mdui-list-item icon="people" end-icon="arrow_right">Headline</mdui-list-item>
</mdui-list>
```

也可以通过 `icon` 和 `end-icon` slot 在列表项的左侧和右侧添加元素。

```html,example,expandable
<mdui-list>
  <mdui-list-item>
    Headline
    <mdui-avatar slot="icon" src="https://avatars.githubusercontent.com/u/3030330?s=40&v=4"></mdui-avatar>
    <mdui-checkbox slot="end-icon"></mdui-checkbox>
  </mdui-list-item>
</mdui-list>
```

### 链接 {#example-link}

通过设置 `href` 属性，可以将列表项转换为链接。此时，你还可以使用与链接相关的属性，如：`download`、`target` 和 `rel`。

```html,example,expandable
<mdui-list>
  <mdui-list-item href="https://www.mdui.org" target="_blank">Headline</mdui-list-item>
</mdui-list>
```

### 禁用状态 {#example-disabled}

在 `<mdui-list-item>` 组件上添加 `disabled` 属性，可以禁用该列表项。此时，列表项中的 checkbox、radio、switch 等组件也会被禁用。

```html,example,expandable
<mdui-list>
  <mdui-list-item disabled>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### 激活状态 {#example-active}

在 `<mdui-list-item>` 组件上添加 `active` 属性，可以激活该列表项。

```html,example,expandable
<mdui-list>
  <mdui-list-item active>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### 不可点击状态 {#example-nonclickable}

在 `<mdui-list-item>` 组件上添加 `nonclickable` 属性，可以移除列表项上的鼠标悬浮和点击涟漪效果。

```html,example,expandable
<mdui-list>
  <mdui-list-item nonclickable>Headline</mdui-list-item>
  <mdui-list-item>Headline</mdui-list-item>
</mdui-list>
```

### 圆角形状 {#example-rounded}

在 `<mdui-list-item>` 组件上添加 `rounded` 属性，可以使该列表项呈现圆角形状。

```html,example,expandable
<mdui-list>
  <mdui-list-item rounded>Headline</mdui-list-item>
  <mdui-list-item rounded>Headline</mdui-list-item>
</mdui-list>
```

### 垂直对齐方式 {#example-alignment}

在 `<mdui-list-item>` 组件上设置 `alignment` 属性，可以调整列表项左右两侧元素与列表项的对齐方式。其值可以为：

* `start`：顶部对齐
* `center`：居中对齐
* `end`：底部对齐

```html,example,expandable
<mdui-list>
  <mdui-list-item alignment="start" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
  <mdui-list-item alignment="center" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
  <mdui-list-item alignment="end" description="Supporting text">
    Headline
    <mdui-icon slot="icon" name="people"></mdui-icon>
  </mdui-list-item>
</mdui-list>
```

### 自定义内容 {#example-custom}

在 `<mdui-list-item>` 组件中使用 `custom` slot，可以完全自定义列表项的内容。

```html,example,expandable
<mdui-list>
  <mdui-list-item>
    <div slot="custom" style="display: flex;">
      <mdui-icon name="people"></mdui-icon>
      <div>test</div>
    </div>
  </mdui-list-item>
</mdui-list>
```
