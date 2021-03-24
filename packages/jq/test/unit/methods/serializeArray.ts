import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.serializeArray()', function () {
  beforeEach(function () {
    $('#test').html(`
<form id="form">
  <select name="single">
    <option>Single</option>
    <option>Single2</option>
  </select>
  <select name="multiple" multiple="multiple">
    <option selected="selected">Multiple</option>
    <option>Multiple2</option>
    <option selected="selected">Multiple3</option>
  </select>
  <input type="color" name="color" value="#000040"/>
  <input type="date" name="date" value="2019-10-19"/>
  <input type="password" name="password" value="123456"/>
  <input type="text" name="text" value="text"/>
  <input type="number" name="number" value="123"/>
  <input type="range" name="range" step="0.1" min="0" max="100" value="50"/>
  <input type="hidden" name="hidden" value="hide"/>
  <input type="text" name="disabled" value="disabled" disabled/>
  <input type="checkbox" name="check" value="check1">
  <input type="checkbox" name="check" value="check2" checked="checked">
  <input type="checkbox" name="check" value="check3" checked="checked">
  <input type="radio" name="radio" value="radio1" checked="checked">
  <input type="radio" name="radio" value="radio2">
  <input type="button" name="button" value="button"/>
  <input type="reset" name="reset" value="reset"/>
  <input type="submit" name="reset" value="submit"/>
</form>

<form class="form">
  <input type="text" name="text" value="text"/>
</form>
<form class="form">
  <input type="text" name="text" value="text"/>
</form>
    `);
  });

  it('.serializeArray()', function () {
    assert.deepEqual($('#form').serializeArray(), [
      { name: 'single', value: 'Single' },
      { name: 'multiple', value: 'Multiple' },
      { name: 'multiple', value: 'Multiple3' },
      { name: 'color', value: '#000040' },
      { name: 'date', value: '2019-10-19' },
      { name: 'password', value: '123456' },
      { name: 'text', value: 'text' },
      { name: 'number', value: '123' },
      { name: 'range', value: '50' },
      { name: 'hidden', value: 'hide' },
      { name: 'check', value: 'check2' },
      { name: 'check', value: 'check3' },
      { name: 'radio', value: 'radio1' },
    ]);

    assert.deepEqual($('#test input').serializeArray(), [
      { name: 'color', value: '#000040' },
      { name: 'date', value: '2019-10-19' },
      { name: 'password', value: '123456' },
      { name: 'text', value: 'text' },
      { name: 'number', value: '123' },
      { name: 'range', value: '50' },
      { name: 'hidden', value: 'hide' },
      { name: 'check', value: 'check2' },
      { name: 'check', value: 'check3' },
      { name: 'radio', value: 'radio1' },
      { name: 'text', value: 'text' },
      { name: 'text', value: 'text' },
    ]);

    assert.deepEqual($('#test input[name="check"]').serializeArray(), [
      { name: 'check', value: 'check2' },
      { name: 'check', value: 'check3' },
    ]);

    assert.deepEqual($().serializeArray(), []);

    assert.deepEqual($('#test input[name="text"]').serializeArray(), [
      { name: 'text', value: 'text' },
      { name: 'text', value: 'text' },
      { name: 'text', value: 'text' },
    ]);

    assert.deepEqual($('#test .form').serializeArray(), [
      { name: 'text', value: 'text' },
      { name: 'text', value: 'text' },
    ]);
  });
});
