import { getDocument } from 'ssr-window';
import { $ } from '../$.js';
import { getStyle } from '../shared/css.js';
import { createElement, appendChild, removeChild } from '../shared/dom.js';
import './each.js';
import type { JQ } from '../shared/core.js';

declare module '../shared/core.js' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface JQ<T = HTMLElement> {
    /**
     * 显示集合中的所有元素
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
 * 获取元素的初始 display 值，用于 .show() 方法
 * @param nodeName
 */
const defaultDisplay = (nodeName: string): string => {
  const document = getDocument();
  let element: HTMLElement;
  let display: string;

  if (!elementDisplay[nodeName]) {
    element = createElement(nodeName);
    appendChild(document.body, element);
    display = getStyle(element, 'display');
    removeChild(element);
    if (display === 'none') {
      display = 'block';
    }

    elementDisplay[nodeName] = display;
  }

  return elementDisplay[nodeName];
};

/**
 * 显示指定元素
 * @returns {JQ}
 */
$.fn.show = function (this: JQ): JQ {
  return this.each((_, element) => {
    if (element.style.display === 'none') {
      element.style.display = '';
    }

    if (getStyle(element, 'display') === 'none') {
      element.style.display = defaultDisplay(element.nodeName);
    }
  });
};
