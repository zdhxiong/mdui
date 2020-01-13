import $ from '../../jq_or_jquery';

describe('$.contains', function() {
  beforeEach(function() {
    $('#test').html(`
<div id="child">
  <span></span>
</div>
    `);
  });

  it('$.contains(parent, child)', function() {
    chai.assert.isTrue($.contains(document.documentElement, document.body));
    chai.assert.isTrue($.contains(document, document.body));
    chai.assert.isFalse($.contains(document.body, document.documentElement));
    chai.assert.isFalse($.contains(document.body, document));
    chai.assert.isFalse(
      $.contains(document.getElementById('test'), document.documentElement),
    );
    chai.assert.isTrue(
      $.contains(document.documentElement, document.getElementById('test')),
    );
    chai.assert.isTrue(
      $.contains(
        document.getElementById('test'),
        document.getElementById('child'),
      ),
    );
    chai.assert.isFalse(
      $.contains(
        document.getElementById('child'),
        document.getElementById('test'),
      ),
    );
  });
});
