import {
  sourceColorFromImage,
  hexFromArgb,
} from '@material/material-color-utilities';
import { $ } from '@mdui/jq/$.js';
import type { JQ } from '@mdui/jq/shared/core.js';

/**
 * 根据指定的图片，提取出主色调的十六进制颜色值
 * @param image `<img>` 元素的 CSS 选择器、或 `<img>` 元素、或 JQ 对象
 * @return string 十六进制颜色值。例如：`#ff0000`
 */
export const getColorFromImage = async (
  image: string | HTMLImageElement | JQ<HTMLImageElement>,
): Promise<string> => {
  const $image = $(image) as JQ<HTMLImageElement>;
  const source = await sourceColorFromImage($image[0]);
  return hexFromArgb(source);
};
