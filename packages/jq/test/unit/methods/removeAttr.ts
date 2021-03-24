import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.removeAttr()', function () {
  beforeEach(function () {
    $('#test').html(
      '<div id="div" mdui="test" title="hello" label="world" name="mdui"></div>',
    );
  });

  it('.removeAttr(name)', function () {
    const $div = $('#div');

    assert.equal($div.attr('mdui'), 'test');
    const $divResult = $div.removeAttr('mdui');
    assert.deepEqual($divResult, $div);
    assert.isUndefined($div.attr('mdui'));

    assert.equal($div.attr('title'), 'hello');
    $div.removeAttr('title');
    assert.isUndefined($div.attr('title'));
  });

  it('.removeAttr(names)', function () {
    const $div = $('#div');

    $div.removeAttr('mdui title   name');
    assert.isUndefined($div.attr('mdui'));
    assert.isUndefined($div.attr('title'));
    assert.isUndefined($div.attr('name'));
    assert.equal($div.attr('label'), 'world');
  });
});
