import JQ from '../../JQ';
import $ from '../../$';
import unique from '../../functions/unique';
import '../each';
import '../is';

export default function dir(nodes, selector, nameIndex, node) {
  const ret = [];
  let elem;

  nodes.each((j, _this) => {
    elem = _this[node];
    while (elem) {
      if (nameIndex === 2) {
        // prevUntil
        if (!selector || (selector && $(elem).is(selector))) {
          break;
        }

        ret.push(elem);
      } else if (nameIndex === 0) {
        // prev
        if (!selector || (selector && $(elem).is(selector))) {
          ret.push(elem);
        }

        break;
      } else if (!selector || (selector && $(elem).is(selector))) {
        // prevAll
        ret.push(elem);
      }

      elem = elem[node];
    }
  });

  return new JQ(unique(ret));
}
