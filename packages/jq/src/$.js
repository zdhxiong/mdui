import JQ from './JQ';

function $(selector) {
  const arr = [];

  if (!selector) {
    return new JQ(arr);
  }

  if (selector instanceof JQ) {
    return selector;
  }

  if (typeof selector === 'string') {
    const html = selector.trim();

    if (html[0] === '<' && html[html.length - 1] === '>') {
      // 创建 HTML 字符串
      let toCreate = 'div';

      const tags = {
        li: 'ul',
        tr: 'tbody',
        td: 'tr',
        th: 'tr',
        tbody: 'table',
        option: 'select',
      };

      Object.keys(tags).forEach((childTag) => {
        const parentTag = tags[childTag];

        if (html.indexOf(`<${childTag}`) === 0) {
          toCreate = parentTag;
        }
      });

      const tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      // 选择器
      const elems = selector[0] === '#' && !selector.match(/[ .<>:~]/)
        ? [document.getElementById(selector.slice(1))]
        : document.querySelectorAll(selector);

      for (let i = 0; i < elems.length; i += 1) {
        if (elems[i]) {
          arr.push(elems[i]);
        }
      }
    }

    return new JQ(arr);
  }

  if (typeof selector === 'function') {
    // function
    return $(document).ready(selector);
  }

  if (selector.nodeType || selector === window || selector === document) {
    // Node
    arr.push(selector);
  } else if (selector.length > 0 && selector[0].nodeType) {
    // NodeList
    for (let i = 0; i < selector.length; i += 1) {
      arr.push(selector[i]);
    }
  }

  return new JQ(arr);
}

$.fn = JQ.prototype;

export default $;
