import $ from '../$';
import { isString } from '../utils';
import each from '../functions/each';
import './get';
import './each';

/**
 * append - 在元素内部追加内容
 * @param newChild {String|Node|NodeList|JQ}
 * @return {JQ}
 */
/**
 * prepend - 在元素内部前置内容
 * @param newChild {String|Node|NodeList|JQ}
 * @return {JQ}
 */
each(['append', 'prepend'], (nameIndex, name) => {
  $.fn[name] = function (newChild) {
    let newChilds;
    const copyByClone = this.length > 1;

    if (isString(newChild) && (newChild[0] !== '<' || newChild[newChild.length - 1] !== '>')) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;
      newChilds = [].slice.call(tempDiv.childNodes);
    } else {
      newChilds = $(newChild).get();
    }

    if (nameIndex === 1) {
      // prepend
      newChilds.reverse();
    }

    return this.each((i, _this) => {
      each(newChilds, (j, child) => {
        // 一个元素要同时追加到多个元素中，需要先复制一份，然后追加
        if (copyByClone && i > 0) {
          child = child.cloneNode(true);
        }

        if (nameIndex === 0) {
          // append
          _this.appendChild(child);
        } else {
          // prepend
          _this.insertBefore(child, _this.childNodes[0]);
        }
      });
    });
  };
});
