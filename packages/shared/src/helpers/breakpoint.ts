/**
 * 断点相关的 js 函数
 * 这些函数直接导出到 mdui 全局对象下，供应用使用。框架内部使用时，为避免循环依赖，从 @mdui/shared 包内导入
 */
import { getDocument, getWindow } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/innerWidth.js';
import { isElement, isNumber } from '@mdui/jq/shared/helper.js';
import type { JQ } from '@mdui/jq/shared/core.js';

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

/**
 * 获取断点对象，通过返回的对象可用于判断指定宽度、或指定元素的宽度、或当前窗口宽度与各个断点值的关系
 *
 * * 未传入参数时，获取的是 `window` 的宽度对应的断点对象
 * * 若传入数值，则获取的是该数值宽度对应的断点对象
 * * 若传入 CSS 选择器，则获取的是该选择器对应元素的宽度对应的断点对象
 * * 若传入 HTML 元素，则获取的是该元素的宽度对应的断点对象
 * * 若传入 JQ 对象，则获取的是该 JQ 对象中的元素的宽度对应的断点对象
 *
 * 返回的对象包含以下方法：
 *
 * * `up(breakpoint)`：判断当前宽度是否大于指定断点值
 * * `down(breakpoint)`：判断当前宽度是否小于指定断点值
 * * `only(breakpoint)`：判断当前宽度是否在指定断点值内
 * * `not(breakpoint)`：判断当前宽度是否不在指定断点值内
 * * `between(startBreakpoint, endBreakpoint)`：判断当前宽度是否在指定断点值之间
 */
export const breakpoint = (
  width?: number | string | HTMLElement | JQ<HTMLElement>,
) => {
  const window = getWindow();
  const document = getDocument();
  const computedStyle = window.getComputedStyle(document.documentElement);

  // 容器的宽度
  const containerWidth = isElement(width)
    ? $(width).innerWidth()
    : isNumber(width)
      ? width
      : $(window).innerWidth();

  // 断点对应的宽度值
  const getBreakpointValue = (breakpoint: Breakpoint): number => {
    const width = computedStyle
      .getPropertyValue(`--mdui-breakpoint-${breakpoint}`)
      .toLowerCase();

    return parseFloat(width);
  };

  // 获取比指定断点更大的一个断点
  const getNextBreakpoint = (
    breakpoint: Exclude<Breakpoint, 'xxl'>,
  ): Breakpoint => {
    switch (breakpoint) {
      case 'xs':
        return 'sm';
      case 'sm':
        return 'md';
      case 'md':
        return 'lg';
      case 'lg':
        return 'xl';
      case 'xl':
        return 'xxl';
    }
  };

  return {
    /**
     * 当前宽度是否大于指定断点值
     * @param breakpoint
     */
    up(breakpoint: Breakpoint): boolean {
      return containerWidth >= getBreakpointValue(breakpoint);
    },

    /**
     * 当前宽度是否小于指定断点值
     * @param breakpoint
     */
    down(breakpoint: Breakpoint): boolean {
      return containerWidth < getBreakpointValue(breakpoint);
    },

    /**
     * 当前宽度是否在指定断点值内
     * @param breakpoint
     */
    only(breakpoint: Breakpoint): boolean {
      if (breakpoint === 'xxl') {
        return this.up(breakpoint);
      } else {
        return this.up(breakpoint) && this.down(getNextBreakpoint(breakpoint));
      }
    },

    /**
     * 当前宽度是否不在指定断点值内
     * @param breakpoint
     */
    not(breakpoint: Breakpoint): boolean {
      return !this.only(breakpoint);
    },

    /**
     * 当前宽度是否在指定断点值之间
     * @param startBreakpoint
     * @param endBreakpoint
     * @returns
     */
    between(startBreakpoint: Breakpoint, endBreakpoint: Breakpoint): boolean {
      return this.up(startBreakpoint) && this.down(endBreakpoint);
    },
  };
};
