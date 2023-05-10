import {
  sourceColorFromImage,
  hexFromArgb,
} from '@material/material-color-utilities';

/**
 * 根据指定的图片，获取主题的十六进制颜色值
 * @param image `<img>` 元素
 * @return string 十六进制颜色值。例如：`#ff0000`
 */
export const getColorFromImage = async (
  image: HTMLImageElement,
): Promise<string> => {
  const source = await sourceColorFromImage(image);
  return hexFromArgb(source);
};
