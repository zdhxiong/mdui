# Frequently Asked Questions

These are some frequently asked questions about mdui. Check them before posting in the community or opening a new issue.

## Why Don't Components Display with Self-Closing Tags? {#no-self-closing}

mdui is a library based on Web Components. Web Components do not support self-closing tags, so you should always use closing tags with mdui components.

```html
<!-- Incorrect usage -->
<mdui-text-field />

<!-- Correct usage -->
<mdui-text-field></mdui-text-field>
```

## How to Prevent Unstyled Components from Appearing Before They Load? {#waiting-load}

mdui components are registered via JavaScript, which can briefly leave them unstyled until the script loads and registers them. Here are two solutions:

One solution is to use the [`:defined`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:defined) pseudo-class to hide unregistered mdui components. The following CSS hides all unregistered mdui components and shows them once registered:

```css
:not(:defined) {
  visibility: hidden;
}
```

Another solution is to use the [`customElements.whenDefined()`](https://developer.mozilla.org/en-US/docs/Web/API/CustomElementRegistry/whenDefined) method. This method returns a promise that resolves when the specified component is registered. To handle cases where some components may fail to load, use [`Promise.allSettled()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/allSettled).

In the following example, the `<body>` element is initially hidden using `opacity: 0` and fades in after the components are registered. `Promise.allSettled()` is used to wait for all promises to complete, ensuring the page displays properly even if a component fails to load.

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
    customElements.whenDefined('mdui-checkbox'),
  ]);

  // After registering the button, card, and checkbox components, add the 'ready' class to fade in the page
  document.body.classList.add('ready');
</script>
```
