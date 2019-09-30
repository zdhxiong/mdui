import { isNull, toElement } from '../utils';

/**
 * 检查 container 元素内是否包含 contains 元素
 * @param container 父元素
 * @param contains 子元素
 * @example
```js
contains( document.documentElement, document.body ); // true
contains( document.body, document.documentElement ); // false
```
 */
function contains(
  container: Element | Document | null,
  contains: Element | Document | null,
): boolean {
  if (isNull(container) || isNull(contains)) {
    return false;
  }

  return container !== contains && toElement(container).contains(contains);
}

export default contains;
