import JQElement from '../types/JQElement';
import { JQ } from '../JQ';
import $ from '../$';
import './each';
import { isElement } from '../utils';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 显示对象中的所有元素
     * @example
```js
$('.box').show()
```
     */
    show(): this;
  }
}

const elementDisplay: {
  [nodeName: string]: string;
} = {};

/**
 * 获取元素的默认 display 样式值，用于 .show() 方法
 * @param nodeName
 */
function defaultDisplay(nodeName: string): string {
  let element: HTMLElement;
  let display: string;

  if (!elementDisplay[nodeName]) {
    element = document.createElement(nodeName);
    document.body.appendChild(element);
    display = getComputedStyle(element, '').getPropertyValue('display');
    element.parentNode!.removeChild(element);
    if (display === 'none') {
      display = 'block';
    }

    elementDisplay[nodeName] = display;
  }

  return elementDisplay[nodeName];
}

/**
 * 显示指定元素
 * @returns {JQ}
 */
$.fn.show = function(this: JQ): JQ {
  return this.each(function() {
    if (!isElement(this)) {
      return;
    }

    if (this.style.display === 'none') {
      this.style.display = '';
    }

    if (
      window.getComputedStyle(this, '').getPropertyValue('display') === 'none'
    ) {
      this.style.display = defaultDisplay(this.nodeName);
    }
  });
};
