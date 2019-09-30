import './width';

declare module '../JQ' {
  interface JQ<T = HTMLElement> {
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
    height(
      value:
        | string
        | number
        | null
        | undefined
        | ((
            this: T,
            index: number,
            oldValue: number,
          ) => string | number | null | undefined | void),
    ): this;

    /**
     * 获取第一个元素的高度（像素值），不包含 padding, border, margin 的宽度
     * @example
     ```js
     $('.box').height();
     ```
     */
    height(): number;
  }
}
