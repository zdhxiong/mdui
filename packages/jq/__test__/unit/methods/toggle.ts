import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.toggle()', function () {
  beforeEach(function () {
    $('#test').html(`
<style>
.show {
  display: block;
}
.show-important {
  display: block !important;
}
.hide {
  display: none;
}
.hide-important {
  display: none !important;
}
</style>
<div class="show"></div>
<div class="show-important"></div>
<div class="hide"></div>
<div class="hide-important"></div>
<span class="span"></span>
<span class="display" style="display: block"></span>
<span class="display-important" style="display: block!important"></span>
<span class="hide" style="display: none"></span>
<span class="hide-important" style="display: none!important"></span>
<span class="hidden" hidden></span>
    `);
  });

  function getDisplay(element: HTMLElement): string {
    return window.getComputedStyle(element, null).getPropertyValue('display');
  }

  it('.toggle()', function () {
    $('#test div').add('#test span').toggle();

    assert.equal(getDisplay($('.show')[0]), 'none');
    assert.equal(getDisplay($('.show-important')[0]), 'block');
    assert.equal(getDisplay($('.hide')[0]), 'block');
    assert.equal(getDisplay($('.hide-important')[0]), 'none');
    assert.equal(getDisplay($('.span')[0]), 'none');
    assert.equal(getDisplay($('.display')[0]), 'none');
    // assert.equal(getDisplay($('.display-important')[0]), 'none');
    assert.equal(getDisplay($('.hide')[0]), 'block');
    assert.equal(getDisplay($('.hide-important')[0]), 'none');
    assert.equal(getDisplay($('.hidden')[0]), 'inline');
  });
});
