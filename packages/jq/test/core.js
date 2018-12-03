describe('核心', function () {

  it('$() - JQ 的核心方法', function () {
    var test = document.getElementById('test');

    // $('.selector')
    test.innerHTML =
      '<div id="testid"></div>' +
      '<div class="testclass"></div>' +
      '<div class="testclass"></div>' +
      '<span id="span1"></span>' +
      '<span id="span2"></span>';
    var $dom = $('#testid');
    assert.equal($dom.length, 1);
    assert.deepEqual($dom.get(0), document.getElementById('testid'));

    $dom = $('.testclass');
    assert.equal($dom.length, 2);
    assert.deepEqual($dom.get(0), document.querySelectorAll('.testclass')[0]);
    assert.deepEqual($dom.get(1), document.querySelectorAll('.testclass')[1]);

    $dom = $('span');
    assert.equal($dom.length, 2);
    assert.deepEqual($dom.get(0), document.getElementById('span1'));
    assert.deepEqual($dom.get(1), document.getElementById('span2'));

    // $(Node)
    var node = document.getElementById('testid');
    $dom = $(node);
    assert.equal($dom.length, 1);
    assert.deepEqual($dom.get(0), node);

    // $(NodeList)
    node = document.querySelectorAll('#test .testclass');
    $dom = $(node);
    assert.lengthOf($dom, 2);
    assert.deepEqual($dom.get(0), node[0]);
    assert.deepEqual($dom.get(1), node[1]);

    // $(Window)
    $dom = $(window);
    assert.equal($dom.length, 1);
    assert.deepEqual($dom.get(0), window);

    // $(Array)
    node = document.querySelectorAll('.testclass');
    var nodes = [];
    for (var i = 0; i < node.length; i++){
      nodes.push(node[i]);
    }
    $dom = $(nodes);
    assert.equal($dom.length, 2);
    assert.deepEqual($dom.get(0), node[0]);
    assert.deepEqual($dom.get(1), node[1]);

    // $($())
    $dom = $('#testid');
    $dom = $($dom);
    assert.equal($dom.length, 1);
    assert.deepEqual($dom.get(0), document.getElementById('testid'));

    // $(function () {})
    // 测试位于 event.js 文件中

    test.innerHTML = '';
  });

  it('$.extend(obj) - 把对象合并到 JQ 对象中', function () {
    $.extend({
      testFunc: function () {
        return 'testFunc';
      },
      testFunc2: function () {
        return 'testFunc2';
      }
    });
    assert.equal($.testFunc(), 'testFunc');
    assert.equal($.testFunc2(), 'testFunc2');
  });

  it('$.extend(obj1, obj2, ...) - 把多个对象合并到第一个对象中，并返回第一个对象', function () {
    var obj1 = {
      key: 'val'
    };
    var obj2 = {
      key1: 'val1'
    };
    var obj3 = {
      key2: 'val2',
      key3: 'val3'
    };
    var expected = {
      key: 'val',
      key1: 'val1',
      key2: 'val2',
      key3: 'val3'
    };
    var result = $.extend(obj1, obj2, obj3);
    assert.deepEqual(obj1, expected);
    assert.deepEqual(result, expected);
  });

  it('$.fn.extend(obj) - 在 JQ 对象的原型链上扩展方法', function () {
    $.fn.extend({
      testFunc11: function () {
        this.addClass('class1');
      },
      testFunc22: function () {
        this.addClass('class2');
      }
    });

    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="test1"></div>' +
      '<div class="test2"></div>';

    $('#test .test1').testFunc11();
    $('#test .test2').testFunc22();

    assert.isTrue($('#test .test1').hasClass('class1'));
    assert.isTrue($('#test .test2').hasClass('class2'));

    test.innerHTML = '';
  });

  it('$.each() - 遍历对象或数组', function () {
    // 遍历数组
    var newArray = $.each(['a', 'b', 'c'], function (i, item) {
      assert.isNumber(i, '不是数字！');
      assert.isString(item, '不是字符串！');
      i === 0 && assert.equal(item, 'a');
      i === 1 && assert.equal(item, 'b');
      i === 2 && assert.equal(item, 'c');
    });

    assert.lengthOf(newArray, 3);
    assert.include(newArray, 'a');
    assert.isArray(newArray);

    // 遍历对象
    newArray = $.each({'a': 'ww', 'b': 'mdui'}, function (i, item) {
      i === 'a' && assert.equal(item, 'ww');
      i === 'b' && assert.equal(item, 'mdui');
    });

    assert.deepEqual(newArray, {'a': 'ww', 'b': 'mdui'});
  });

  it('$.merge() - 合并两个数组，用合并的结果替换第一个数组', function () {
    var first = ['a', 'b', 'c'];
    var second = ['c', 'd', 'e'];
    var result = $.merge(first, second);

    assert.deepEqual(result, ['a', 'b', 'c', 'c', 'd', 'e']);
    assert.deepEqual(first, ['a', 'b', 'c', 'c', 'd', 'e']);
    assert.deepEqual(second, ['c', 'd', 'e']);
  });

  it('$.unique() - 删除数组中的重复元素', function () {
    // 删除数组的重复元素
    assert.sameMembers($.unique([1,2,12,3,2,1,2,1,1,1,1]), [1, 2, 12, 3]);
    assert.include($.unique([1,2,12,3,2,1,2,1,1,1,1]), 12);

    // 使用 .add 时删除重复的 DOM
    var test = document.getElementById("test");
    test.innerHTML = '<div class="intro"></div>';

    var arr = $('.intro').add($('.intro'));
    assert.lengthOf(arr, 1);

    test.innerHTML = '';
  });

  it('$.map() - 将一个数组中的元素转换到另一个数组中', function () {
    var test = document.getElementById('test');

    // 遍历 DOM 元素
    var dom = '<div class="next">prev1</div>' +
      '<div>prev22</div>' +
      '<div id="prev">prev33</div>' +
      '<p>mdui</p>';
    test.innerHTML = dom;

    var elmarr = $.map($('#test div'), function (node, i) {
      return node.innerText;
    });
    assert.lengthOf(elmarr,3);
    assert.include(elmarr, 'prev22');
    assert.isArray(elmarr);
    assert.equal(test.innerHTML, dom);

    test.innerHTML = '';

    // 遍历对象
    var newarr = $.map({'w':1, 'c':2, 'j':3}, function (val, key) {
      return key;
    });
    assert.deepEqual(newarr, ['w', 'c', 'j']);

    newarr = $.map({'w':1, 'c':2, 'j':3}, function (i, val) {
      if(val === 'w') {
        return val;
      }
    });
    assert.deepEqual(newarr, ['w']);

    // 遍历数组
    newarr = $.map(['J', 'S', 'L', 'i', 't', 'e'], function (val, i) {
      return val;
    });
    assert.deepEqual(newarr, ["J", "S", "L", "i", "t", "e"]);

    newarr = $.map([1, 2, 3], function (val, i) {
      return [val, val + 1];
    });
    assert.deepEqual(newarr, [1, 2, 2, 3, 3, 4]);
  });

  it('$.contains() - 判断父节点是否包含子节点', function () {
    var test = document.getElementById("test");
    test.innerHTML = '<div>Hello World</div>';
    assert.isTrue($.contains($("#test")[0], $("#test div")[0]));
    assert.isFalse($.contains($("#test div")[0], $("#test")[0]));

    test.innerHTML = '';
  });

  it('$.param() - 将表单元素数组或者对象序列化', function () {
    assert.equal( $.param({width:1680, height:1050}), 'width=1680&height=1050');
    assert.equal( decodeURIComponent($.param({width:1680, height:1050})), 'width=1680&height=1050');

    assert.equal( $.param({foo: {one: 1,two: 2 } }), 'foo%5Bone%5D=1&foo%5Btwo%5D=2');
    assert.equal( decodeURIComponent($.param({foo: {one: 1,two: 2 } })), 'foo[one]=1&foo[two]=2');

    assert.equal( $.param({ids:["a1","b2","c3"], c:{g:23,e:[567]}, a:3 }), 'ids%5B%5D=a1&ids%5B%5D=b2&ids%5B%5D=c3&c%5Bg%5D=23&c%5Be%5D%5B%5D=567&a=3');
    assert.equal( decodeURIComponent($.param({ids:["a1","b2","c3"], c:{g:23,e:[567]}, a:3 })), 'ids[]=a1&ids[]=b2&ids[]=c3&c[g]=23&c[e][]=567&a=3');

    assert.equal( $.param({ids:[1,2,3] }), 'ids%5B%5D=1&ids%5B%5D=2&ids%5B%5D=3');
    assert.equal( decodeURIComponent($.param({ids:[1,2,3] })), 'ids[]=1&ids[]=2&ids[]=3');

    assert.equal( $.param({a: 'a+b', b: 'b c'}), 'a=a%2Bb&b=b%20c');
    assert.equal( decodeURIComponent($.param({a: 'a+b', b: 'b c'})), 'a=a+b&b=b c' );
  });

  it('.length - 对象中元素的个数', function () {
    var test = document.getElementById('test');

    // 不存在元素
    assert.equal($('#test div').length, 0);

    // 存在一个元素
    test.innerHTML = '<div>Hello World</div>';
    assert.equal($('#test div').length, 1);

    // 存在两个元素
    test.innerHTML =
      '<div>Hello World</div>' +
      '<div>Hello World</div>';
    assert.equal($('#test div').length, 2);

    // 存在嵌套的元素
    test.innerHTML =
      '<div>Hello World' +
        '<div>test</div>' +
        '</div>' +
      '<div>Hello World</div>';
    assert.equal($('#test div').length, 3);

    test.innerHTML = '';
  });

  it('.each() - 遍历一个 JQ 集合，为集合中的每个元素执行一个函数', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div>b</div>' +
      '<div>c</div>' +
      '<div>d</div>';

    var ret = $('#test div').each(function (i, item) {
      assert.isNumber(i);
      if (i === 0) {
        assert.deepEqual(item.outerHTML, '<div>a</div>');
      }
      if (i === 2) {
        assert.deepEqual(item.outerHTML, '<div>c</div>');
      }
      item.innerHTML = i + 'mdui';
    });

    assert.lengthOf(ret, 4);
    assert.equal(ret[0].outerHTML, '<div>0mdui</div>');

    test.innerHTML = '';
  });

  it('.map() - 遍历 JQ 对象，返回一个新的对象', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div>b</div>' +
      '<div>c</div>' +
      '<div>d</div>';

    var ret = $('#test div').map(function (i, item) {
      assert.isNumber(i);
      if (i === 0) {
        assert.deepEqual(item.outerHTML, '<div>a</div>');
      }
      if (i === 2) {
        assert.deepEqual(item.outerHTML, '<div>c</div>');
      }

      // null 和 undefined 会被过滤
      if (i === 1) {
        return null;
      }
      if (i === 2) {
        return undefined;
      }
      return i + 'mdui';
    });
    assert.equal(ret.length, 2);
    assert.isFalse(Array.isArray(ret));
    assert.equal(ret.get().join(''), '0mdui3mdui');

    test.innerHTML = '';
  });

  it('.get() - 获取 JQ 对象中指定的元素，或者把 JQ 对象转换为数组', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div>b</div>' +
      '<div>c</div>' +
      '<div>d</div>';

    // $().get()
    var ret = $('#test div').get();
    assert.isTrue(Array.isArray(ret));
    assert.equal(ret.length, 4);
    assert.equal(ret[2].innerHTML, 'c');

    // $().get(index)
    ret = $('#test div').get(1);
    assert.equal(ret.innerHTML, 'b');

    test.innerHTML = '';
  });

  it('.slice() - 从 JQ 对象中提取指定范围内的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div>b</div>' +
      '<div>c</div>' +
      '<div>d</div>';

    // $().slice(start)
    var ret = $('#test div').slice(2);
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'c');
    assert.equal(ret.get(1).innerHTML, 'd');

    // $().slice(start, end)
    ret = $('#test div').slice(1, 3);
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    test.innerHTML = '';
  });

  it('.filter() - 从 JQ 对象中筛选元素集合', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div class="haha">b</div>' +
      '<div class="haha">c</div>' +
      '<div>d</div>';

    // $().filter(function (index) {})
    var ret = $('#test div').filter(function (index) {
      return index === 0 || index === 3;
    });
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'a');
    assert.equal(ret.get(1).innerHTML, 'd');

    // $().filter(function (index, element) {})
    ret = $('#test div').filter(function (index, element) {
      if (index === 0) {
        return false;
      }
      return element.innerHTML !== 'd';
    });
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    // $().filter('.haha')
    ret = $('#test div').filter('.haha');
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    // $().filter($('.haha'))
    ret = $('#test div').filter($('.haha'));
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    // $().filter(element)
    ret = $('#test div').filter($('.haha').get(0));
    assert.equal(ret.length, 1);
    assert.equal(ret.get(0).innerHTML, 'b');

    test.innerHTML = '';
  });

  it('.not() - 从 JQ 集合中删除指定元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div>a</div>' +
      '<div class="haha">b</div>' +
      '<div class="haha">c</div>' +
      '<div>d</div>';

    // $().not(function (index) {})
    var ret = $('#test div').not(function (index) {
      return index === 0 || index === 3;
    });
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    // $().not(function (index, element) {})
    ret = $('#test div').not(function (index, element) {
      if (index === 0) {
        return true;
      }
      return element.innerHTML === 'd';
    });
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'b');
    assert.equal(ret.get(1).innerHTML, 'c');

    // $().not('.haha')
    ret = $('#test div').not('.haha');
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'a');
    assert.equal(ret.get(1).innerHTML, 'd');

    // $().not($('.haha'))
    ret = $('#test div').not($('.haha'));
    assert.equal(ret.length, 2);
    assert.equal(ret.get(0).innerHTML, 'a');
    assert.equal(ret.get(1).innerHTML, 'd');

    // $().not(element)
    ret = $('#test div').not($('.haha').get(0));
    assert.equal(ret.length, 3);
    assert.equal(ret.get(0).innerHTML, 'a');
    assert.equal(ret.get(1).innerHTML, 'c');
    assert.equal(ret.get(2).innerHTML, 'd');

    test.innerHTML = '';
  });

  it('.offset() - 获取元素相对于 document 的偏移', function () {
    var test = document.getElementById('test');
    test.innerHTML = '<div style="position: absolute;top: 100px;left: 200px;width: 500px;height: 450px;"></div>';

    test.style.overflow = 'hidden';

    var offset = $('#test div').offset();
    assert.equal(offset.left, 200);
    assert.equal(offset.top, 100);

    // width、height 是 JQ 特有的，jQuery 没有
    if (typeof offset.width !== 'undefined') {
      assert.equal($('#test div').offset().width, 500);
      assert.equal($('#test div').offset().height, 450);
    }
  });

  it('.offsetParent() - 返回最近一个用于定位的父元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1">' +
        '<div id="child2" style="position: absolute;">' +
          '<div id="child3">' +
            '<div id="child4"></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    assert.deepEqual($('#child4').offsetParent().get(0), $('#child2').get(0));

    test.innerHTML = '';
  });

  it('.position() - 获取元素相对于父元素的偏移', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div style="position: relative">' +
        '<div id="child" style="position: absolute;left: 100px;top: 200px;width: 150px;height: 120px;"></div>' +
      '</div>';

    var position = $('#child').position();
    assert.equal(position.left, '100');
    assert.equal(position.top, '200');

    // width, height 是 JQ 另外加的，jQuery 中不能存在
    if (typeof position.width !== 'undefined') {
      assert.equal(position.width, '150');
      assert.equal(position.height, '120');
    }

    test.innerHTML = '';
  });

  it('.show() - 显示指定元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child" style="display: none"></div>' +
      '<div class="child" style="display: none"></div>';

    $('.child').show();

    assert.equal($('.child').get(0).style.display, '');
    assert.equal($('.child').get(1).style.display, '');

    test.innerHTML = '';
  });

  it('.hide() - 隐藏指定元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child"></div>' +
      '<div class="child"></div>';

    $('.child').hide();

    assert.equal($('.child').get(0).style.display, 'none');
    assert.equal($('.child').get(1).style.display, 'none');

    test.innerHTML = '';
  });

  it('.toggle() - 切换元素的显示状态', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child" style="display: none"></div>' +
      '<div class="child"></div>';

    $('.child').toggle();

    assert.equal($('.child').get(0).style.display, '');
    assert.equal($('.child').get(1).style.display, 'none');

    test.innerHTML = '';
  });

  it('.hasClass() - 元素上是否包含指定的类', function () {
    var test = document.getElementById("test")
    test.innerHTML = '<div class="mdui">Goodbye</div>';

    var $div = $("#test div");
    assert.property($div, 'hasClass');
    assert.isTrue($div.hasClass('mdui'));
    assert.isFalse($div.hasClass('test'));

    test.innerHTML = '';
  });

  it('.removeAttr() - 移除指定属性', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child" mdui="test"></div>';

    assert.equal($('#child').get(0).getAttribute('mdui'), 'test');

    $('#child').removeAttr('mdui');
    assert.equal($('#child').get(0).getAttribute('mdui'), null);

    test.innerHTML = '';
  });

  it('.removeProp() - 删除通过 .prop() 设置的属性', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<input type="checkbox" id="child"/>';

    var $child = $('#child');

    $child.prop('mmmm', 'nnnn');
    assert.equal($child.prop('mmmm'), 'nnnn');

    $child.removeProp('mmmm');
    assert.equal($child.prop('mmmm'), undefined);

    test.innerHTML = '';
  });

  it('.eq() - 获取当前对象中的 n 的元素的 JQ 对象', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child">a</div>' +
      '<div id="child2" class="child">b</div>' +
      '<div id="child3" class="child">c</div>' +
      '<div id="child4" class="child">d</div>';

    assert.deepEqual($($('#test .child').eq(0)[0]), $('#child1'));
    assert.deepEqual($($('#test .child').eq(2)[0]), $('#child3'));
    assert.deepEqual($($('#test .child').eq(-1)[0]), $('#child4'));
    assert.deepEqual($($('#test .child').eq(-3)[0]), $('#child2'));

    test.innerHTML = '';
  });

  it('.first() - 获取当前对象中第一个元素', function () {
    // .eq() 通过即可
  });

  it('.last() - 获取对象中最后一个元素', function () {
    // .eq() 通过即可
  });

  it('.index() - 获取元素在集合中的位置', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2"></div>' +
        '<div id="child3"></div>' +
        '<div id="child4"></div>' +
      '</div>';

    assert.equal($('#child3').index(), 2);
    assert.equal($('#child3').index('#child div'), 2);
    assert.equal($('#child div').index($('#child3').get(0)), 2);

    test.innerHTML = '';
  });

  it('.is() - 根据选择器、DOM 元素或 JQ 对象来检测匹配的元素集合，至少有一个元素匹配则返回 true', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child" id="child1"></div>' +
      '<div class="child" id="child2"></div>' +
      '<div class="child" id="child3"></div>';

    // selector
    assert.isTrue($('.child').is('.child'));
    assert.isTrue($('.child').is('#child1'));
    assert.isFalse($('.child').is('.test'));

    // window, document
    assert.isTrue($(document).is(document));
    // assert.isTrue($(window).is(window));
    assert.isFalse($(document).is(window));
    assert.isFalse($(window).is(document));

    // Node
    assert.isTrue($('.child').is(document.getElementById('child1')));
    assert.isFalse($('.child').is(document.getElementById('child6')));

    // NodeList
    assert.isTrue($('.child').is(document.querySelectorAll('.child')));
    assert.isFalse($('.child').is(document.querySelectorAll('#test')));

    // Array
    assert.isTrue($('.child').is($('.child').get()));

    // JQ
    assert.isTrue($('.child').is($('.child')));
    assert.isTrue($('.child').is($('#child1')));
    assert.isFalse($('.child').is($('#child6')));

    test.innerHTML = '';
  });

  it('.find() - 根据 CSS 选择器找到后代节点的集合', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div class="child" id="child-1"></div>' +
        '<div class="child" id="child-2">' +
          '<div class="child2" id="child-2-1"></div>' +
          '<div class="child2" id="child-2-2"></div>' +
        '</div>' +
      '</div>';

    var $child = $('#child').find('.child');
    assert.equal($child.length, 2);
    assert.equal($child[0], document.getElementById('child-1'));
    assert.equal($child[1], document.getElementById('child-2'));

    var $child2 = $('#child').find('.child2');
    assert.equal($child2.length, 2);
    assert.equal($child2[0], document.getElementById('child-2-1'));
    assert.equal($child2[1], document.getElementById('child-2-2'));

    var $child3 = $('#child').find('#child-2-1');
    assert.equal($child3.length, 1);
    assert.equal($child3[0], document.getElementById('child-2-1'));

    test.innerHTML = '';
  });

  it('.children() - 找到直接子元素的元素集合', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2" class="child">' +
          '<div id="child2-1"></div>' +
          '<div id="child2-2"></div>' +
        '</div>' +
        '<div id="child3" class="child"></div>' +
      '</div>';

    // 所有直接子元素
    var $childs = $('#child').children();
    assert.equal($childs.length, 3);
    assert.isTrue($childs.eq(0).is('#child1'));
    assert.isTrue($childs.eq(1).is('#child2'));
    assert.isTrue($childs.eq(2).is('#child3'));

    // 指定选择器
    var $childs = $('#child').children('.child');
    assert.equal($childs.length, 2);
    assert.isTrue($childs.eq(0).is('#child2'));
    assert.isTrue($childs.eq(1).is('#child3'));

    test.innerHTML = '';
  });

  it('.has() - 保留含有指定子元素的元素，去掉不含指定子元素的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child" id="child1"></div>' +
      '<div class="child" id="child2">' +
        '<div class="child2" id="child2-1"></div>' +
        '<div class="child2" id="child2-2"></div>' +
      '</div>' +
      '<div class="child" id="child3"></div>';

    // selector
    var $childs = $('.child').has('#child2-1');
    assert.equal($childs.length, 1);
    assert.isTrue($childs.eq(0).is('#child2'));

    // dom
    var $childs = $('.child').has(document.getElementById('child2-1'));
    assert.equal($childs.length, 1);
    assert.isTrue($childs.eq(0).is('#child2'));

    test.innerHTML = '';
  });

  it('.siblings() - 获取同辈元素的集合', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child1">' +
        '<div id="child1-1" class="child2">' +
          '<div id="child1-1-1" class="child3"></div>' +
          '<div id="child1-1-2" class="child3"></div>' +
        '</div>' +
        '<div id="child1-2" class="child2"></div>' +
        '<div id="child1-3" class="child2"></div>' +
      '</div>';

    // 所有同辈元素
    var $siblings = $('#child1-2').siblings();
    assert.equal($siblings.length, 2);
    assert.isTrue($siblings.eq(0).is('#child1-1'));
    assert.isTrue($siblings.eq(1).is('#child1-3'));

    test.innerHTML = '';
  });

  it('.closest() - 返回首先匹配到的父节点，包含父节点', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child">' +
        '<div id="child2" class="child">' +
          '<div id="child3">' +
            '<div id="child4"></div>' +
          '</div>' +
        '</div>' +
      '</div>';

    // $().closest(selector)
    var $dom = $('#child4').closest('.child');
    assert.equal($dom.length, 1);
    assert.isTrue($dom.eq(0).is('#child2'));

    // $().closest(selector) 当前元素已匹配
    $dom = $('#child4').closest('#child4');
    assert.equal($dom.length, 1);
    assert.isTrue($dom.eq(0).is('#child4'));

    test.innerHTML = '';
  });

  it('.remove() - 删除所有匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="child">' +
        '<div class="child2" id="child2-1">' +
          '<div class="child3"></div>' +
        '</div>' +
        '<div class="child2" id="child2-2">' +
          '<div class="child3"></div>' +
        '</div>' +
      '</div>';

    $('#child2-1').remove();
    assert.equal($('#child2-1').length, 0);
    assert.equal($('.child').length, 1);
    assert.equal($('#child2-2').length, 1);

    // 未匹配的元素上执行 remove()
    $('#hgufdg').remove();

    test.innerHTML = '';
  });

  it('.add() - 添加元素到匹配的元素集合中', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<ul>' +
        '<li>list item 1</li>' +
        '<li>list item 2</li>' +
      '</ul>' +
      '<p>a paragraph</p>';

    assert.lengthOf($('#test li').add('p').css('background-color', 'red'), 3);
    assert.equal($('#test li')[0].style.backgroundColor,'red');
    assert.equal($('#test li')[1].style.backgroundColor,'red');
    assert.equal($('#test p')[0].style.backgroundColor,'red');

    // 同一个元素不重复添加
    assert.lengthOf($('#test li').add('p').add('p'), 3);

    test.innerHTML = '';
  });

  it('.empty() - 删除子节点', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div id="child1">' +
          '<div id="child1-1">' +
            '<div id="child1-1-1"></div>' +
          '</div>' +
        '</div>' +
        '<div id="child2"></div>' +
      '</div>';

    $('#child1').empty();
    assert.equal($('#child1').length, 1);
    assert.equal($('#child1-1').length, 0);
    assert.equal($('#child2').length, 1);

    test.innerHTML = '';
  });

  it('.clone() - 克隆元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div id="child1" class="child1">' +
          '<div id="child2" class="child2"></div>' +
        '</div>' +
      '</div>';

    var $new = $('#child1').clone();

    assert.isTrue($new.hasClass('child1'));
    assert.equal($new.find('#child2').length, 1);

    test.innerHTML = '';
  });

  it('.replaceWith() - 用新元素替换当前元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2"></div>' +
        '<div id="child3"></div>' +
      '</div>';
    $('#child2').replaceWith('<div id="test2"></div>');
    assert.equal($('#child').html(), '<div id="child1"></div><div id="test2"></div><div id="child3"></div>');

    test.innerHTML =
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2"></div>' +
        '<div id="child3"></div>' +
      '</div>';
    $('#child1').replaceWith($('#child3'));
    assert.equal($('#child').html(), '<div id="child3"></div><div id="child2"></div>');

    test.innerHTML =
      '<div id="child">' +
        '<div id="child1"></div>' +
        '<div id="child2"></div>' +
        '<div id="child3"></div>' +
      '</div>';
    $('#child1').replaceWith($('#child3').get(0));
    assert.equal($('#child').html(), '<div id="child3"></div><div id="child2"></div>');

    test.innerHTML = '';
  });

  it('.serializeArray() - 将表单元素的值组成成键值对', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<form id="form">' +
        '<div>' +
          '<input type="text" name="text" value="text"/>' +
          '<input type="number" name="number" value="123"/>' +
          '<input type="hidden" name="hidden" value="hide"/>' +
          '<input type="checkbox" name="checkbox" value="checkbox1" checked/> ' +
        '</div>' +
        '<input type="checkbox" name="checkbox" value="checkbox2" checked/>' +
        '<input type="checkbox" name="checkbox" value="checkbox3"/>' +
        '<input type="radio" name="radio" value="radio1" checked/>' +
        '<input type="radio" name="radio" value="radio2"/>' +
        '<input type="text" name="disabled" value="disabled" disabled/>' +
        '<input type="button" name="button" value="button"/>' +
        '<input type="reset" name="reset" value="reset"/>' +
        '<input type="submit" name="reset" value="submit"/>' +
      '</form>';

    var value = $('#form').serializeArray();

    assert.equal(value.length, 6);
    assert.deepEqual(value[0], {name: 'text', value: 'text'});
    assert.deepEqual(value[1], {name: 'number', value: '123'});
    assert.deepEqual(value[2], {name: 'hidden', value: 'hide'});
    assert.deepEqual(value[3], {name: 'checkbox', value: 'checkbox1'});
    assert.deepEqual(value[4], {name: 'checkbox', value: 'checkbox2'});
    assert.deepEqual(value[5], {name: 'radio', value: 'radio1'});

    test.innerHTML = '';
  });

  it('.serialize() - 将表单元素或对象序列化', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<form id="form">' +
        '<div>' +
          '<input type="text" name="text" value="text"/>' +
          '<input type="number" name="number" value="123"/>' +
          '<input type="hidden" name="hidden" value="hide"/>' +
          '<input type="checkbox" name="checkbox" value="checkbox1" checked/> ' +
        '</div>' +
        '<input type="checkbox" name="checkbox" value="checkbox2" checked/>' +
        '<input type="checkbox" name="checkbox" value="checkbox3"/>' +
        '<input type="radio" name="radio" value="radio1" checked/>' +
        '<input type="radio" name="radio" value="radio2"/>' +
        '<input type="text" name="disabled" value="disabled" disabled/>' +
        '<input type="button" name="button" value="button"/>' +
        '<input type="reset" name="reset" value="reset"/>' +
        '<input type="submit" name="reset" value="submit"/>' +
      '</form>';

    var value = $('#form').serialize();
    assert.equal(value, 'text=text&number=123&hidden=hide&checkbox=checkbox1&checkbox=checkbox2&radio=radio1');

    test.innerHTML = '';
  });

  it('.val() - 获取或设置元素的值', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<input type="text" id="input" value="test"/>';

    var $input = $('#input');
    assert.equal($input.val(), 'test');

    $('#input').val('dddd');
    assert.equal($input.val(), 'dddd');

    test.innerHTML = '';
  });

  it('.html() - 获取或设置元素的 HTML', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="html"><p>test</p></div>';

    var $html = $('#html');
    assert.equal($html.html(), '<p>test</p>');

    $html.html('<span>dddd</span>');
    assert.equal($html.html(), '<span>dddd</span>');

    test.innerHTML = '';
  });

  it('.text() - 获取或设置元素的文本', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="text">test</div>';

    var $text = $('#text');
    assert.equal($text.text(), 'test');

    $text.text('dddd');
    assert.equal($text.text(), 'dddd');

    test.innerHTML = '';
  });

  it('.attr() - 获取或设置元素的属性', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child" mdui="test"></div>';

    var $child = $('#child');

    // $().attr('key')
    assert.equal($child.attr('mdui'), 'test');

    // $().attr('key', 'value);
    $child.attr('mdui', 'value');
    assert.equal($child.attr('mdui'), 'value');

    // $().attr({'key1': 'value1', 'key2': 'value2'})
    $child.attr({
      key1: 'value1',
      'key2': 'value2'
    });
    assert.equal($child.attr('mdui'), 'value');
    assert.equal($child.attr('key1'), 'value1');
    assert.equal($child.attr('key2'), 'value2');

    test.innerHTML = '';
  });

  it('.prop() - 获取或设置属性值', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<input type="checkbox" id="child" checked />';

    // $().prop('key') // 获取属性值
    // $().prop('key', 'value')  // 设置属性值
    // $().prop({'key1': 'value1', 'key2': 'value2'}) // 设置多个属性值

    var $child = $('#child');

    assert.equal($child.prop('checked'), true);
    assert.equal($child.prop('disabled'), false);

    $child.prop('checked', false);
    $child.prop('disabled', true);

    assert.equal($child.prop('checked'), false);
    assert.equal($child.prop('disabled'), true);

    assert.equal($child.prop('test'), undefined);

    $child.prop('test', 'mdui');
    assert.equal($child.prop('test'), 'mdui');

    $child.prop({
      'checked': true,
      'disabled': false,
      'dddd': 'ffff'
    });

    assert.equal($child.prop('checked'), true);
    assert.equal($child.prop('disabled'), false);
    assert.equal($child.prop('dddd'), 'ffff');

    test.innerHTML = '';
  });

  it('.css() - 获取或设置 CSS', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="css" style="width: 100px;"></div>';

    var $css = $('#css');

    // $().css('key')  获取样式值
    assert.equal($css.css('width'), '100px');

    // $().css('key', 'value')   设置样式值
    $css.css('width', '200px');
    assert.equal($css.css('width'), '200px');

    // $().css({'key1': 'value1', 'key2': 'value2'})   同时设置多个样式值
    $css.css({
      'width': '100px',
      'height': '150px'
    });
    assert.equal($css.css('width'), '100px');
    assert.equal($css.css('height'), '150px');

    test.innerHTML = '';
  });

  it('.addClass() - 为每个元素添加类', function () {
    var test = document.getElementById("test");
    test.innerHTML = '<div id="foo">Goodbye</div>';

    var $div = $("#test div");
    assert.property($div, 'addClass');

    // 添加一个类
    $div.addClass('mdui');
    assert.isTrue($div[0].classList.contains('mdui'));

    // 添加多个类，用空格分隔
    $div.addClass('mdui1 mdui2');
    assert.isTrue($div[0].classList.contains('mdui1'));
    assert.isTrue($div[0].classList.contains('mdui2'));

    test.innerHTML = '';
  });

  it('.removeClass() - 移除元素上的类', function () {
    var test = document.getElementById("test");
    test.innerHTML = '<div class="mdui class1 class2">Goodbye</div>';

    var $div = $("#test div");
    assert.property($div, 'removeClass');

    // 移除一个类
    $div.removeClass('mdui');
    assert.isFalse($div[0].classList.contains('mdui'));
    assert.isTrue($div[0].classList.contains('class1'));
    assert.isTrue($div[0].classList.contains('class2'));

    // 移除多个类，用空格分隔
    $div.removeClass('class1 class2');
    assert.isFalse($div[0].classList.contains('class1'));
    assert.isFalse($div[0].classList.contains('class2'));

    test.innerHTML = '';
  });

  it('.toggleClass() - 添加或删除一个或多个类', function () {
    var test = document.getElementById("test")
    test.innerHTML = '<div class="mdui">Goodbye</div>';
    var $div = $("#test div");

    assert.property($div, 'toggleClass');

    // 切换一个类
    $div.toggleClass('box1');
    assert.isTrue($div.hasClass('mdui'));
    assert.isTrue($div.hasClass('box1'));

    // 切换多个类，用空格分隔
    $div.toggleClass('box1 box2');
    assert.isTrue($div.hasClass('mdui'));
    assert.isFalse($div.hasClass('box1'));
    assert.isTrue($div.hasClass('box2'));

    test.innerHTML = '';
  });

  it('.width() - 获取或设置元素的宽度', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child" style="width: 100px; height: 500px;display: block"><p>test</p></div>';

    var $child = $('#child');

    assert.equal($child.width(), 100);

    $child.width(10);
    assert.equal($child.width(), 10);

    $child.width('20');
    assert.equal($child.width(), 20);

    $child.width('30px');
    assert.equal($child.width(), 30);

    $child.width('');
    assert.notEqual($child.width(), 30);

    test.innerHTML = '';
  });

  it('.height() - 获取或设置元素的高度', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child" style="width: 100px; height: 500px;display: block"><p>test</p></div>';

    var $child = $('#child');

    assert.equal($child.height(), 500);

    $child.height(10);
    assert.equal($child.height(), 10);

    $child.height('20');
    assert.equal($child.height(), 20);

    $child.height('30px');
    assert.equal($child.height(), 30);

    $child.height('');
    assert.notEqual($child.height(), 30);

    test.innerHTML = '';
  });

  it('.innerWidth() - 获取元素的宽度，包含内边距', function () {

  });

  it('.innerHeight() - 获取元素的高度，包含内边距', function () {

  });

  it('.prev() - 获取前一个匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<p id="test1">test1</p>' +
      '<div id="test2">test2</div>' +
      '<p id="test3">test3</p>' +
      '<div>' +
        '<p>test</p>' +
        '<div id="test4">test4</div>' +
        '<p id="test5">test5</p>' +
        '<p id="test6">test6</p>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child1-1" class="child"></div>' +
        '<div id="child1-2" class="child"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child"></div>' +
        '<div id="child2-2" class="child"></div>' +
      '</div>';

    var $prevs = $('#test p').prev();
    assert.equal($prevs.length, 3);
    assert.isTrue($prevs.eq(0).is('#test2'));
    assert.isTrue($prevs.eq(1).is('#test4'));
    assert.isTrue($prevs.eq(2).is('#test5'));

    $prevs = $('#test6').prev('#test4');
    assert.equal($prevs.length, 0);

    $prevs = $('#test6').prev('#test5');
    assert.equal($prevs.length, 1);
    assert.isTrue($prevs.eq(0).is('#test5'));

    $prevs = $('#test5').prev();
    assert.equal($prevs.length, 1);
    assert.isTrue($prevs.eq(0).is('#test4'));

    $prevs = $('.child').prev();
    assert.equal($prevs.length, 2);
    assert.isTrue($prevs.eq(0).is('#child1-1'));
    assert.isTrue($prevs.eq(1).is('#child2-1'));

    test.innerHTML = '';
  });

  it('.prevAll() - 取得前面所有匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<p id="test1">test1</p>' +
      '<div id="test2">test2</div>' +
      '<p id="test3">test3</p>' +
      '<div>' +
        '<p id="test4">test</p>' +
        '<div id="test5">test5</div>' +
        '<p id="test6">test6</p>' +
        '<p id="test7">test7</p>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child1-1" class="child"></div>' +
        '<div id="child1-2" class="child"></div>' +
        '<div id="child1-3" class="child last"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child"></div>' +
        '<div id="child2-2" class="child last"></div>' +
      '</div>';

    var $prevs = $('#test3').prevAll();
    assert.equal($prevs.length, 2);
    assert.isTrue($prevs.eq(0).is('#test2'));
    assert.isTrue($prevs.eq(1).is('#test1'));

    $prevs = $('#test6').prevAll();
    assert.equal($prevs.length, 2);
    assert.isTrue($prevs.eq(0).is('#test5'));
    assert.isTrue($prevs.eq(1).is('#test4'));

    $prevs = $('#test6').prevAll('#test4');
    assert.equal($prevs.length, 1);
    assert.isTrue($prevs.eq(0).is('#test4'));

    $prevs = $('.last').prevAll('.child');
    assert.equal($prevs.length, 3);
    assert.isTrue($prevs.eq(0).is('#child2-1'));
    assert.isTrue($prevs.eq(1).is('#child1-2'));
    assert.isTrue($prevs.eq(2).is('#child1-1'));

    test.innerHTML = '';
  });

  it('.prevUntil() - 获取前面的所有元素，直到遇到匹配的元素，不包含匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<p id="test1">test1</p>' +
      '<p id="test2">test2</p>' +
      '<p id="test3">test3</p>' +
      '<p id="test4">test4</p>' +
      '<p id="test5">test5</p>' +
      '<div class="parent">' +
        '<div id="child1-1" class="child until"></div>' +
        '<div id="child1-2" class="child"></div>' +
        '<div id="child1-3" class="child"></div>' +
        '<div id="child1-4" class="child last"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child"></div>' +
        '<div id="child2-2" class="child last"></div>' +
      '</div>';

    var $prevs = $('#test5').prevUntil('#test2');
    assert.equal($prevs.length, 2);
    assert.isTrue($prevs.eq(0).is('#test4'));
    assert.isTrue($prevs.eq(1).is('#test3'));

    $prevs = $('.last').prevUntil('.until');
    assert.equal($prevs.length, 3);
    assert.isTrue($prevs.eq(0).is('#child2-1'));
    assert.isTrue($prevs.eq(1).is('#child1-3'));
    assert.isTrue($prevs.eq(2).is('#child1-2'));

    test.innerHTML = '';
  });

  it('.next() - 获取后一个匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<p id="test1">test1</p>' +
      '<div id="test2">test2</div>' +
      '<p id="test3">test3</p>' +
      '<div id="wrap">' +
        '<p>test</p>' +
        '<div id="test4">test4</div>' +
        '<p id="test5">test5</p>' +
        '<p id="test6">test6</p>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child1-1" class="child"></div>' +
        '<div id="child1-2" class="child"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child"></div>' +
        '<div id="child2-2" class="child"></div>' +
      '</div>';

    var $nexts = $('#test p').next();
    assert.equal($nexts.length, 4);
    assert.isTrue($nexts.eq(0).is('#test2'));
    assert.isTrue($nexts.eq(1).is('#wrap'));
    assert.isTrue($nexts.eq(2).is('#test4'));
    assert.isTrue($nexts.eq(3).is('#test6'));

    $nexts = $('#test4').next('#test6');
    assert.equal($nexts.length, 0);

    $nexts = $('#test4').next('#test5');
    assert.equal($nexts.length, 1);
    assert.isTrue($nexts.eq(0).is('#test5'));

    $nexts = $('#test4').next();
    assert.equal($nexts.length, 1);
    assert.isTrue($nexts.eq(0).is('#test5'));

    $nexts = $('.child').next();
    assert.equal($nexts.length, 2);
    assert.isTrue($nexts.eq(0).is('#child1-2'));
    assert.isTrue($nexts.eq(1).is('#child2-2'));

    test.innerHTML = '';
  });

  it('.nextAll() - 获取后面所有匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div class="parent">' +
        '<div id="child1-1" class="child"></div>' +
        '<div id="child1-2" class="child"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child"></div>' +
        '<div id="child2-2" class="child"></div>' +
      '</div>' +
      '<div>' +
        '<p id="test4">test</p>' +
        '<div id="test5">test5</div>' +
        '<p id="test6">test6</p>' +
        '<p id="test7">test7</p>' +
      '</div>' +
      '<p id="test1">test1</p>' +
      '<div id="test2">test2</div>' +
      '<p id="test3">test3</p>';

    var $nexts = $('#test1').nextAll();
    assert.equal($nexts.length, 2);
    assert.isTrue($nexts.eq(0).is('#test2'));
    assert.isTrue($nexts.eq(1).is('#test3'));

    $nexts = $('#test5').nextAll();
    assert.equal($nexts.length, 2);
    assert.isTrue($nexts.eq(0).is('#test6'));
    assert.isTrue($nexts.eq(1).is('#test7'));

    $nexts = $('#test5').nextAll('#test7');
    assert.equal($nexts.length, 1);
    assert.isTrue($nexts.eq(0).is('#test7'));

    $nexts = $('.child').nextAll();
    assert.equal($nexts.length, 2);
    assert.isTrue($nexts.eq(0).is('#child1-2'));
    assert.isTrue($nexts.eq(1).is('#child2-2'));

    test.innerHTML = '';
  });

  it('.nextUntil() - 获取后面的所有元素，直到遇到匹配的元素，不包括匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<p id="test1">test1</p>' +
      '<p id="test2">test2</p>' +
      '<p id="test3">test3</p>' +
      '<p id="test4">test4</p>' +
      '<p id="test5">test5</p>' +
      '<div class="parent">' +
        '<div id="child1-1" class="child first"></div>' +
        '<div id="child1-2" class="child"></div>' +
        '<div id="child1-3" class="child"></div>' +
        '<div id="child1-4" class="child"></div>' +
      '</div>' +
      '<div class="parent">' +
        '<div id="child2-1" class="child first"></div>' +
        '<div id="child2-2" class="child"></div>' +
      '</div>';

    var $nexts = $('#test1').nextUntil('#test4');
    assert.equal($nexts.length, 2);
    assert.isTrue($nexts.eq(0).is('#test2'));
    assert.isTrue($nexts.eq(1).is('#test3'));

    $nexts = $('.first').nextUntil('#child1-4');
    assert.equal($nexts.length, 3);
    assert.isTrue($nexts.eq(0).is('#child1-2'));
    assert.isTrue($nexts.eq(1).is('#child1-3'));
    assert.isTrue($nexts.eq(2).is('#child2-2'));

    test.innerHTML = '';
  });

  it('.parent() - 获取匹配的直接父元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child1">' +
        '<div id="child1-1" class="child2">' +
          '<div id="child1-1-1" class="child3"></div>' +
          '<div id="child1-1-2" class="child3"></div>' +
        '</div>' +
        '<div id="child1-2" class="child2"></div>' +
      '</div>' +
      '<div id="child2" class="child1">' +
        '<div id="child2-1" class="child2">' +
          '<div id="child2-1-1" class="child3"></div>' +
          '<div id="child2-1-2" class="child3"></div>' +
        '</div>' +
        '<div id="child2-2" class="child2"></div>' +
      '</div>';

    var $parent = $('#child1-1-1').parent();
    assert.equal($parent.length, 1);
    assert.isTrue($parent.eq(0).is('#child1-1'));

    $parent = $('.child3').parent();
    assert.equal($parent.length, 2);
    assert.isTrue($parent.eq(0).is('#child1-1'));
    assert.isTrue($parent.eq(1).is('#child2-1'));

    $parent = $('.child3').parent('#child2-1');
    assert.equal($parent.length, 1);
    assert.isTrue($parent.eq(0).is('#child2-1'));

    test.innerHTML = '';
  });

  it('.parents() - 获取所有匹配的父元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child1 parent">' +
        '<div id="child1-1" class="child2 parent">' +
          '<div id="child1-1-1" class="child3"></div>' +
          '<div id="child1-1-2" class="child3"></div>' +
        '</div>' +
        '<div id="child1-2" class="child2"></div>' +
      '</div>' +
      '<div id="child2" class="child1 parent">' +
        '<div id="child2-1" class="child2 parent">' +
          '<div id="child2-1-1" class="child3"></div>' +
          '<div id="child2-1-2" class="child3"></div>' +
        '</div>' +
        '<div id="child2-2" class="child2"></div>' +
      '</div>';

    var $parents = $('#child1-1-1').parents('#child1');
    assert.equal($parents.length, 1);
    assert.isTrue($parents.eq(0).is('#child1'));

    $parents = $('#child1-1-1').parents('.parent');
    assert.equal($parents.length, 2);
    assert.isTrue($parents.eq(0).is('#child1-1'));
    assert.isTrue($parents.eq(1).is('#child1'));

    $parents = $('.child3').parents('.parent');
    assert.equal($parents.length, 4);
    assert.isTrue($parents.eq(0).is('#child2-1'));
    assert.isTrue($parents.eq(1).is('#child2'));
    assert.isTrue($parents.eq(2).is('#child1-1'));
    assert.isTrue($parents.eq(3).is('#child1'));

    $parents = $('.child3').parents('.child1');
    assert.equal($parents.length, 2);
    assert.isTrue($parents.eq(0).is('#child2'));
    assert.isTrue($parents.eq(1).is('#child1'));

    test.innerHTML = '';
  });

  it('.parentsUntil() - 取得所有的父元素，直到遇到匹配的元素，不包含匹配的元素', function () {
    var test = document.getElementById('test');
    test.innerHTML =
      '<div id="child1" class="child1">' +
        '<div id="child1-1" class="child2">' +
          '<div id="child1-11">' +
            '<div id="child1-1-1" class="child3"></div>' +
            '<div id="child1-1-2" class="child3"></div>' +
          '</div>' +
        '</div>' +
        '<div id="child1-2" class="child2"></div>' +
      '</div>' +
      '<div id="child2" class="child1">' +
        '<div id="child2-1" class="child2">' +
          '<div id="child2-11">' +
            '<div id="child2-1-1" class="child3"></div>' +
            '<div id="child2-1-2" class="child3"></div>' +
          '</div>' +
        '</div>' +
        '<div id="child2-2" class="child2"></div>' +
      '</div>';

    var $parents = $('#child1-1-1').parentsUntil('#child1');
    assert.equal($parents.length, 2);
    assert.isTrue($parents.eq(0).is('#child1-11'));
    assert.isTrue($parents.eq(1).is('#child1-1'));

    $parents = $('.child3').parentsUntil('.child1');
    assert.equal($parents.length, 4);
    assert.isTrue($parents.eq(0).is('#child2-11'));
    assert.isTrue($parents.eq(1).is('#child2-1'));
    assert.isTrue($parents.eq(2).is('#child1-11'));
    assert.isTrue($parents.eq(3).is('#child1-1'));

    test.innerHTML = '';
  });

  it('.append() - 在选中元素内部的后面添加内容', function () {
    var test = document.getElementById('test');

    // 追加纯文本
    test.innerHTML = '<p class="first">first</p>';
    $('.first').append('dd');
    assert.equal(test.innerHTML, '<p class="first">firstdd</p>');

    // 追加 HTML
    test.innerHTML = '<p class="first">first</p>';
    $('.first').append('<i>icon</i><i>icon2</i>');
    assert.equal(test.innerHTML, '<p class="first">first<i>icon</i><i>icon2</i></p>');

    // 同时追加纯文本和 HTML
    test.innerHTML = '<p class="first">first</p>';
    $('.first').append('dd<i>icon</i><i>icon2</i>');
    assert.equal(test.innerHTML, '<p class="first">firstdd<i>icon</i><i>icon2</i></p>');

    // 特殊标签中追加 HTML
    test.innerHTML = '<table><tbody class="first"></tbody></table>';
    $('.first').append('<tr><td>11</td></tr>');
    assert.equal(test.innerHTML, '<table><tbody class="first"><tr><td>11</td></tr></tbody></table>');

    // 追加 JQ 对象
    test.innerHTML =
      '<p class="first">first1</p>' +
      '<p class="second">second</p>' +
      '<p class="first">first2</p>';
    $('.second').append($('.first'));
    assert.equal(test.innerHTML, '<p class="second">second<p class="first">first1</p><p class="first">first2</p></p>');

    test.innerHTML =
      '<p class="first">first1</p>' +
      '<p class="second">second1</p>' +
      '<p class="first">first2</p>' +
      '<p class="second">second2</p>';
    $('.second').append($('.first'));
    assert.equal(test.innerHTML,
      '<p class="second">second1<p class="first">first1</p><p class="first">first2</p></p>' +
      '<p class="second">second2<p class="first">first1</p><p class="first">first2</p></p>');

    // 追加 DOM 元素
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').append($('.second')[0]);
    assert.equal(test.innerHTML,
      '<p class="first">first<p class="second">second1</p></p>' +
      '<p class="second">second2</p>');

    // 追加 DOM 数组
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').append($('.second').get());
    assert.equal(test.innerHTML,
      '<p class="first">first<p class="second">second1</p><p class="second">second2</p></p>');

    // 追加 NodeList
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').append(document.querySelectorAll('.second'));
    assert.equal(test.innerHTML,
      '<p class="first">first<p class="second">second1</p><p class="second">second2</p></p>');

    test.innerHTML = '';
  });

  it('.prepend() - 在选中元素内部的前面添加内容', function () {
    var test = document.getElementById('test');

    // 前置纯文本
    test.innerHTML = '<p class="first">first</p>';
    $('.first').prepend('dd');
    assert.equal(test.innerHTML, '<p class="first">ddfirst</p>');

    // 前置 HTML
    test.innerHTML = '<p class="first">first</p>';
    $('.first').prepend('<i>icon</i><i>icons</i>');
    assert.equal(test.innerHTML, '<p class="first"><i>icon</i><i>icons</i>first</p>')

    // 前置 HTML 和纯文本
    test.innerHTML = '<p class="first">first</p>';
    $('.first').prepend('dd<i>icon</i><i>icons</i>');
    assert.equal(test.innerHTML, '<p class="first">dd<i>icon</i><i>icons</i>first</p>');

    // 前置 JQ 对象
    test.innerHTML =
      '<p class="first">first1</p>' +
      '<p class="second">second</p>' +
      '<p class="first">first2</p>';
    $('.second').prepend($('.first'));
    assert.equal(test.innerHTML, '<p class="second"><p class="first">first1</p><p class="first">first2</p>second</p>');

    test.innerHTML =
      '<p class="first">first1</p>' +
      '<p class="second">second1</p>' +
      '<p class="first">first2</p>' +
      '<p class="second">second2</p>';
    $('.second').prepend($('.first'));
    assert.equal(test.innerHTML,
      '<p class="second"><p class="first">first1</p><p class="first">first2</p>second1</p>' +
      '<p class="second"><p class="first">first1</p><p class="first">first2</p>second2</p>');

    // 前置 DOM 元素
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').prepend($('.second')[0]);
    assert.equal(test.innerHTML,
      '<p class="first"><p class="second">second1</p>first</p>' +
      '<p class="second">second2</p>');

    // 前置 DOM 数组
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').prepend($('.second').get());
    assert.equal(test.innerHTML,
      '<p class="first"><p class="second">second1</p><p class="second">second2</p>first</p>');

    // 前置 NodeList
    test.innerHTML =
      '<p class="first">first</p>' +
      '<p class="second">second1</p>' +
      '<p class="second">second2</p>';
    $('.first').prepend(document.querySelectorAll('.second'));
    assert.equal(test.innerHTML,
      '<p class="first"><p class="second">second1</p><p class="second">second2</p>first</p>');

    test.innerHTML = '';
  });

  it('.insertBefore() - 把选中元素添加到另一个指定元素的前面', function () {
    var test = document.getElementById('test');

    // 新建一个元素，并添加到指定元素前面
    test.innerHTML = '<div>item</div>';
    $('<p>test</p>').insertBefore('#test div');
    assert.equal(test.innerHTML, '<p>test</p><div>item</div>');

    // 把一个已有元素添加到另一个元素前面
    test.innerHTML =
      '<div class="first">first</div>' +
      '<div class="second">second</div>';
    $('.second').insertBefore('.first');
    assert.equal(test.innerHTML, '<div class="second">second</div><div class="first">first</div>');

    test.innerHTML = '';
  });

  it('.insertAfter() - 把选中元素添加到另一个指定元素的后面', function () {
    var test = document.getElementById('test');

    // 新建一个元素，并添加到指定元素的后面
    test.innerHTML = '<div>item</div>';
    $('<p>test</p>').insertAfter('#test div');
    assert.equal(test.innerHTML, '<div>item</div><p>test</p>');

    // 把一个已有元素添加到另一个元素前面
    test.innerHTML =
      '<div class="first">first</div>' +
      '<div class="second">second</div>';
    $('.first').insertAfter('.second');
    assert.equal(test.innerHTML, '<div class="second">second</div><div class="first">first</div>');

    test.innerHTML = '';
  });

  it('.appendTo() - 把选中元素添加到另一个指定元素内部的后面', function () {
    // 该方法直接调用 .append() 实现，.append() 通过即可
  });

  it('.prependTo() - 把选中元素添加到另一个指定元素内部的前面', function () {
    // 该方法直接调用 .prepend() 实现，.prepend() 通过即可
  });

  it('.before() - 在选中元素的前面添加指定内容', function () {
    // 该方法直接调用 .insertBefore() 实现，.insertBefore() 通过即可
  });

  it('.after() - 在选中元素的后面添加指定内容', function () {
    // 该方法直接调用 .insertAfter() 实现，.insertAfter() 通过即可
  });

  it('.replaceAll() - 替换掉指定元素', function () {
    // .replaceWith() 通过即可
  });
});
