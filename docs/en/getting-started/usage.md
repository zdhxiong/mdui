# Usage

mdui components are standard Web Components and can be used like `<div>` elements. Each component's documentation provides a comprehensive API, including attributes, methods, events, slots, CSS parts, and CSS custom properties.

This guide focuses on how to use Web Components.

## Attributes {#attribute}

Attributes are divided into HTML attributes and JavaScript properties. They usually correspond one-to-one and are synchronized. This means that updating an HTML attribute value also updates the JavaScript property value, and vice versa.

HTML attributes can be set directly in the component's HTML string. They can be read or modified using the `getAttribute` and `setAttribute` methods:

```html
<mdui-button variant="text">Click me</mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  // Modify HTML attribute
  button.setAttribute('variant', 'outlined');

  // Read HTML attribute
  console.log(button.getAttribute('variant')); // outlined
</script>
```

JavaScript properties can be accessed directly on the component instance or set to modify the property value:

```html
<mdui-button variant="text">Click me</mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  // Set JavaScript property
  button.variant = 'outlined';

  // Read JavaScript property
  console.log(button.variant); // outlined
</script>
```

Boolean attributes map to JavaScript properties that are `true` when the HTML attribute is present and `false` otherwise. However, mdui treats the string value `false` as the boolean value `false` for compatibility with certain frameworks.

```html
<!-- This component has the disabled attribute, so the disabled property is true by default -->
<mdui-button disabled></mdui-button>

<script>
  const button = document.querySelector('mdui-button');

  button.removeAttribute('disabled'); // Equivalent to button.disabled = false;
  button.setAttribute('disabled', ''); // Equivalent to button.disabled = true;

  // Exception: setting to the string "false" value is equivalent to setting to the boolean value false
  button.setAttribute('disabled', 'false'); // Equivalent to button.disabled = false;
</script>
```

For properties that are arrays, objects, or functions, there is only a JavaScript property; there is no corresponding HTML attribute. For example, the [`<mdui-slider>`](/en/docs/2/components/slider) component's [`labelFormatter`](/en/docs/2/components/slider#attributes-labelFormatter) property is a function, which can only be set using JavaScript property:

```html
<mdui-slider></mdui-slider>

<script>
  const slider = document.querySelector('mdui-slider');
  slider.labelFormatter = (value) => `${value}%`;
</script>
```

Here's an example from the attribute documentation of the [`<mdui-slider>`](/en/docs/2/components/slider) component:

| HTML Attribute | JavaScript Property | reflect                                                                                |
| -------------- | ------------------- | -------------------------------------------------------------------------------------- |
| `name`         | `name`              | <mdui-icon name="check--rounded" style="user-select:none;font-size:1rem;"></mdui-icon> |
| `value`        | `value`             |                                                                                        |
|                | `labelFormatter`    |                                                                                        |

The `name` attribute of this component has both HTML and JavaScript properties, and the reflect column means that updating the JavaScript property also updates the HTML attribute. However, the `value` attribute does not reflect changes from the JavaScript property to the HTML attribute. The `labelFormatter` property only exists as a JavaScript property.

## Methods {#method}

