import $ from '../../jq_or_jquery';

describe('.extend()', function() {
  beforeEach(function() {
    $('#test').html(`
<div class="test1"></div>
<div class="test2"></div>
    `);
  });

  it('.extend(object): JQ', function() {
    $.fn.extend({
      testFunc1: function() {
        this.addClass('class1');
      },
      testFunc2: function() {
        this.addClass('class2');
      },
    });

    // @ts-ignore
    $('.test1').testFunc1();
    // @ts-ignore
    $('.test2').testFunc2();

    chai.assert.isTrue($('.test1').hasClass('class1'));
    chai.assert.isTrue($('.test2').hasClass('class2'));
  });
});
