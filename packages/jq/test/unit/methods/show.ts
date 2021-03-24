import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.show()', function () {
  beforeEach(function () {
    $('#test').html(`
<style>
  .outline {
    display: none;
  }
  .outline-important {
    display: none !important;
  }
</style>
<div class="div" style="display: none"></div>
<div class="div" style="display: none"></div>
<span class="span" style="display: none"></span>
<span class="outline"></span>
<span class="outline-important"></span>
<span class="important" style="display: none!important"></span>
<span class="hidden" hidden></span>
    `);
  });

  function getDisplay(element: HTMLElement): string {
    return window.getComputedStyle(element, null).getPropertyValue('display');
  }

  it('.show()', function () {
    const $div = $('.div');
    const $span = $('.span');
    const $outline = $('.outline');
    const $outlineImportant = $('.outline-important');
    const $important = $('.important');
    const $hidden = $('.hidden');

    assert.equal(getDisplay($div[0]), 'none');
    assert.equal(getDisplay($div[1]), 'none');
    assert.equal(getDisplay($span[0]), 'none');
    assert.equal(getDisplay($outline[0]), 'none');
    assert.equal(getDisplay($outlineImportant[0]), 'none');
    assert.equal(getDisplay($important[0]), 'none');
    assert.equal(getDisplay($hidden[0]), 'none');

    const $divResult = $div.show();
    $span.show();
    $outline.show();
    $outlineImportant.show();
    $important.show();
    $hidden.show();

    assert.deepEqual($divResult, $div);
    assert.equal(getDisplay($div[0]), 'block');
    assert.equal(getDisplay($div[1]), 'block');
    assert.equal(getDisplay($span[0]), 'inline');
    assert.equal(getDisplay($outline[0]), 'inline');
    assert.equal(getDisplay($outlineImportant[0]), 'none');
    assert.equal(getDisplay($important[0]), 'inline');
    assert.equal(getDisplay($hidden[0]), 'inline');
  });
});
