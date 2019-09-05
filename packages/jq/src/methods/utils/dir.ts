import JQSelector from '../../types/JQSelector';
import { isElement } from '../../utils';
import { JQ } from '../../JQ';
import $ from '../../$';
import unique from '../../functions/unique';
import '../each';
import '../is';

export default function dir(
  $elements: JQ,
  selector: JQSelector,
  nameIndex: number,
  node: 'parentNode' | 'nextElementSibling' | 'previousElementSibling',
): JQ {
  const ret: Node[] = [];
  let target;

  $elements.each((_, element) => {
    if (!isElement(element)) {
      return;
    }

    target = element[node];
    while (target) {
      if (nameIndex === 2) {
        // prevUntil, nextUntil, parentsUntil
        if (!selector || $(target).is(selector)) {
          break;
        }

        ret.push(target);
      } else if (nameIndex === 0) {
        // prev, next, parent
        if (!selector || $(target).is(selector)) {
          ret.push(target);
        }

        break;
      } else {
        // prevAll, nextAll, parents
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
