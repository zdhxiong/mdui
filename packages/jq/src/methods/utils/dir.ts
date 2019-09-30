import $ from '../../$';
import unique from '../../functions/unique';
import { JQ } from '../../JQ';
import { isElement } from '../../utils';
import '../each';
import '../is';

export default function dir(
  $elements: JQ,
  nameIndex: number,
  node: 'parentNode' | 'nextElementSibling' | 'previousElementSibling',
  selector?: any,
  filter?: string,
): JQ {
  const ret: Element[] = [];
  let target;

  $elements.each((_, element) => {
    target = element[node];

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

      // @ts-ignore
      target = target[node];
    }
  });

  return new JQ(unique(ret));
}
