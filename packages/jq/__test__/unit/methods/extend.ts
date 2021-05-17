import { assert } from '@open-wc/testing';
import { JQ } from '../../../shared/core';
import $ from '../../jq_or_jquery';

describe('.extend()', function () {
  beforeEach(function () {
    $('#test').html(`
<div class="test1"></div>
<div class="test2"></div>
    `);
  });

  it('.extend(object): JQ', function () {
    $.fn.extend({
      testFunc1: function (this: JQ) {
        this.addClass('class1');
      },
      testFunc2: function (this: JQ) {
        this.addClass('class2');
      },
    });

    // @ts-ignore
    $('.test1').testFunc1();
    // @ts-ignore
    $('.test2').testFunc2();

    assert.isTrue($('.test1').hasClass('class1'));
    assert.isTrue($('.test2').hasClass('class2'));
  });
});
