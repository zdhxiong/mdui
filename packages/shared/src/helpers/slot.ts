/**
 * 获取一个 slot 中的所有内容
 * @param slot
 */
export const getInnerHtmlFromSlot = (slot: HTMLSlotElement): string => {
  const nodes = slot.assignedNodes({ flatten: true });
  let html = '';

  [...nodes].forEach((node) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      html += (node as HTMLElement).outerHTML;
    }

    if (node.nodeType === Node.TEXT_NODE) {
      html += node.textContent;
    }
  });

  return html;
};

/**
 * 获取一个 slot 中的所有文本内容
 * @param slot
 */
export const getTextContentFromSlot = (slot: HTMLSlotElement): string => {
  const nodes = slot.assignedNodes({ flatten: true });
  let text = '';

  [...nodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  });

  return text;
};