Components provide public methods that trigger specific behaviors. For example, the [`focus()`](/en/docs/2/components/text-field#methods-focus) method of the [`<mdui-text-field>`](/en/docs/2/components/text-field) component sets the focus on the text field.

```html
<mdui-text-field></mdui-text-field>

<script>
  const textField = document.querySelector('mdui-text-field');
  textField.focus();
</script>
```

Refer to each component's documentation for a complete list of methods and parameters.

## Events {#event}

Components emit events in response to specific actions. For example, the [`<mdui-dialog>`](/en/docs/2/components/dialog) component emits an [`open`](/en/docs/2/components/dialog#events-open) event when it begins to open. These events can be listened to, enabling the execution of custom actions.

```html
<mdui-dialog>Dialog</mdui-dialog>

<script>
  const dialog = document.querySelector('mdui-dialog');

  dialog.addEventListener('open', () => {
    console.log('This event is triggered when the dialog starts opening');
  });
</script>
```

A comprehensive list of events and their parameters for each component can be found in their respective documentation pages.

When integrating mdui with other frameworks such as Vue, React, or Angular, you can use the framework's syntax to bind events. However, some frameworks, like React, may only support standard events like `click` and not custom events like `open`. In these cases, you may need to manually bind the event using `addEventListener` by obtaining a reference to the element.

For more information on using mdui with React, see the [Frameworks - React](/en/docs/2/frameworks/react) section.

## Slot {#slot}

Components often provide slots for inserting custom HTML content.

The default slot is the most common, used for plain HTML or text within the component. For example, the default slot of the [`<mdui-button>`](/en/docs/2/components/button) component sets the button's text:

```html
<mdui-button>Click me</mdui-button>
```

Some components also offer named slots. You should specify the slot name in the HTML's `slot` attribute. For example, the [`<mdui-icon>`](/en/docs/2/components/icon) component uses `slot="start"` to indicate a named slot called [`start`](/en/docs/2/components/button#slots-icon), positioning the icon on the left inside the component:

```html
<mdui-button>
  <mdui-icon slot="start" name="settings"></mdui-icon>
  Settings
</mdui-button>
```

For components with multiple named slots, the order doesn't matter. They just need to be inside the component, and the browser will automatically place them in the correct positions.

Refer to each component's documentation for a list of supported slots.

## CSS Custom Properties {#css-custom-properties}

mdui uses CSS Custom Properties, also known as CSS variables, to establish a series of [global design tokens](/en/docs/2/styles/design-tokens). These tokens are referenced by various components, enabling you to adjust the styles of mdui components globally.

For example, you can reduce the corner radius of all components by modifying the relevant CSS custom properties:

```css
:root {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}
```

CSS custom properties can also be adjusted within a local scope. For example, you can reduce the corner radius for elements with the `class="sharp"` and their child elements by setting the appropriate CSS custom properties:

```css
.sharp {
  --mdui-shape-corner-extra-small: 0.125rem;
  --mdui-shape-corner-small: 0.25rem;
  --mdui-shape-corner-medium: 0.375rem;
  --mdui-shape-corner-large: 0.5rem;
  --mdui-shape-corner-extra-large: 0.875rem;
}
```

Certain components also provide unique CSS custom properties. These are scoped to specific components and do not include the `--mdui` prefix. For example, you can modify the `z-index` style of the [`<mdui-dialog>`](/en/docs/2/components/dialog) component by adjusting its `--z-index` property.

```css
mdui-dialog {
  --z-index: 3000;
}
```

Please refer to the documentation of each component for a list of supported CSS custom properties.

## CSS Part {#css-part}

mdui components use the shadow DOM for encapsulating styles and behaviors. However, standard CSS selectors cannot select elements within the shadow DOM. To overcome this, some components add a `part` attribute to elements within the shadow DOM. These elements can then be selected and styled using the `::part` CSS selector.

For example, the [`button`](/en/docs/2/components/button#cssParts-button) part modifies the inner padding of the button, while the [`label`](/en/docs/2/components/button#cssParts-label), [`icon`](/en/docs/2/components/button#cssParts-icon), and [`end-icon`](/en/docs/2/components/button#cssParts-end-icon) parts adjust the text color, left icon color, and right icon color, respectively:

```html,example,playgroundId=186
<mdui-button class="custom-button" icon="explore" end-icon="flight">Button</mdui-button>

<style>
  .custom-button::part(button) {
    padding: 0 2rem;
  }

  .custom-button::part(label) {
    color: blue;
  }

  .custom-button::part(icon) {
    color: red;
  }

  .custom-button::part(end-icon) {
    color: yellow;
  }
</style>
```

You can inspect component shadow DOM elements in your browser's developer tools to see their structure and default styles.

Before using CSS Part, check whether global CSS custom properties or component-specific CSS custom properties already cover your needs. If they do, prefer them for style customization.

For a list of publicly exposed `part` properties, please refer to the documentation of each component.

## Component Update Mechanism {#update-mechanism}

mdui components are built using [Lit](https://lit.dev/), a lightweight library that streamlines the development of Web Components. Understanding how components render and update can improve your experience with mdui components.

When you modify the properties of mdui components, the components will re-render. However, this re-rendering is not synchronous. When multiple property values change at the same time, Lit batches these changes until the next update cycle. This approach ensures that each component re-renders only once, regardless of how many properties change. Only the parts of the shadow DOM that actually change will be re-rendered.

In the example below, we set the `disabled` JavaScript property of a button to `true` and immediately query its HTML attribute. However, the component hasn't had a chance to re-render yet, so the queried HTML attribute remains `false`:

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

console.log(button.hasAttribute('disabled')); // false
```

To ensure a component has completed re-rendering after a property value change, you can use the `updateComplete` property. This property returns a Promise that resolves once the component finishes re-rendering.

```js
const button = document.querySelector('mdui-button');
button.disabled = true;

button.updateComplete.then(() => {
  console.log(button.hasAttribute('disabled')); // true
});
```
