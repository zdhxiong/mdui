import { $ } from '../../$.js';
import { unique } from '../../functions/unique.js';
import { JQ } from '../../shared/core.js';
import { isElement } from '../../shared/helper.js';
import '../each.js';
import '../is.js';

export const dir = (
  $elements: JQ,
  nameIndex: number,
  node: 'parentNode' | 'nextElementSibling' | 'previousElementSibling',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selector?: any,
  filter?: string,
): JQ => {
  const ret: HTMLElement[] = [];
  let target: HTMLElement;

  $elements.each((_, element) => {
    target = element[node] as HTMLElement;

    // 不能包含最顶层的 document 元素
    while (target && isElement(target)) {
      // prevUntil, nextUntil, parentsUntil
      if (nameIndex === 2) {
        if (selector && $(target).is(selector)) {
          break;
        }

        if (!filter || $(target).is(filter)) {
          ret.push(target);
        }
      }

      // prev, next, parent
      else if (nameIndex === 0) {
        if (!selector || $(target).is(selector)) {
          ret.push(target);
        }

        break;
      }

      // prevAll, nextAll, parents
      else {
        if (!selector || $(target).is(selector)) {
          ret.push(target);
        }
      }

      target = target[node] as HTMLElement;
    }
  });

  return new JQ(unique(ret));
};
