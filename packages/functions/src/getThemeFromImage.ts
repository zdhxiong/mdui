import {
  sourceColorFromImage,
  hexFromArgb,
} from '@importantimport/material-color-utilities';

/**
 * 根据指定的图片，获取主题的色值
 * @param image `<img>` 元素
 */
export const getThemeFromImage = async (
  image: HTMLImageElement,
): Promise<string> => {
  const source = await sourceColorFromImage(image);
  return hexFromArgb(source);
};
