import $ from '../../jq_or_jquery';

describe('.removeProp()', function() {
  beforeEach(function() {
    $('#test').html('<input id="checkbox" type="checkbox" checked/>');
  });

  it('.removeProp(name)', function() {
    const $checkbox = $('#checkbox');

    $checkbox.prop('mmmm', 'nnnn');
    chai.assert.equal($checkbox.prop('mmmm'), 'nnnn');
    $checkbox.removeProp('mmmm');
    chai.assert.isUndefined($checkbox.prop('mmmm'));

    // 不能用 removeProp 删除内置属性
    chai.assert.isTrue($checkbox.prop('checked'));
    $checkbox.removeProp('checked');
    chai.assert.isTrue($checkbox.prop('checked'));
  });
});
