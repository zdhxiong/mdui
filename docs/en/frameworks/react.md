To integrate mdui with React, start by following the steps on the [installation](/en/docs/2/getting-started/installation#npm) page.

## Notes {#notes}

When using mdui in a React environment, there are certain aspects to be aware of. These considerations stem from the general constraints of Web Components and are not specific to mdui.

### Event Binding {#event-binding}

React does not natively support custom events. Therefore, to utilize events provided by mdui components, it's necessary to obtain a reference to the component using the `ref` attribute. This reference can then be used to add event listeners.

Here's an example of handling mdui component events in React:

```js
class Home extends Component {
  constructor(props) {
    super(props);
    this.switchRef = React.createRef();
  }

  componentDidMount() {
    this.switchRef.current.addEventListener('change', event => {
      console.log('switch is toggled');
    });
  }

  render() {
    return(
      <mdui-switch ref={this.switchRef}></mdui-switch>
    );
  }
}
```

### TypeScript Type Declarations for JSX {#jsx-typescript}

If you're using mdui in TypeScript files (.tsx), it's important to include TypeScript type declarations. You can do this by importing mdui's type declaration files into your project's .d.ts file:

```ts
/// <reference types="mdui/jsx.en.d.ts" />
```
