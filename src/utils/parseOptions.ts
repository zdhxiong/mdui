import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/attr';

/**
 * 解析 DATA API 参数
 * @param element 元素
 * @param name 属性名
 */
function parseOptions(element: HTMLElement, name: string): object {
  const attr = $(element).attr(name);

  if (!attr) {
    return {};
  }

  return JSON.parse(attr);
}

export { parseOptions };
