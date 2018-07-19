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

      if (html.indexOf('<li') === 0) {
        toCreate = 'ul';
      }

      if (html.indexOf('<tr') === 0) {
        toCreate = 'tbody';
      }

      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) {
        toCreate = 'tr';
      }

      if (html.indexOf('<tbody') === 0) {
        toCreate = 'table';
      }

      if (html.indexOf('<option') === 0) {
        toCreate = 'select';
      }

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
  } else if (typeof selector === 'function') {
    // function
    return $(document).ready(selector);
  } else if (selector.nodeType || selector === window || selector === document) {
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
