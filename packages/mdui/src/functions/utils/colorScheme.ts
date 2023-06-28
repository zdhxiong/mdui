import {
  blueFromArgb,
  greenFromArgb,
  redFromArgb,
  customColor,
  argbFromHex,
  Scheme,
  CorePalette,
} from '@material/material-color-utilities';
import { getDocument } from 'ssr-window';
import { $ } from '@mdui/jq/$.js';
import '@mdui/jq/methods/addClass.js';
import '@mdui/jq/methods/append.js';
import '@mdui/jq/methods/remove.js';
import '@mdui/jq/methods/removeClass.js';
import { toKebabCase } from '@mdui/jq/shared/helper.js';

export interface CustomColor {
  /**
   * 自定义颜色名
   */
  name: string;

  /**
   * 自定义十六进制颜色值，如 `#f82506`
   */
  value: string;
}

type Theme = 'light' | 'dark';

const themeArr: Theme[] = ['light', 'dark'];
let themeIndex = 0;

const rgbFromArgb = (source: number): string => {
  const red = redFromArgb(source);
  const green = greenFromArgb(source);
  const blue = blueFromArgb(source);

  return [red, green, blue].join(', ');
};

/**
 * 设置主题
 * 在 head 中插入一个 <style id="mdui-custom-theme-${source}-${index}"> 元素，
 * 并在 target 元素上添加 class="mdui-custom-theme-${source}-${index}"
 *
 * 自定义颜色的 css 变量
 * --mdui-color-red
 * --mdui-color-on-red
 * --mdui-color-red-container
 * --mdui-color-on-red-container
 *
 * @param source
 * @param options
 */
export const setThemeFromSource = (
  source: number,
  options?: {
    target?: HTMLElement;
    customColors?: CustomColor[];
  },
): void => {
  const document = getDocument();
  const target = options?.target || document.body;
  const $target = $(target);

  // 生成配色方案
  const schemes: Record<Theme, Record<string, number>> = {
    light: Scheme.light(source).toJSON(),
    dark: Scheme.dark(source).toJSON(),
  };

  // todo 目前 @material/material-color-utilities 库缺失了 8 种颜色，等官方库加上后，可以删除这段代码
  // https://github.com/material-foundation/material-color-utilities/issues/98
  const palette = CorePalette.of(source);
  Object.assign(schemes.light, {
    'surface-dim': palette.n1.tone(87),
    'surface-bright': palette.n1.tone(98),
    'surface-container-lowest': palette.n1.tone(100),
    'surface-container-low': palette.n1.tone(96),
    'surface-container': palette.n1.tone(94),
    'surface-container-high': palette.n1.tone(92),
    'surface-container-highest': palette.n1.tone(90),
    'surface-tint-color': schemes.light.primary,
  });
  Object.assign(schemes.dark, {
    'surface-dim': palette.n1.tone(6),
    'surface-bright': palette.n1.tone(24),
    'surface-container-lowest': palette.n1.tone(4),
    'surface-container-low': palette.n1.tone(10),
    'surface-container': palette.n1.tone(12),
    'surface-container-high': palette.n1.tone(17),
    'surface-container-highest': palette.n1.tone(22),
    'surface-tint-color': schemes.dark.primary,
  });

  // 扩充自定义颜色
  (options?.customColors || []).map((color) => {
    const name = toKebabCase(color.name);
    const custom = customColor(source, {
      name,
      value: argbFromHex(color.value),
      blend: true,
    });

    themeArr.forEach((theme) => {
      schemes[theme][name] = custom[theme].color;
      schemes[theme][`on-${name}`] = custom[theme].onColor;
      schemes[theme][`${name}-container`] = custom[theme].colorContainer;
      schemes[theme][`on-${name}-container`] = custom[theme].onColorContainer;
    });
  });

  // 根据配色方案生成 css 变量
  const colorVar = (
    theme: Theme,
    callback: (token: string, rgb: string) => string,
  ) => {
    return Object.entries(schemes[theme])
      .map(([key, value]) => callback(toKebabCase(key), rgbFromArgb(value)))
      .join('');
  };

  const className = `mdui-custom-theme-${source}-${themeIndex++}`;

  // CSS 文本
  const cssText = `.${className} {
  ${colorVar('light', (token, rgb) => `--mdui-color-${token}-light: ${rgb};`)}
  ${colorVar('dark', (token, rgb) => `--mdui-color-${token}-dark: ${rgb};`)}
  ${colorVar(
    'light',
    (token) => `--mdui-color-${token}: var(--mdui-color-${token}-light);`,
  )}

  color: rgb(var(--mdui-color-on-background));
  background-color: rgb(var(--mdui-color-background));
}

.mdui-theme-dark .${className},
.mdui-theme-dark.${className} {
  ${colorVar(
    'dark',
    (token) => `--mdui-color-${token}: var(--mdui-color-${token}-dark);`,
  )}
}

@media (prefers-color-scheme: dark) {
  .mdui-theme-auto .${className},
  .mdui-theme-auto.${className} {
    ${colorVar(
      'dark',
      (token) => `--mdui-color-${token}: var(--mdui-color-${token}-dark);`,
    )}
  }
}`;

  // 创建 <style> 元素，添加到 head 中
  $(document.head).append(`<style id="${className}">${cssText}</style>`);

  // 移除旧的主题
  Array.from(target.classList)
    .filter((name) => name.startsWith('mdui-custom-theme-'))
    .forEach((name) => {
      $target.removeClass(name);
      $(`#${name}`).remove();
    });

  // 添加新主题
  $target.addClass(className);
};
