import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.hide()', function () {
  beforeEach(function () {
    $('#test').html(`
<style>
  .outline {
    display: block;
  }
  .outline-important {
    display: block !important;
  }
</style>
<div class="div"></div>
<div class="div"></div>
<span class="span"></span>
<span class="outline"></span>
<span class="outline-important"></span>
<span class="important" style="display: block!important"></span>
<span class="hidden" hidden></span>
    `);
  });

  function getDisplay(element: HTMLElement): string {
    return window.getComputedStyle(element, null).getPropertyValue('display');
  }

  it('.hide()', function () {
    const $div = $('.div');
    const $span = $('.span');
    const $outline = $('.outline');
    const $outlineImportant = $('.outline-important');
    //const $important = $('.important');
    const $hidden = $('.hidden');

    assert.equal(getDisplay($div[0]), 'block');
    assert.equal(getDisplay($div[1]), 'block');
    assert.equal(getDisplay($span[0]), 'inline');
    assert.equal(getDisplay($outline[0]), 'block');
    assert.equal(getDisplay($outlineImportant[0]), 'block');
    //assert.equal(getDisplay($important[0]), 'block');
    assert.equal(getDisplay($hidden[0]), 'none');

    const $divResult = $div.hide();
    $span.hide();
    $outline.hide();
    $outlineImportant.hide();
    //$important.hide();
    $hidden.hide();

    assert.deepEqual($divResult, $div);
    assert.equal(getDisplay($div[0]), 'none');
    assert.equal(getDisplay($div[1]), 'none');
    assert.equal(getDisplay($span[0]), 'none');
    assert.equal(getDisplay($outline[0]), 'none');
    assert.equal(getDisplay($outlineImportant[0]), 'block');
    //assert.equal(getDisplay($important[0]), 'none');
    assert.equal(getDisplay($hidden[0]), 'none');
  });
});
