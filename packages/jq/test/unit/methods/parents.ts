import $ from '../../jq_or_jquery';
import { toIdArray } from '../../utils';

describe('.parents()', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child1" class="child1 parent">
  <div id="child1-1" class="child2 parent">
    <div id="child1-1-1" class="child3"></div>
    <div id="child1-1-2" class="child3"></div>
  </div>
  <div id="child1-2" class="child2"></div>
</div>
<div id="child2" class="child1 parent">
  <div id="child2-1" class="child2 parent">
    <div id="child2-1-1" class="child3"></div>
    <div id="child2-1-2" class="child3"></div>
  </div>
  <div id="child2-2" class="child2"></div>
</div>
    `);
  });

  it('.parents(selector)', function() {
    let $parents = $('#child1-1-2').parents();

    // jquery 把最顶层的 document 也包含；mdui.jq 不包含
    chai.assert.isTrue($parents.eq(0).is('#child1-1'));
    chai.assert.isTrue($parents.eq(1).is('#child1'));
    chai.assert.isTrue($parents.eq(2).is('#test'));
    chai.assert.isTrue($parents.eq(3).is('body'));
    chai.assert.isTrue($parents.eq(4).is('html'));

    $parents = $('#child1-1-1').parents('#child1');
    chai.assert.sameOrderedMembers(toIdArray($parents), ['child1']);

    $parents = $('#child1-1-1').parents('.parent');
    chai.assert.sameOrderedMembers(toIdArray($parents), ['child1-1', 'child1']);

    // 顺序和 jquery 不同
    $parents = $('.child3').parents();
    chai.assert.lengthOf($parents, 7);

    $parents = $('.child3').parents('.parent');
    chai.assert.sameOrderedMembers(toIdArray($parents), [
      'child2-1',
      'child2',
      'child1-1',
      'child1',
    ]);

    $parents = $('.child3').parents('.child1');
    chai.assert.sameOrderedMembers(toIdArray($parents), ['child2', 'child1']);
  });
});
