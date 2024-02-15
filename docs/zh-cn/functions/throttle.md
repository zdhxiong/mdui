`throttle` 函数用于创建一个节流函数，该函数在指定的时间间隔内最多只执行一次。

## 使用方法 {#usage}

按需导入函数：

```js
import { throttle } from 'mdui/functions/throttle.js';
```

使用示例：

```js
// 这个函数在 100 毫秒内最多执行一次，可避免在滚动时过于频繁地调用该函数
window.addEventListener('scroll', throttle(() => {
  console.log('update');
}, 100));
```

## API {#api}

```ts
throttle(func: Function, wait: number): Function
```

函数的第一个参数是需要进行节流操作的函数，第二个参数是指定的时间间隔（单位：毫秒）。函数的返回值是经过节流处理的函数。
