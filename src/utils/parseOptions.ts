import $ from 'mdui.jq/es/$';
import 'mdui.jq/es/methods/attr';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';

/**
 * 解析 DATA API 参数
 * @param element 元素
 * @param name 属性名
 */
function parseOptions(element: HTMLElement, name: string): PlainObject {
  const attr = $(element).attr(name);

  if (!attr) {
    return {};
  }

  return new Function(
    '',
    `var json = ${attr}; return JSON.parse(JSON.stringify(json));`,
  )();
}

export { parseOptions };
