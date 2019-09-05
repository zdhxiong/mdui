import JQSelector from './types/JQSelector';
import { JQStatic } from './interfaces/JQStatic';
import { isFunction, isWindow, isString } from './utils';
import { JQ } from './JQ';
import each from './functions/each';

function get$(): JQStatic {
  const $ = function(selector?: JQSelector | Function) {
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
          () => {
            selector.call(document, $);
          },
          false,
        );
      }

      return new JQ([document]);
    }

    // Node
    if (selector instanceof Node || isWindow(selector)) {
      return new JQ([selector]);
    }

    // NodeList
    if (selector instanceof NodeList) {
      return new JQ(selector);
    }

    // String
    if (isString(selector)) {
      const html = selector.trim();

      // 根据 HTML 字符串创建 JQ 对象
      if (html[0] === '<' && html[html.length - 1] === '>') {
        let toCreate = 'div';

        const tags = {
          li: 'ul',
          tr: 'tbody',
          td: 'tr',
          th: 'tr',
          tbody: 'table',
          option: 'select',
        };

        each(tags, (childTag, parentTag) => {
          if (html.indexOf(`<${childTag}`) === 0) {
            toCreate = parentTag;
            return false;
          }

          return;
        });

        const tempParent = document.createElement(toCreate);
        tempParent.innerHTML = html;

        return new JQ(tempParent.childNodes);
      }

      // 根据 CSS 选择器创建 JQ 对象
      const elements =
        selector[0] === '#' && !selector.match(/[ .<>:~]/)
          ? [document.getElementById(selector.slice(1))]
          : document.querySelectorAll(selector);

      if (elements) {
        return new JQ(elements);
      }
    }

    return new JQ();
  } as JQStatic;

  $.fn = JQ.prototype;

  return $;
}

const $ = get$();

export default $;
