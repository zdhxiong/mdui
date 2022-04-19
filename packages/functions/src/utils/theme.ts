import {
  blueFromArgb,
  greenFromArgb,
  redFromArgb,
  customColor,
  argbFromHex,
  hexFromArgb,
  Scheme,
} from '@material/material-color-utilities';
import { toKebabCase } from '@mdui/jq/shared/helper.js';

export interface CustomColor {
  /**
   * 自定义颜色名
   */
  name: string;

  /**
   * 自定义颜色值，如 #f82506
   */
  value: string;
}

type Theme = 'light' | 'dark';

let themeIndex = 0;

const rgbFromArgb = (source: number): string => {
  const red = redFromArgb(source);
  const green = greenFromArgb(source);
  const blue = blueFromArgb(source);

  return `${red}, ${green}, ${blue}`;
};

/**
 * 设置主题
 * 在 head 中插入一个 <style id="mdui-custom-theme-${source}-${index}"> 元素，
 * 并在 target 元素上添加 class="mdui-custom-theme-${source}-${index}"
 *
 * 自定义颜色的 css 变量
 * --mdui-custom-color-red-content
 * --mdui-custom-color-red-on-content
 * --mdui-custom-color-red-container
 * --mdui-custom-color-red-on-container
 *
 * 自定义颜色的 css class
 * mdui-custom-color-red-content
 * mdui-custom-color-red-container
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
  const target = options?.target || document.body;
  const customColors = (options?.customColors || []).map((color) => {
    const custom = customColor(source, {
      name: color.name,
      value: argbFromHex(color.value),
      blend: true,
    });
    return {
      name: custom.color.name,
      light: custom.light,
      dark: custom.dark,
    };
  });
  const schemes = {
    light: Scheme.light(source),
    dark: Scheme.dark(source),
  };

  const getThemeVariables = (
    theme: Theme,
    callback: (token: string, rgb: string) => string,
  ): string => {
    return (
      Object.entries(schemes[theme].toJSON())
        .map(([key, value]) => {
          const token = toKebabCase(key);
          const rgb = rgbFromArgb(value);
          return callback(token, rgb);
        })
        .join(';') + ';'
    );
  };

  const getCustomColorVariables = (theme: Theme): string => {
    return (
      customColors
        .map(
          (custom) =>
            `--mdui-custom-color-${custom.name}-content: ${hexFromArgb(
              custom[theme].color,
            )};
            --mdui-custom-color-${custom.name}-on-content: ${hexFromArgb(
              custom[theme].onColor,
            )};
            --mdui-custom-color-${custom.name}-container: ${hexFromArgb(
              custom[theme].colorContainer,
            )};
            --mdui-custom-color-${custom.name}-on-container: ${hexFromArgb(
              custom[theme].onColorContainer,
            )}`,
        )
        .join(';') + (customColors.length ? ';' : '')
    );
  };

  const getCustomColorClassArray = (): string[][] => {
    return customColors.map((custom) => [
      `.mdui-custom-color-${custom.name}-content {
          background-color: var(--mdui-custom-color-${custom.name}-content);
          color: var(--mdui-custom-color-${custom.name}-on-content);
        }`,
      `.mdui-custom-color-${custom.name}-container {
          background-color: var(--mdui-custom-color-${custom.name}-container);
          color: var(--mdui-custom-color-${custom.name}-on-container);
        }`,
    ]);
  };

  const colorAndBackgroundColor = `color: rgb(var(--mdui-sys-color-on-background));
    background-color: rgb(var(--mdui-sys-color-background));`;
  const className = `mdui-custom-theme-${source}-${themeIndex++}`;

  // CSS 文本
  const cssText = `.${className} {
  ${getThemeVariables(
    'light',
    (token, rgb) => `--mdui-sys-color-${token}-light: ${rgb}`,
  )}
  ${getThemeVariables(
    'dark',
    (token, rgb) => `--mdui-sys-color-${token}-dark: ${rgb}`,
  )}
  ${getThemeVariables(
    'light',
    (token) =>
      `--mdui-sys-color-${token}: var(--mdui-sys-color-${token}-light)`,
  )}
  ${colorAndBackgroundColor}
  ${getCustomColorVariables('light')}
}

${getCustomColorClassArray()
  .map((group) => group.map((c) => `.${className} ${c}`))
  .flat()
  .join('')}

.mdui-theme-dark .${className},
.mdui-theme-dark.${className} {
  ${getThemeVariables(
    'dark',
    (token) => `--mdui-sys-color-${token}: var(--mdui-sys-color-${token}-dark)`,
  )}
  ${getCustomColorVariables('dark')}
}

@media (prefers-color-scheme: dark) {
  .mdui-theme-auto .${className},
  .mdui-theme-auto.${className} {
    ${getThemeVariables(
      'dark',
      (token) =>
        `--mdui-sys-color-${token}: var(--mdui-sys-color-${token}-dark)`,
    )}
    ${getCustomColorVariables('dark')}
  }
}`;

  // 创建 <style> 元素，添加到 head 中
  const styleElement = document.createElement('style');
  styleElement.id = className;
  styleElement.textContent = cssText;
  document.head.appendChild(styleElement);

  // 移除旧的主题
  target.classList.forEach((name) => {
    if (name.startsWith('mdui-custom-theme-')) {
      target.classList.remove(name);
      document.getElementById(name)?.remove();
    }
  });

  // 添加新主题
  target.classList.add(className);
};
