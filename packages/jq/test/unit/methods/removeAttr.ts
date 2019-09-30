import $ from '../../jq_or_jquery';

describe('.removeAttr()', function() {
  beforeEach(function() {
    $('#test').html(
      '<div id="div" mdui="test" title="hello" label="world" name="mdui"></div>',
    );
  });

  it('.removeAttr(name)', function() {
    const $div = $('#div');

    chai.assert.equal($div.attr('mdui'), 'test');
    const $divResult = $div.removeAttr('mdui');
    chai.assert.deepEqual($divResult, $div);
    chai.assert.isUndefined($div.attr('mdui'));

    chai.assert.equal($div.attr('title'), 'hello');
    $div.removeAttr('title');
    chai.assert.isUndefined($div.attr('title'));
  });

  it('.removeAttr(names)', function() {
    const $div = $('#div');

    $div.removeAttr('mdui title   name');
    chai.assert.isUndefined($div.attr('mdui'));
    chai.assert.isUndefined($div.attr('title'));
    chai.assert.isUndefined($div.attr('name'));
    chai.assert.equal($div.attr('label'), 'world');
  });
});
