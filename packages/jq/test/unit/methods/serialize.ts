import { assert } from 'chai';
import $ from '../../jq_or_jquery';

describe('.serialize()', function () {
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

  it('.serialize(): string', function () {
    assert.equal(
      $('#form').serialize(),
      'single=Single&multiple=Multiple&multiple=Multiple3&color=%23000040&date=2019-10-19&password=123456&text=text&number=123&range=50&hidden=hide&check=check2&check=check3&radio=radio1',
    );

    assert.equal(
      $('#test input').serialize(),
      'color=%23000040&date=2019-10-19&password=123456&text=text&number=123&range=50&hidden=hide&check=check2&check=check3&radio=radio1&text=text&text=text',
    );

    assert.equal(
      $('#test input[name="check"]').serialize(),
      'check=check2&check=check3',
    );

    assert.equal($().serialize(), '');

    assert.deepEqual(
      $('#test input[name="text"]').serialize(),
      'text=text&text=text&text=text',
    );

    assert.deepEqual($('#test .form').serialize(), 'text=text&text=text');
  });
});
