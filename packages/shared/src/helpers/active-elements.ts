import { getNodeName } from '@mdui/jq/shared/helper.js';

/**
 * https://github.com/shoelace-style/shoelace/blob/next/src/internal/active-elements.ts
 *
 * Use a generator so we can iterate and possibly break early.
 * 按层级从外到内获取所有活跃元素
 * @example
 *   // to operate like a regular array. This kinda nullifies generator benefits, but worth knowing if you need the whole array.
 *   const allActiveElements = [...activeElements()]
 *
 *   // Early return
 *   for (const activeElement of activeElements()) {
 *     if (<cond>) {
 *       break; // Break the loop, dont need to iterate over the whole array or store an array in memory!
 *     }
 *   }
 */
export function* activeElements(
  activeElement: Element | null = document.activeElement,
): Generator<Element> {
  if (activeElement === null || activeElement === undefined) return;

  yield activeElement;

  if (
    'shadowRoot' in activeElement &&
    activeElement.shadowRoot &&
    activeElement.shadowRoot.mode !== 'closed' &&
    // 如果是 mdui 组件，可直接在组件上聚焦，无需遍历组件内部
    !getNodeName(activeElement).startsWith('mdui-')
  ) {
    yield* activeElements(activeElement.shadowRoot.activeElement);
  }
}

/**
 * 获取最深层的活跃元素
 */
export function getDeepestActiveElement(): Element | undefined {
  return [...activeElements()].pop();
}
