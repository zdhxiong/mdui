/**
 * 是否是 IE 浏览器
 * @deprecated
 */
const isIE = (): boolean => {
  // @ts-ignore
  return !!window.document.documentMode;
};

export { isIE };
