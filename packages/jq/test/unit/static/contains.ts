import $ from '../../jq_or_jquery';
import { JQ } from '../../../src/JQ';

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
    // jquery 中，元素为 null 会报错，JQ 中返回 false
    if ($ instanceof JQ) {
      chai.assert.isFalse(
        $.contains(
          document.getElementById('notfound'),
          document.getElementById('child'),
        ),
      );
      chai.assert.isFalse(
        $.contains(
          document.getElementById('test'),
          document.getElementById('notfound'),
        ),
      );
    }
  });
});
