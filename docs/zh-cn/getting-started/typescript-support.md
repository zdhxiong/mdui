mdui 是用 TypeScript 开发的，因此对 TypeScript 提供了良好的支持。所有的 mdui 官方库都自带类型声明文件，可以直接使用。

## 组件的实例类型 {#instance}

有时，你可能需要将一个 JavaScript 变量断言为 mdui 的组件实例，这时你可以直接从 mdui 中导入对应的组件类型。

例如，从组件文件中导入 Tooltip 组件的类型：

```ts
import type { Tooltip } from 'mdui/components/tooltip.js';
```

或者直接从 mdui 导入 Tooltip 组件的类型：

```ts
import type { Tooltip } from 'mdui';
```

然后，你就可以将一个 JavaScript 变量断言成 Tooltip 类型：

```ts
const tooltip = document.querySelector('mdui-tooltip') as Tooltip;
```

此时，你的 IDE 会自动提示 `tooltip` 变量的属性和方法。

如果在 `tooltip` 变量上添加事件监听，也会自动提示事件名称，事件类型，以及回调函数中 `this` 的指向：

```ts
tooltip.addEventListener('open', function(event) {
});
```

## 事件类型 {#event}

每个组件都会导出一个接口，它映射了组件的事件名和它对应的事件对象类型，接口名为 `${组件名}EventMap`。

例如，Tooltip 组件会导出一个名为 `TooltipEventMap` 的接口：

```ts
export interface TooltipEventMap {
  open: CustomEvent<void>;
  opened: CustomEvent<void>;
  close: CustomEvent<void>;
  closed: CustomEvent<void>;
}
```

你可以从组件文件中导入该接口：

```ts
import type { TooltipEventMap } from 'mdui/components/tooltip.js';
```

或者直接从 mdui 导入该接口：

```ts
import type { TooltipEventMap } from 'mdui';
```

请注意，该接口只包含组件特有的事件，但 mdui 组件都继承自 `HTMLElement`，所以也支持 `HTMLElement` 的事件，你可以使用交叉类型来获取组件的所有事件类型：

```ts
type TooltipAndHTMLElementEventMap = TooltipEventMap & HTMLElementEventMap;
```
