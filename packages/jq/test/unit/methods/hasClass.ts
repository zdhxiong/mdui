import $ from '../../jq_or_jquery';

describe('.hasClass()', function() {
  beforeEach(function() {
    $('#test').html('<div class="mdui mdui2">Goodbye</div>');
  });

  it('.hasClass(string): boolean', function() {
    const $div = $('#test div');
    chai.assert.isTrue($div.hasClass('mdui'));
    chai.assert.isFalse($div.hasClass('test'));
  });
});
