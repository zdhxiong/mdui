import { getDocument } from 'ssr-window';
import { JQ } from './shared/core.js';
import { getChildNodesArray, isDomReady } from './shared/dom.js';
import {
  isFunction,
  isNode,
  isString,
  isArrayLike,
  eachObject,
} from './shared/helper.js';
import type { JQStatic } from './shared/core.js';

const get$ = (): JQStatic => {
  const $ = function (selector?: unknown) {
    if (!selector) {
      return new JQ();
    }

    // JQ
    if (selector instanceof JQ) {
      return selector;
    }

    // function
    if (isFunction(selector)) {
      const document = getDocument();

      if (isDomReady(document)) {
        selector.call(document, $);
      } else {
        document.addEventListener(
          'DOMContentLoaded',
          () => selector.call(document, $),
          { once: true },
        );
      }

      return new JQ([document]);
    }

    // String
    if (isString(selector)) {
      const html = selector.trim();

      // 根据 HTML 字符串创建 JQ 对象
      if (html.startsWith('<') && html.endsWith('>')) {
        let toCreate = 'div';

        const tags = {
          li: 'ul',
          tr: 'tbody',
          td: 'tr',
          th: 'tr',
          tbody: 'table',
          option: 'select',
        };

        eachObject(tags, (childTag, parentTag) => {
          if (html.startsWith(`<${childTag}`)) {
            toCreate = parentTag;
            return false;
          }

          return;
        });

        return new JQ(getChildNodesArray(html, toCreate));
      }

      const document = getDocument();

      // 根据 CSS 选择器创建 JQ 对象
      return new JQ(document.querySelectorAll(selector));
    }

    if (isArrayLike(selector) && !isNode(selector)) {
      return new JQ(selector);
    }

    return new JQ([selector]);
  } as JQStatic;

  $.fn = JQ.prototype;

  return $;
};

export const $ = get$();
