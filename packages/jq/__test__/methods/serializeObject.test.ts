import '../../methods/serializeObject.js';
import { jq, assert, JQStatic } from '../utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .serializeObject`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
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
`;
    });

    it('.serializeObject()', () => {
      assert.deepEqual($('#form').serializeObject(), {
        single: 'Single',
        multiple: ['Multiple', 'Multiple3'],
        color: '#000040',
        date: '2019-10-19',
        password: '123456',
        text: 'text',
        number: '123',
        range: '50',
        hidden: 'hide',
        check: ['check2', 'check3'],
        radio: 'radio1',
      });

      assert.deepEqual($('#frame input').serializeObject(), {
        color: '#000040',
        date: '2019-10-19',
        password: '123456',
        number: '123',
        range: '50',
        hidden: 'hide',
        check: ['check2', 'check3'],
        radio: 'radio1',
        text: ['text', 'text', 'text'],
      });

      assert.deepEqual($('#frame input[name="check"]').serializeObject(), {
        check: ['check2', 'check3'],
      });

      assert.deepEqual($().serializeObject(), {});

      assert.deepEqual($('#frame input[name="text"]').serializeObject(), {
        text: ['text', 'text', 'text'],
      });

      assert.deepEqual($('#frame .form').serializeObject(), {
        text: ['text', 'text'],
      });
    });
  });
};

test(jq, 'jq');
// jQuery 不存在该方法
