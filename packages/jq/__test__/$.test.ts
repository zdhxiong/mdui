import {
  jQuery,
  jq,
  assert,
  JQStatic,
  toTextContentArray,
  selectorToArray,
} from './utils.js';

const test = ($: JQStatic, type: string): void => {
  describe(`${type} - $()`, () => {
    before(() => {
      document.querySelector('#frame')!.innerHTML = `
<div id="testid">a</div>
<div class="testclass">b</div>
<span class="testclass">c</span>
<span id="span1">d</span>
<span id="span2">e</span>
<label>f</label>
`;
    });

    it('$()', () => {
      const $empty = $();
      assert.lengthOf($empty, 0);

      const $null = $(null);
      assert.lengthOf($null, 0);
    });

    it('$(window)', () => {
      const $window = $(window);
      assert.lengthOf($window, 1);
      assert.deepEqual($window[0], window);
    });

    it('$(document)', () => {
      const $document = $(document);
      assert.lengthOf($document, 1);
      assert.deepEqual($document[0], document);
    });

    it('$(element)', () => {
      const $element = $(document.getElementById('testid')!);
      assert.lengthOf($element, 1);
      assert.deepEqual($element[0], document.getElementById('testid'));
    });

    it('$(elementArray)', () => {
      const nodes = selectorToArray('.testclass');
      const $elements = $(nodes);
      assert.lengthOf($elements, 2);
      assert.sameOrderedMembers(Array.from($elements), nodes);
    });

    it('$(html)', () => {
      const $htmlElement = $('<div><p>Hello</p></div><span>test</span>');
      assert.lengthOf($htmlElement, 2);
      assert.equal($htmlElement[0].outerHTML, '<div><p>Hello</p></div>');
      assert.equal($htmlElement[1].outerHTML, '<span>test</span>');
    });

    it('$(child_tag_html)', () => {
      const $htmlElement = $('<tr></tr><tr></tr>');
      assert.lengthOf($htmlElement, 2);
      assert.equal($htmlElement[0].outerHTML, '<tr></tr>');
      assert.equal($htmlElement[1].outerHTML, '<tr></tr>');
    });

    it('$(id_selector)', () => {
      const $id = $('#testid');
      assert.lengthOf($id, 1);
      assert.deepEqual($id[0], document.getElementById('testid'));
    });

    it('$(class_selector)', () => {
      const $class = $('.testclass');
      assert.lengthOf($class, 2);
      assert.deepEqual($class[0], document.querySelectorAll('.testclass')[0]);
      assert.deepEqual($class[1], document.querySelectorAll('.testclass')[1]);
      assert.notDeepEqual(
        $class[0],
        document.querySelectorAll('.testclass')[1],
      );
    });

    it('$(tag_selector)', () => {
      const $tag = $('#frame span');
      assert.lengthOf($tag, 3);

      const nodes = selectorToArray('#frame span');
      assert.sameOrderedMembers(Array.from($tag), nodes);
    });

    it('$(multiple_selector)', () => {
      const $elements = $('#testid, .testclass,#frame label');

      assert.lengthOf($elements, 4);
      assert.equal(toTextContentArray($elements).join(''), 'abcf');
    });

    it('$(nodeList)', () => {
      const nodeList = document.querySelectorAll('.testclass');
      const nodes = Array.from(nodeList);
      const $nodeList = $(nodeList);

      assert.lengthOf($nodeList, 2);
      assert.sameOrderedMembers(Array.from($nodeList), nodes);
    });

    it('$($elements)', () => {
      const $class = $('.testclass');
      const $jq = $($class);
      // jquery 中两个对象不相同，但包含的元素相同；mdui.jq 中两个对象完全相同
      assert.sameOrderedMembers(Array.from($class), Array.from($jq));
    });

    it('$(callback)', () => {
      const $fc = $(function (_$) {
        assert.equal(this, document);
        assert.equal($, _$);
      });

      assert.lengthOf($fc, 1);
      // @ts-ignore
      assert.deepEqual($fc[0], document);
    });

    it('$(not_found)', () => {
      const $element = $('#frame button');
      assert.lengthOf($element, 0);

      const $selector = $('.not-found');
      assert.lengthOf($selector, 0);
    });

    it('$(object)', () => {
      const obj = {
        a: 'aa',
        b: 11,
        c: [1, 2],
      };

      const $jq = $(obj);
      assert.deepEqual($jq[0], obj);
    });

    it('$(array)', () => {
      const arr = [
        'str',
        123,
        [1, '2'],
        {
          a: 'aa',
          b: 11,
        },
        document.getElementById('testid'),
      ];

      const $jq = $(arr);
      assert.sameOrderedMembers(Array.from($jq) as typeof arr, arr);
    });
  });
};

test(jq, 'jq');
test(jQuery as unknown as JQStatic, 'jQuery');
