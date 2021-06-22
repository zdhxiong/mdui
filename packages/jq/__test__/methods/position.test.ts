import { jQuery, jq, assert, JQStatic } from '../utils.js';
import '../../methods/position.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - .position`, () => {
    beforeEach(() => {
      document.querySelector('#frame')!.innerHTML = `
<div
  style="
    position: relative;
    margin: 10px;
  ">
  <div
    style="
      margin: 20px;
    ">
    <div
      id="child"
      style="
        position: absolute;
        left: 100px;
        top: 200px;
        margin: 15px;
        width: 150px;
        height: 120px;
      "></div>
    <div
      id="fixed"
      style="
        position: fixed;
        left: 120px;
        top: 140px;
        margin: 20px;
        padding: 10px;
      "></div>
  </div>
</div>
`;
    });

    it('.position()', () => {
      const childPosition = $('#child').position();
      assert.equal(childPosition.left, 100);
      assert.equal(childPosition.top, 200);

      const fixedPosition = $('#fixed').position();
      assert.equal(fixedPosition.left, 120);
      assert.equal(fixedPosition.top, 140);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
