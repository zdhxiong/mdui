/**
 * 断点相关的 js 函数
 * 这些函数直接导出到 mdui 全局对象下，供应用使用。框架内部使用时，为避免循环依赖，从 @mdui/shared 包内导入
 */
import { getDocument, getWindow } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/css.js';
import '@mdui/jq/methods/innerWidth.js';
import { isElement, isNumber } from '@mdui/jq/shared/helper.js';

export type Breakpoint =
  | 'handset'
  | 'small-tablet'
  | 'large-tablet'
  | 'desktop';

/**
 * 获取断点
 *
 * * 未传入参数时，获取的是 window 的宽度对应的断点
 * * 若传入数值，则获取的是该数值宽度对应的断点
 * * 若传入 HTML 元素，则获取的是该元素的宽度对应的断点
 *
 * 返回值的取值为：
 * * `handset`：手机
 * * `small-tablet`：小平板
 * * `large-tablet`：大平板
 * * `desktop`：桌面电脑
 */
export const getBreakpoint = (width?: number | HTMLElement): Breakpoint => {
  const window = getWindow();
  const document = getDocument();

  // 根元素参考值
  const baseFontSize = parseFloat($('html').css('font-size'));

  // 容器的宽度
  const containerWidth = isElement(width)
    ? $(width).innerWidth()
    : isNumber(width)
    ? width
    : $(window).innerWidth();

  // 断点对应的宽度值
  const getBreakpointValue = (breakpoint: Breakpoint): number => {
    const width = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(`--mdui-breakpoint-${breakpoint}`)
      .toLowerCase();

    return width.endsWith('rem')
      ? parseFloat(width) * baseFontSize
      : parseFloat(width);
  };

  if (containerWidth < getBreakpointValue('handset')) {
    return 'handset';
  }
  if (containerWidth < getBreakpointValue('small-tablet')) {
    return 'small-tablet';
  }
  if (containerWidth < getBreakpointValue('large-tablet')) {
    return 'large-tablet';
  }
  return 'desktop';
};
