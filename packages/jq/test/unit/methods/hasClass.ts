import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.hasClass()', function () {
  beforeEach(function () {
    $('#test').html('<div class="mdui mdui2">Goodbye</div>');
  });

  it('.hasClass(string): boolean', function () {
    const $div = $('#test div');
    assert.isTrue($div.hasClass('mdui'));
    assert.isFalse($div.hasClass('test'));
  });
});
