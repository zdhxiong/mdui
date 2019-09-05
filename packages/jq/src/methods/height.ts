import JQElement from '../types/JQElement';
import './width';

declare module '../JQ' {
  interface JQ<T = JQElement> {
    /**
     * 设置对象中所有元素的高度。参数是数字或数字字符串时，自动添加 px 作为单位
     * @param value
     * @example
     ```js
     $('.box').height('20%')
     ```
     @example
     ```js
     $('.box').height(10);
     ```
     */
    height(value: string | number): this;

    /**
     * 获取第一个元素的高度
     * @example
     ```js
     $('.box').height();
     ```
     */
    height(): number;
  }
}
