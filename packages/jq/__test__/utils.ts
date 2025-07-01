import { assert } from '@open-wc/testing';
import jQuery from 'jquery';
import { $ as jq } from '../$.js';
import { JQStatic, JQ } from '../shared/core.js';

export { jQuery, jq, assert, JQStatic, JQ };

export const toTagNameArray = ($elements: JQ): string[] => {
  return Array.from($elements).map((e) => e.tagName.toLowerCase());
};

export const toClassNameArray = ($elements: JQ): string[] => {
  return Array.from($elements).map((e) => e.className.toLowerCase());
};

export const toTextContentArray = ($elements: JQ): string[] => {
  return Array.from($elements).map((e) => e.textContent!);
};

export const toInnerHtmlArray = ($elements: JQ): string[] => {
  return Array.from($elements).map((e) => e.innerHTML);
};

export const toIdArray = ($elements: JQ): string[] => {
  return Array.from($elements).map((e) => e.getAttribute('id') || '');
};

export const selectorToArray = (selector: string): Element[] => {
  const nodeList = document.querySelectorAll(selector);

  return Array.from(nodeList);
};

export const removeSpace = (text: string): string => {
  return text.replace(/ +/g, '').replace(/[\r\n]/g, '');
};
