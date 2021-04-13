import {
  PlainObject,
  TypeOrArray,
  JQ,
  JQStatic,
  isFunction,
  isNode,
  isString,
  isArrayLike,
  eachObject,
} from './shared/core.js';
import { getChildNodesArray } from './shared/dom.js';

const get$ = (): JQStatic => {
  const $ = function (
    selector?:
      | string
      | TypeOrArray<Element>
      | null
      | JQ
      | PlainObject
      | Function,
  ) {
    if (!selector) {
      return new JQ();
    }

    // JQ
    if (selector instanceof JQ) {
      return selector;
    }

    // function
    if (isFunction(selector)) {
      if (
        /complete|loaded|interactive/.test(document.readyState) &&
        document.body
      ) {
        selector.call(document, $);
      } else {
        document.addEventListener(
          'DOMContentLoaded',
          () => selector.call(document, $),
          false,
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

const $ = get$();

export default $;
