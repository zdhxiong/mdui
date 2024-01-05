The `throttle` function creates a throttled version of a function that delays invoking the function until after a specified wait time has elapsed since the last time the throttled function was invoked.

## Usage {#usage}

Import the function:

```js
import { throttle } from 'mdui/functions/throttle.js';
```

Example:

```js
// This function executes at most once within 100 milliseconds, preventing frequent calls during scrolling
window.addEventListener('scroll', throttle(() => {
  console.log('update');
}, 100));
```

## API {#api}

```ts
throttle(func: Function, wait: number): Function
```

The function accepts two parameters. The first parameter, is the function to throttle. The second parameter, is the number of milliseconds to delay before the function can be invoked again. The function returns the throttled version of the provided function.
