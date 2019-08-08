import $ from '../$';
import each from '../functions/each';
import './each';

/**
 * addClass - 添加 CSS 类，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
/**
 * removeClass - 移除 CSS 类，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
/**
 * toggleClass - 切换 CSS 类名，多个类名用空格分割
 * @param className {String}
 * @return {JQ}
 */
each(['add', 'remove', 'toggle'], (nameIndex, name) => {
  $.fn[`${name}Class`] = function (className) {
    if (!className) {
      return this;
    }

    const classes = className.split(' ');

    return this.each((i, elem) => {
      each(classes, (j, cls) => {
        elem.classList[name](cls);
      });
    });
  };
});
