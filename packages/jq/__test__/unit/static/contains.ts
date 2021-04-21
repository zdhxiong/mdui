import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('$.contains', function () {
  beforeEach(function () {
    $('#test').html(`
<div id="child">
  <span></span>
</div>
    `);
  });

  it('$.contains(parent, child)', function () {
    assert.isTrue($.contains(document.documentElement, document.body));
    assert.isTrue($.contains(document, document.body));
    assert.isFalse($.contains(document.body, document.documentElement));
    assert.isFalse($.contains(document.body, document));
    assert.isFalse(
      $.contains(document.getElementById('test'), document.documentElement),
    );
    assert.isTrue(
      $.contains(document.documentElement, document.getElementById('test')),
    );
    assert.isTrue(
      $.contains(
        document.getElementById('test'),
        document.getElementById('child'),
      ),
    );
    assert.isFalse(
      $.contains(
        document.getElementById('child'),
        document.getElementById('test'),
      ),
    );
  });
});
