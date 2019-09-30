import { JQ } from '../src/JQ';

function toTagNameArray($elements: JQ): string[] {
  return $elements.get().map(e => e.tagName.toLowerCase());
}

function toClassNameArray($elements: JQ): string[] {
  return $elements.get().map(e => e.className.toLowerCase());
}

function toInnerTextArray($elements: JQ): string[] {
  return $elements.get().map(e => e.innerText);
}

function toInnerHtmlArray($elements: JQ): string[] {
  return $elements.get().map(e => e.innerHTML);
}

function toIdArray($elements: JQ): string[] {
  return $elements.get().map(e => e.getAttribute('id') || '');
}

function removeSpace(text: string): string {
  return text.replace(/\ +/g, '').replace(/[\r\n]/g, '');
}

export {
  toTagNameArray,
  toClassNameArray,
  toInnerTextArray,
  toInnerHtmlArray,
  toIdArray,
  removeSpace,
};
