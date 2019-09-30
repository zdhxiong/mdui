import $ from '../../jq_or_jquery';

describe('.val()', function() {
  beforeEach(function() {
    $('#test').html(`
<input type="text" id="input" value="test"/>
<input type="number" id="number" value="5"/>

<textarea id="textarea">gggg</textarea>

<progress value="50" max="100" id="progress"></progress>

<input type="checkbox" class="checkbox" name="checked" value="check1"/>
<input type="checkbox" class="checkbox" name="checked" value="check2" checked/>
<input type="checkbox" class="checkbox" name="checked" value="check3" checked/>

<input type="radio" class="radio" name="radio" value="radio1"/>
<input type="radio" class="radio" name="radio" value="radio2" checked/>
<input type="radio" class="radio" name="radio" value="radio3" checked/>

<select id="select-empty">
  <option value="a">a</option>
  <option value="b">b</option>
</select>

<select id="select">
  <option value="a">a</option>
  <option value="b" selected>b</option>
</select>

<select id="select-multiple-empty" multiple>
  <option value="a">a</option>
  <option value="b">b</option>
</select>

<select id="select-multiple" multiple>
  <option value="a" selected>a</option>
  <option value="b" selected>b</option>
</select>
    `);
  });

  it('.val()', function() {
    // input, textarea
    chai.assert.equal($('#input').val(), 'test');
    chai.assert.equal($('#textarea').val(), 'gggg');
    chai.assert.deepEqual($('#number').val(), '5');

    // progress 返回 number
    chai.assert.deepEqual($('#progress').val(), 50);

    // checkbox, jquery 将无视 checked 状态，直接返回第一个值
    chai.assert.equal($('.checkbox').val(), 'check1');
    chai.assert.equal($('.checkbox:checked').val(), 'check2');

    // radio, jquery 将无视 checked 状态，直接返回第一个值
    chai.assert.equal($('.radio').val(), 'radio1');
    chai.assert.equal($('.radio:checked').val(), 'radio3');

    // select 未选中时，默认选中第一个
    chai.assert.equal($('#select-empty').val(), 'a');

    // select 已选中
    chai.assert.equal($('#select').val(), 'b');

    // js 把 select 改为多选
    $('#select').prop('multiple', true);
    chai.assert.sameOrderedMembers($('#select').val() as string[], ['b']);

    // 多选 select 未选中，返回空数组
    chai.assert.sameOrderedMembers(
      $('#select-multiple-empty').val() as string[],
      [],
    );

    // 多选 select 已选中
    chai.assert.sameOrderedMembers($('#select-multiple').val() as string[], [
      'a',
      'b',
    ]);

    // 空集合
    chai.assert.isUndefined($('#notfound').val());
  });

  it('.val(value)', function() {
    const $input = $('#input');
    const $number = $('#number');
    const $textarea = $('#textarea');
    const $progress = $('#progress');
    const $checkbox = $('.checkbox');
    const $radio = $('.radio');
    const $select = $('#select');
    const $selectMultiple = $('#select-multiple');

    const $result = $input.val('mdui');
    chai.assert.deepEqual($result, $input);
    chai.assert.equal($input.val(), 'mdui');

    $input.val(undefined);
    chai.assert.equal($input.val(), '');

    $number.val('44');
    chai.assert.deepEqual($number.val(), '44');
    $number.val(22);
    chai.assert.deepEqual($number.val(), '22');
    $number.val('test');
    chai.assert.equal($number.val(), '');

    $textarea.val('test\nmdui');
    chai.assert.equal($textarea.val(), 'test\nmdui');

    $progress.val('44');
    chai.assert.deepEqual($progress.val(), 44);
    $progress.val(23);
    chai.assert.deepEqual($progress.val(), 23);

    $checkbox.val(['check1', 'check2']);
    chai.assert.isTrue(($checkbox[0] as HTMLInputElement).checked);
    chai.assert.isTrue(($checkbox[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($checkbox[2] as HTMLInputElement).checked);

    $radio.val(['radio1']);
    chai.assert.isTrue(($radio[0] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[2] as HTMLInputElement).checked);

    $radio.val(['radio1', 'radio2']);
    chai.assert.isFalse(($radio[0] as HTMLInputElement).checked);
    chai.assert.isTrue(($radio[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[2] as HTMLInputElement).checked);

    $select.val('a');
    chai.assert.equal($select.val(), 'a');

    $selectMultiple.val(['b']);
    chai.assert.sameOrderedMembers($selectMultiple.val() as string[], ['b']);
  });

  it('.val(callback)', function() {
    const $input = $('#input');
    const $number = $('#number');
    const $textarea = $('#textarea');
    const $progress = $('#progress');
    const $checkbox = $('.checkbox');
    const $radio = $('.radio');
    const $select = $('#select');
    const $selectMultiple = $('#select-multiple');

    const _thiss: HTMLElement[] = [];
    const _indexs: number[] = [];
    const _oldValues: string[] = [];

    const $result = $input.val(function(index, oldValue) {
      _thiss.push(this);
      _indexs.push(index);
      _oldValues.push(oldValue as string);

      return oldValue + 'mdui';
    });
    chai.assert.deepEqual($result, $input);
    chai.assert.sameOrderedMembers(_thiss, $input.get());
    chai.assert.sameOrderedMembers(_indexs, [0]);
    chai.assert.sameOrderedMembers(_oldValues, ['test']);
    chai.assert.equal($input.val(), 'testmdui');

    $input.val(function() {
      return undefined;
    });
    chai.assert.equal($input.val(), '');

    $input.val(function() {
      // 不返回
    });
    chai.assert.equal($input.val(), '');

    $number.val(function() {
      return '44';
    });
    chai.assert.deepEqual($number.val(), '44');
    $number.val(function() {
      return 22;
    });
    chai.assert.deepEqual($number.val(), '22');
    $number.val(function() {
      return 'test';
    });
    chai.assert.equal($number.val(), '');

    $textarea.val(function() {
      return 'test\nmdui';
    });
    chai.assert.equal($textarea.val(), 'test\nmdui');

    $progress.val(function() {
      return '44';
    });
    chai.assert.deepEqual($progress.val(), 44);
    $progress.val(function() {
      return 23;
    });
    chai.assert.deepEqual($progress.val(), 23);

    $checkbox.val(function() {
      return ['check1', 'check2'];
    });
    chai.assert.isTrue(($checkbox[0] as HTMLInputElement).checked);
    chai.assert.isTrue(($checkbox[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($checkbox[2] as HTMLInputElement).checked);

    $radio.val(function() {
      return ['radio1'];
    });
    chai.assert.isTrue(($radio[0] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[2] as HTMLInputElement).checked);

    $radio.val(function() {
      return ['radio1', 'radio2'];
    });
    chai.assert.isFalse(($radio[0] as HTMLInputElement).checked);
    chai.assert.isTrue(($radio[1] as HTMLInputElement).checked);
    chai.assert.isFalse(($radio[2] as HTMLInputElement).checked);

    $select.val(function() {
      return 'a';
    });
    chai.assert.equal($select.val(), 'a');

    $selectMultiple.val(function() {
      return ['b'];
    });
    chai.assert.sameOrderedMembers($selectMultiple.val() as string[], ['b']);
  });
});
