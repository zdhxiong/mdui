mdui is developed with TypeScript, offering robust TypeScript support. All official mdui libraries include type declaration files for immediate use.

## Component Instance Types {#instance}

Occasionally, you may need to assert a JavaScript variable as an mdui component instance. You can import the corresponding component type directly from mdui.

For example, to import the Tooltip component type from the component file:

```ts
import type { Tooltip } from 'mdui/components/tooltip.js';
```

Alternatively, import the Tooltip component type directly from mdui:

```ts
import type { Tooltip } from 'mdui';
```

Then, you can assert a JavaScript variable as the Tooltip type:

```ts
const tooltip = document.querySelector('mdui-tooltip') as Tooltip;
```

Your IDE will automatically suggest the properties and methods of the `tooltip` variable.

When adding an event listener to the `tooltip` variable, the IDE will also suggest event names, event types, and the `this` context in the callback function:

```ts
tooltip.addEventListener('open', function(event) {
});
```

## Event Types {#event}

Each component exports an interface mapping the component's event names to their corresponding event object types. The interface is named `${componentName}EventMap`.

For example, the Tooltip component exports an interface named `TooltipEventMap`:

```ts
export interface TooltipEventMap {
  open: CustomEvent<void>;
  opened: CustomEvent<void>;
  close: CustomEvent<void>;
  closed: CustomEvent<void>;
}
```

You can import the `TooltipEventMap` interface from the component file:

```ts
import type { TooltipEventMap } from 'mdui/components/tooltip.js';
```

Or directly from mdui:

```ts
import type { TooltipEventMap } from 'mdui';
```

This interface only includes component-specific events. Since mdui components inherit from `HTMLElement`, they also support `HTMLElement` events. Use intersection types to get all event types for a component:

```ts
type TooltipAndHTMLElementEventMap = TooltipEventMap & HTMLElementEventMap;
```
