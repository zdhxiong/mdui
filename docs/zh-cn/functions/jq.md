mdui 内置了一个轻量的 JavaScript 工具库，它拥有和 jQuery 类似的 api 和 jQuery 风格的链式调用，但体积仅为 jQuery 的六分之一。

你可以按需导入该工具函数：

```js
import { $ } from 'mdui/jq.js';
```

## 核心 {#api-core}

### `$()` {#dollar}

该函数有多种用法：

可以传入一个 CSS 选择器作为参数，返回包含匹配元素的 JQ 对象。

```js
$('.box');
```

可以传入 DOM 元素、任意数组、NodeList、JQ 对象，返回包含指定元素的 JQ 对象。

```js
$(document);
```

可以传入 HTML 字符串，返回包含根据 HTML 创建的 DOM 的 JQ 对象。

```js
$(`<div id="wrapper">
  <span id="inner"></span>
</div>`);
```

可以传入一个函数，在 DOM 加载完毕后会调用该函数。

```js
$(function () { console.log('DOM Loaded') });
```

## 扩展 {#api-extend}

### `$.extend()` {#d-extend}

如果只传入一个对象，该对象中的属性将合并到 `$` 对象中，相当于在 `$` 的命名空间下添加新的功能。

```js
$.extend({
  customFunc: function () {}
});

// 然后就可以这样调用自定义方法了
$.customFunc();
```

如果传入了两个或更多个对象，所有对象的属性都添加到第一个对象，并返回合并后的对象。不过值为 `undefined` 的属性不会合并。

```js
const object = $.extend(
  { key1: val1 },
  { key2: val2 },
  { key3: val3 }
);

// 此时第一个对象和返回值都是 { key1: val1, key2: val2, key3: val3 }
```

### `$.fn.extend()` {#fn-extend}

在 `$` 的原型链上扩展方法。

```js
$.fn.extend({
  customFunc: function () {}
});

// 然后就可以这样使用扩展的方法了
$(document).customFunc();
```

## URL {#api-url}

### `$.param()` {#d-param}

将数组或对象序列化，序列化后的字符串可作为 URL 查询字符串使用。

```js
$.param({ width: 1680, height: 1050 });
// width=1680&height=1050

$.param({ foo: { one: 1, two: 2 } });
// foo[one]=1&foo[two]=2

$.param({ ids: [1, 2, 3] });
// ids[]=1&ids[]=2&ids[]=3
```

若传入参数是一个数组，则该数组格式必须与 [`.serializeArray()`](#serializeArray) 的返回格式一致。

```js
$.param([
  { "name": "name", "value": "mdui" },
  { "name": "password", "value": "123456" }
]);
// name=mdui&password=123456
```

## 数组对象操作 {#api-array}

### `$.each()` {#d-each}

遍历数组或对象。返回值为第一个参数，即被遍历的数组或对象。

回调函数的第一个参数为数组的索引位置、或对象的键；第二个参数为数组或对象对应位置的值。

回调函数中的 `this` 指向数组或对象对应位置的值。若回调函数返回 `false`，则停止遍历。

```js
// 遍历一个数组
$.each(['a', 'b', 'c'], function (index, value) {
  console.log(index + ':' + value);
});

// 结果：
// 0:a
// 1:b
// 2:c
```

```js
// 遍历一个对象
$.each({'name': 'mdui', 'lang': 'zh'}, function (key, value) {
  console.log(key + ':' + value);
});

// 结果
// name:mdui
// lang:zh
```

### `$.merge()` {#d-merge}

把第二个数组的元素追加到第一个数组中，并返回合并后的数组。

```js
const first = ['a', 'b', 'c'];
const second = ['c', 'd', 'e'];
const result = $.merge(first, second);

console.log(first); // ['a', 'b', 'c', 'c', 'd', 'e']
console.log(result); // ['a', 'b', 'c', 'c', 'd', 'e']
```

### `$.unique()` {#d-unique}

过滤掉数组中的重复元素。

```js
const result = $.unique([1, 2, 12, 3, 2, 1, 2, 1, 1, 1, 1]);
console.log(result); // [1, 2, 12, 3]
```

### `$.map()` {#d-map}

遍历数组或对象，返回由函数的返回值组成的新数组。

函数的第一个参数为数组或对象对应位置的值，第二个参数为数组的索引位置、或对象的键。

函数可以返回任何值，若函数返回的是数组，则会被展开；若返回的是 `null` 或 `undefined`，则会被忽略。函数内部的 `this` 指向 `window` 对象。

```js
// 遍历数组
const result = $.map(['a', 'b', 'c'], function (value, index) {
  return index + value;
});
console.log(result); // ['0a', '1b', '2c']
```

```js
// 回调函数返回数组时，会被展开
const result = $.map([1, 2, 3], function (value, index) {
  return [value, value + 1];
});
console.log(result); // [1, 2, 2, 3, 3, 4]
```

```js
// 遍历对象
const result = $.map({ name: 'mdui', password: '123456' }, function (value, key) {
  return key + ':' + value;
});
console.log(result); // ['name:mdui', 'password:123456']
```

### `$.contains()` {#d-contains}

判断父节点是否包含子节点，返回布尔值。

```js
$.contains(document, document.body); // true
$.contains(document.body, document); // false
```

## 数据类型判断 {#api-type}

### `.is()` {#is}

如果集合中至少有一个元素和参数匹配，则返回 `true`，否则返回 `false`。

参数可以是 CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象、或回调函数。

参数为回调函数时，函数的第一个参数为索引位置，第二个参数为当前元素，`this` 指向当前元素。若函数返回 `true`，则表示和当前元素匹配；若返回 `false`，表示和当前元素不匹配。

```js
$('.box').is('.box'); // true
$('.box').is('.boxss'); // false
$('.box').is($('.box')[0]); // true
```

```js
// 通过回调函数的返回值做判断
$(document).is(function (index, element) {
  return element === document;
});
// true
```

## 对象访问 {#api-object}

### `.length` {#length}

返回当前集合中元素的数量。

```js
$('body').length; // 1
```

### `.each()` {#each}

遍历当前集合，为集合中每一个元素执行一个函数。如果函数返回 `false`，则结束遍历。

函数的第一个参数为元素的索引位置，第二个参数为当前元素。函数中的 `this` 指向当前元素。

```js
$('img').each(function(index, element) {
  this.src = 'test' + index + '.jpg';
});
```

### `.map()` {#map}

遍历当前集合，为集合中的每个元素执行一个函数，返回由函数返回值组成的新集合。

函数可以返回单个数据或数据数组。若返回数组，则会将数组中的元素依次添加到新集合中。若函数返回 `null` 或 `undefined` 则不会添加到新集合中。

函数的第一个参数为元素的索引位置，第二个参数为当前元素。函数的 `this` 指向当前元素。

```js
const result = $('input.checked').map(function (i, element) {
  return element.value;
});

// result 为匹配元素的值组成的 JQ 对象
```

### `.eq()` {#eq}

返回仅包含指定索引位置的元素的集合。

```js
$('div').eq(0); // 返回仅包含第一个元素的集合
$('div').eq(-1); // 返回仅包含最后一个元素的集合
$('div').eq(-2); // 返回仅包含倒数第二个元素的集合
```

### `.first()` {#first}

返回当前集合中第一个元素的集合。

```js
$('div').first(); // 返回仅包含第一个 div 的集合
```

### `.last()` {#last}

返回当前集合中最后一个元素的集合。

```js
$('div').last(); // 返回仅包含最后一个 div 的集合
```

### `.get()` {#get}

返回指定索引位置的元素。若未传入参数，则返回集合中所有元素组成的数组。

```js
$('div').get(); // 返回所有 div 元素组成的数组
$('div').get(0); // 返回第一个 div 元素
$('div').get(-1); // 返回最后一个 div 元素
```

### `.index()` {#index}

如果没有传入参数，则返回当前集合中第一个元素相对于同辈元素的索引值。

如果传入一个 CSS 选择器作为参数，则返回当前集合中第一个元素相对于 CSS 选择器匹配元素的索引值。

如果传入一个 DOM 元素，则返回该 DOM 元素在当前集合中的索引值。

如果传入一个 JQ 对象，则返回对象中第一个元素在当前集合中的索引值。

```html
<div id="child">
  <div id="child1"></div>
  <div id="child2"></div>
  <div id="child3"></div>
  <div id="child4"></div>
</div>
```

```js
$('#child3').index(); // 2
$('#child3').index('#child div'); // 2
$('#child div').index($('#child3').get(0)); // 2
```

### `.slice()` {#slice}

返回当前集合的子集。

第一个参数为子集的起始位置，第二个参数为子集的结束位置（不包含结束位置的元素）；若未传入第二个参数，表示包含从起始位置到结尾的所有元素。

```js
// 返回集合中第三个（包含第三个）之后的所有元素
$('div').slice(3);

// 返回集合中第三个到第五个（包含第三个，不包含第五个）之间的元素
$('div').slice(3, 5);
```

### `.filter()` {#filter}

从当前集合中筛选出与指定表达式匹配的元素。

参数可以是 CSS 选择器、DOM 元素、DOM 元素数组、回调函数。

参数为回调函数时，回调函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素。回调函数返回 `true` 时，当前元素会被保留；返回 `false` 时，当前元素会被移除。

```js
// 筛选出所有含 .box 的 div 元素
$('div').filter('.box');

// 筛选出所有已选中选项
$('#select option').filter(function (index, element) {
  return element.selected;
});
```

### `.not()` {#not}

从当前集合中筛选出与指定表达式不匹配的元素。

参数可以是 CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象、或返回 `boolean` 值的回调函数。

参数为回调函数时，回调函数的第一个参数为元素的索引位置，第二个参数为当前元素，`this` 指向当前元素。回调函数返回 `true` 时，将移除当前元素；返回 `false` 时，将保留当前元素。

```js
// 筛选出所有不含 .box 类的 div 元素
$('div').not('.box');

// 筛选出所有未选中选项
$('#select option').not(function (index, element) {
  return element.selected;
});
```

## CSS 类 {#api-css}

### `.hasClass()` {#hasClass}

判断集合中的第一个元素是否含有指定 CSS 类。

```js
// 判断第一个 div 元素是否含有 .item
$('div').hasClass('item');
```

### `.addClass()` {#addClass}

为集合中的每个元素添加 CSS 类，多个类名之间可以用空格分隔。

参数可以是字符串；也可以是一个返回 CSS 类名的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的 CSS 类名，函数中的 `this` 指向当前元素。

```js
// 为所有 div 元素添加 .item
$('div').addClass('item');

// 为所有 div 元素添加 .item1 和 .item2
$('div').addClass('item1 item2');

// 为所有 div 元素添加由回调函数返回的 CSS 类
$('div').addClass(function (index, currentClassName) {
  return currentClassName + '-' + index;
});
```

### `.removeClass()` {#removeClass}

移除集合中每个元素上的指定 CSS 类，多个类名之间可以用空格分隔。

参数可以是字符串；也可以是一个返回 CSS 类名的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的 CSS 类名，函数中的 `this` 指向当前元素。

若没有传入参数，则将直接移除元素上的 `class` 属性。

```js
// 移除所有 div 元素上的 .item
$('div').removeClass('item');

// 移除所有 div 元素上的 .item1 和 .item2
$('div').removeClass('item1 item2');

// 移除所有 div 元素上的由回调函数返回的 CSS 类
$('div').removeClass(function (index, currentClassName) {
  return 'item';
});
```

### `.toggleClass()` {#toggleClass}

元素上的 CSS 类，有则删除，无则添加。多个类名之间可以用空格分隔。

参数可以是字符串；也可以是一个返回 CSS 类名的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的 CSS 类名，函数中的 `this` 指向当前元素。

```js
// 切换所有 div 元素上的 .item
$('div').toggleClass('item');

// 切换所有 div 元素上的 .item1 和 .item2
$('div').toggleClass('item1 item2');

// 切换所有 div 元素上的由回调函数返回的 CSS 类
$('div').toggleClass(function (index, currentClassName) {
  return 'item';
});
```

## 节点属性 {#api-attr}

### `.prop()` {#prop}

获取集合中第一个元素的 JavaScript 属性值。

```js
// 获取第一个元素的属性值
$('input').prop('checked');
```

也可以通过该方法设置集合中所有元素的 JavaScript 属性值。

属性值可以是任意类型的值，或回调函数的返回值。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的属性值，函数内的 `this` 指向当前元素。

若属性值或回调函数的返回值为 `undefined`，则不会修改原有属性。

```js
// 设置所有选中元素的属性值
$('input').prop('checked', true);

// 通过回调函数的返回值设置属性值
$('input').prop('checked', function (index, oldPropValue) {
  return true;
});
```

也可以通过传入对象来同时设置多个属性。

```js
// 同时设置元素的多个属性值
$('input').prop({
  checked: false,
  disabled: function (index, oldPropValue) {
    return true;
  }
});
```

### `.removeProp()` {#removeProp}

删除集合中所有元素上指定的 JavaScript 属性值。

```js
$('input').removeProp('disabled');
```

### `.attr()` {#attr}

获取集合中第一个元素的 HTML 属性值

```js
// 获取第一个元素的属性值
$('div').attr('username');
```

也可以通过该方法设置集合中所有元素的 HTML 属性值。

属性值可以是字符串或数值，或回调函数的返回值。回调函数的第一个参数为元素的索引位置，第二个参数为该元素上原有的属性值，函数内的 `this` 指向当前元素。

若属性值或回调函数的返回值为 `null`，则删除指定属性、若为 `undefined`，则不会修改原有属性。

```js
// 设置所有选中元素的属性值
$('div').attr('username', 'mdui');

// 通过回调函数的返回值设置属性值
$('div').attr('username', function (index, oldAttrValue) {
  return 'mdui';
});
```

也可以通过传入对象来同时设置多个属性。

```js
// 同时设置元素的多个属性值
$('div').attr({
  username: 'mdui',
  lastname: function (index, oldAttrValue) {
    return 'test';
  }
});
```

### `.removeAttr()` {#removeAttr}

删除集合中所有元素上指定的属性，多个属性名之间可以用空格分隔。

```js
// 删除集合中所有元素上的一个属性
$('div').removeAttr('username');

// 删除集合中所有元素上的多个属性
$('div').removeAttr('username lastname');
```

### `.val()` {#val}

获取集合中第一个元素的值。

若元素是 `<select multiple="multiple">`，则将返回一个包含每个选择项的数组。

```js
// 获取选中的第一个元素的值
$('#input').val();
```

也可以用该方法设置集合中所有元素的值。

值可以是字符串、数值、字符串数组、或回调函数。

若值为回调函数，第一个参数为元素的索引位置，第二个参数为元素的原有的值，函数中的 `this` 指向当前元素。

若元素为 `<input type="checkbox">`、`<input type="radio">`、`<option>`，则元素值、或函数返回值可以为数组，此时将选中值在数组中的元素，并取消值不在数组中的元素。

若值、或函数返回值为 `undefined`，则会将元素值设为空。

```js
// 设置选中元素的值
$('#input').val('mdui');

// 通过回调函数的返回值设置元素值
$('#input').val(function (index, oldValue) {
  return 'mdui';
});
```

### `.text()` {#text}

获取集合中所有元素的文本内容（包含它们的后代元素）。

```js
// 获取所有 .box 元素的文本
$('.box').text();
```

也可以用该方法设置集合中所有元素的文本。

值可以是字符串、数值、布尔值、或回调函数。

若为回调函数，第一个参数为元素的索引位置，第二个参数为元素原有的文本内容，函数内的 `this` 指向当前元素。

若设置的值、或回调函数返回值为 `undefined`，则不修改对应元素的文本。

```js
// 设置选中元素的文本内容
$('.box').text('text content');

// 通过回调函数的返回值设置元素的文本内容
$('.box').text(function (index, oldTextContent) {
  return 'new text content';
});
```

### `.html()` {#html}

获取集合中第一个元素的 HTML 内容。

```js
// 获取第一个 .box 元素的 HTML 内容
$('.box').html();
```

也可以用该方法设置集合中所有元素的 HTML 内容。

值可以是 HTML 字符串、DOM 元素、或回调函数（需返回 HTML 字符串、或 DOM 元素）。

若为回调函数，第一个参数为元素的索引位置，第二个参数为元素原有的 HTML 内容，函数内的 `this` 指向当前元素。

若设置的值、或函数返回值为 `undefined`，则不修改对应元素的 HTML。

```js
// 设置选中元素的 HTML
$('.box').html('<div>new html content</div>');

// 通过回调函数的返回值设置元素的 HTML 内容
$('.box').html(function (index, oldHTMLContent) {
  return '<div>new html content</div>';
});
```

## 数据存储 {#api-data}

### `$.data()` {#d-data}

在指定元素上读取或存储数据。

存储数据时，若值为 `undefined`，则相当于读取元素上对应的数据。即 `$.data(element, 'key', undefined)` 和 `$.data(element, 'key')` 等效。

注意：该方法不会检索元素上的 `data-*` 属性。

```js
// 在指定元素上存储数据，返回存储的值
$.data(document.body, 'layout', 'dark'); // 返回 dark

// 在指定元素上同时存储多个数据
$.data(document.body, {
  primary: 'indigo',
  accent: 'pink',
}); // 返回 { primary: 'indigo', accent: 'pink' }

// 获取在指定元素上存储的数据
$.data(document.body, 'layout'); // 返回 dark

// 获取在指定元素上存储的所有数据
$.data(document.body); // 返回 { layout: 'dark', primary: 'indigo', accent: 'pink' }
```

### `$.removeData()` {#d-removeData}

移除指定元素上存储的数据。

多个键名可以用空格分隔，也可以用数组表示多个键名。未指定键名时，将移除元素上的所有数据。

```js
// 移除元素上键名为 name 的数据
$.removeData(document.body, 'name');

// 移除元素上键名为 name1 和 name2 的数据。下面两种方法等效：
$.removeData(document.body, 'name1 name2');
$.removeData(document.body, ['name1', 'name2']);

// 移除元素上存储的所有数据
$.removeData(document.body);
```

### `.data()` {#data}

在当前集合的元素上读取或存储数据。

存储数据时，若值为 `undefined`，则不进行存储。

注意：该方法检索的数据会包含元素上的 `data-*` 属性。

```js
// 在当前集合中的元素上存储数据
$('.box').data('layout', 'dark');

// 在当前集合中的元素上同时存储多个数据
$('.box').data({
  primary: 'indigo',
  accent: 'pink',
});

// 获取当前集合中第一个元素上存储的指定数据
$('.box').data('layout'); // 返回 dark

// 获取在当前集合中第一个元素上存储的所有数据
$('.box').data(); // 返回 { layout: 'dark', primary: 'indigo', accent: 'pink' }
```

### `.removeData()` {#removeData}

移除当前集合的元素上存储的数据。

多个键名可以用空格分隔，也可以用数组表示多个键名。未指定键名时，将移除元素上的所有数据。

注意：该方法只会移除通过 `.data()` 方法设置的数据，不会移除 `data-*` 属性上的数据。

```js
// 移除键名为 name 的数据
$('.box').removeData('name');

// 移除键名为 name1 和 name2 的数据。下面两种方法等效：
$('.box').removeData('name1 name2');
$('.box').removeData(['name1', 'name2']);

// 移除元素上存储的所有数据
$('.box').removeData();
```

## 样式 {#api-style}

### `.css()` {#css}

获取集合中第一个元素的 CSS 属性值。

```js
$('.box').css('color');
```

也可以用该方法设置集合中所有元素的 CSS 属性值。

属性值可以是字符串、数值、或一个返回字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的 CSS 属性值，函数中的 `this` 指向当前元素。

若属性值或回调函数返回 `undefined`，则不对当前元素的 CSS 属性值进行修改；若为 `null`，则移除当前元素的对应 CSS 属性；若为数值，则会添加 `px` 作为单位，若该属性无法使用 `px` 作为单位，则会直接把值转为字符串。

```js
// 设置集合中所有元素的样式值
$('.box').css('color', 'red')

// 通过回调函数的返回值设置所有元素的样式值
$('.box').css('color', function (index, oldCSSValue) {
  return 'green';
});

也可以通过传入一个键值对对象，来同时设置多个 CSS 属性。

// 通过传入一个对象同时设置多个样式
$('.box').css({
  'background-color': 'white',
  color: function (index, oldCSSValue) {
    return 'blue';
  },
});
```

### `.width()` {#width}

获取集合中第一个元素的宽度（像素值），不包含 `padding`, `border`, `margin` 的宽度。

```js
$('.box').width();
```

也可以用该方法设置集合中所有元素的宽度（不包含 `padding`, `border`, `margin` 的宽度）。

值可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的宽度值，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的宽度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的宽度
$('.box').width('20%');

// 值为数值时，默认单位为 px
$('.box').width(10);

// 通过回调函数的返回值设置宽度
$('.box').width(function (index, oldWidth) {
  return 10;
});
```

### `.height()` {#height}

获取集合中第一个元素的高度（像素值），不包含 `padding`, `border`, `margin` 的高度。

```js
$('.box').height();
```

也可以用该方法设置集合中所有元素的高度（不包含 `padding`, `border`, `margin` 的宽度）。

值可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的高度值，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的高度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的高度
$('.box').height('20%');

// 值为数值时，默认单位为 px
$('.box').height(10);

// 通过回调函数的返回值设置高度
$('.box').height(function (index, oldWidth) {
  return 10;
});
```

### `.innerWidth()` {#innerWidth}

获取集合中第一个元素的宽度（像素值），包含 `padding`，不包含 `border`, `margin` 的宽度。

```js
$('.box').innerWidth();
```

也可以用该方法设置集合中所有元素的宽度（像素值），包含 `padding`，不包含 `border`, `margin` 的宽度。

值可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的宽度值，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的宽度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的宽度
$('.box').innerWidth('20%');

// 值为数值时，默认单位为 px
$('.box').innerWidth(10);

// 通过回调函数的返回值设置宽度
$('.box').innerWidth(function (index, oldWidth) {
  return 10;
});
```

### `.innerHeight()` {#innerHeight}

获取集合中第一个元素的高度（像素值），包含 `padding`，不包含 `border`, `margin` 的高度。

```js
$('.box').innerHeight();
```

也可以用该方法设置集合中所有元素的高度（包含 `padding`，不包含 `border`, `margin` 的宽度）。

值可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素原有的高度值，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的高度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的高度
$('.box').innerHeight('20%');

// 值为数值时，默认单位为 px
$('.box').innerHeight(10);

// 通过回调函数的返回值设置高度
$('.box').innerHeight(function (index, oldHeight) {
  return 10;
});
```

### `.outerWidth()` {#outerWidth}

获取集合中第一个元素的宽度（像素值），包含 `padding`、`border` 的宽度，不包含 `margin` 的宽度。可以传入参数 `true`，使宽度包含 `margin` 的宽度。

```js
// 包含 padding、border 的宽度
$('.box').outerWidth();

// 包含 padding、border、margin 的宽度
$('.box').outerWidth(true);
```

也可以使用该方法设置集合中所有元素的宽度（包含 `padding`、`border`，不包含 `margin` 的宽度。可以在第二个参数中传入 `true`，使宽度包含 `margin` 的宽度）。

第一个参数可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素的原有宽度，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的宽度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的宽度
$('.box').outerWidth('20%');

// 值为数值时，默认单位为 px
$('.box').outerWidth(10);

// 第二个参数为 true，则宽度将包含 margin
$('.box').outerWidth(10, true);

// 通过回调函数的返回值设置宽度
$('.box').outerWidth(function (index, oldWidth) {
  return 10;
});
```

### `.outerHeight()` {#outerHeight}

获取集合中第一个元素的高度（像素值），包含 `padding`、`border` 的高度，不包含 `margin` 的高度。可以传入参数 `true`，使高度包含 `margin` 的高度。

```js
// 包含 padding、border 的高度
$('.box').outerHeight();

// 包含 padding、border、margin 的高度
$('.box').outerHeight(true);
```

也可以用该方法设置集合中所有元素的高度（包含 `padding`、`border`，不包含 `margin` 的高度。可以在第二个参数中传入 `true`，使高度包含 `margin` 的高度）。

第一个参数可以是带单位的字符串、数值、或返回带单位的字符串或数值的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素的原有高度，函数中的 `this` 指向当前元素。

若值、或回调函数的返回值为 `null` 或 `undefined`，则不修改元素的高度；若为数值，则会自动添加 `px` 作为单位。

```js
// 设置集合中所有元素的高度
$('.box').outerHeight('20%');

// 值为数值时，默认单位为 px
$('.box').outerHeight(10);

// 第二个参数为 true，则高度将包含 margin
$('.box').outerHeight(10, true);

// 通过回调函数的返回值设置高度
$('.box').outerHeight(function (index, oldWidth) {
  return 10;
});
```

### `.hide()` {#hide}

隐藏集合中所有元素。

```js
$('.box').hide();
```

### `.show()` {#show}

显示集合中的所有元素。

```js
$('.box').show();
```

### `.toggle()` {#toggle}

切换集合中所有元素的显示状态。

```js
$('.box').toggle();
```

### `.offset()` {#offset}

获取当前集合中第一个元素相对于 `document` 的坐标。

```js
$('.box').offset(); // { top: 20, left: 30 }
```

也可以用该方法设置集合中所有元素相对于 `document` 的坐标。

参数为一个包含 `top` 和 `left` 属性的对象，或一个返回此格式对象的回调函数。回调函数的第一个参数为元素的索引位置，第二个参数为元素的原有坐标，函数中的 `this` 指向当前元素。

若参数中 `top` 或 `left` 的值为 `undefined`，则不修改对应的值。

```js
// 设置集合中所有元素的坐标
$('.box').offset({ top: 20, left: 30 });

// 通过回调函数的返回值设置元素的坐标
$('.box').offset(function (index, oldOffset) {
  return { top: 20, left: 30 };
});
```

### `.offsetParent()` {#offsetParent}

返回集合中第一个元素的用于定位的父元素。即父元素中第一个 `position` 为 `relative` 或 `absolute` 的元素。

```js
$('.box').offsetParent();
```

### `.position()` {#position}

获取集合中第一个元素相对于父元素的偏移。

```js
$('.box').position(); // { top: 20, left: 30 }
```

## 查找节点 {#api-selector}

### `.find()` {#find}

在当前集合的所有元素中，根据 CSS 选择器找到指定的后代节点的集合。

```js
// 找到 #box 的后代节点中，包含 .box 的节点集合
$('#box').find('.box')
```

### `.children()` {#children}

在当前集合的所有元素中，获取直接子元素组成的集合。可以传入一个 CSS 选择器作为参数，对子元素进行过滤。

```js
// 找到 #box 的所有直接子元素
$('#box').children();

// 找到 #box 的所有直接子元素中，包含 .box 的元素集合
$('#box').children('.box');
```

### `.has()` {#has}

在当前集合的所有元素中，筛选出含有指定子元素的元素。参数可以是 CSS 选择器或 DOM 元素。

```js
// 给含有 ul 的 li 加上背景色
$('li').has('ul').css('background-color', 'red');
```

### `.parent()` {#parent}

获取当前集合中，所有元素的直接父元素的集合。可以传入一个 CSS 选择器作为参数，仅返回与该参数匹配的父元素的集合。

```js
// 返回 .box 元素的直接父元素
$('.box').parent();

// 返回 .box 元素的直接父元素中含有 .parent 类的元素
$('.box').parent('.parent');
```

### `.parents()` {#parents}

获取当前集合中，所有元素的祖先元素的集合。可以传入一个 CSS 选择器作为参数，仅返回与该参数匹配的祖先元素的集合。

```js
// 返回 span 元素的所有祖先元素
$('span').parents();

// 返回 span 元素的所有是 p 元素的祖先元素
$('span').parents('p');
```

### `.parentsUntil()` {#parentsUntil}

获取当前集合中，每个元素的所有父辈元素，直到遇到和第一个参数匹配的元素为止（不包含匹配元素）。

第一个参数可以是 CSS 选择器、DOM 元素、JQ 对象。

可以传入第二个参数，必须是 CSS 选择器，表示仅返回和该参数匹配的元素。

若没有指定参数，则所有的祖先元素都将被匹配，即和 `.parents()` 效果一样。

```js
// 获取 .item 元素的所有祖先元素
$('.item').parentsUntil();

// 查找 .item 元素的所有父辈元素，直到遇到 .parent 元素为止
$('.item').parentsUntil('.parent');

// 获取 .item 元素的所有是 div 元素的祖先元素，直到遇到 .parent 元素为止
$('.item').parentsUntil('.parent', 'div');
```

### `.prev()` {#prev}

获取当前集合中所有元素的前一个同辈元素组成的集合。可以传入一个 CSS 选择器作为参数，仅获取和该参数匹配的同辈元素的集合。

```js
// 获取 .box 元素的前一个元素的集合
$('.box').prev();

// 获取 .box 元素的前一个 div 元素的集合
$('.box').prev('div');
```

### `.prevAll()` {#prevAll}

获取当前集合中，每个元素前面的所有同辈元素组成的集合。可以传入一个 CSS 选择器作为参数，仅获取和该参数匹配的同辈元素的集合。

```js
// 获取 .box 元素前面的所有同辈元素
$('.box').prevAll();

// 获取 .box 元素前面的所有含 .selected 的同辈元素
$('.box').prevAll('.selected');
```

### `.prevUntil()` {#prevUntil}

获取当前集合中，每个元素前面所有的同辈元素，直到遇到和第一个参数匹配的元素为止（不包含匹配元素）。

第一个参数可以是 CSS 选择器、DOM 元素、JQ 对象。可以传入第二个参数，必须是 CSS 选择器，表示仅返回和该参数匹配的元素。

若没有指定参数，则前面所有同辈元素都将被返回，即和 `.prevAll()` 效果一样。

```js
// 获取 .box 元素前面所有的同辈元素
$('.box').prevUntil();

// 获取 .box 元素前所有的同辈元素，直到遇到 .until 元素为止
$('.box').prevUntil('.until');

// 获取 .box 元素前面同辈的 div 元素，直到遇到 .until 元素为止
$('.box').prevUntil('.until', 'div');
```

### `.next()` {#next}

获取当前集合中所有元素的后一个同辈元素组成的集合。可以传入一个 CSS 选择器作为参数，仅获取和该参数匹配的同辈元素的集合。

```js
// 获取 .box 元素的后一个元素的集合
$('.box').next();

// 获取 .box 元素的后一个 div 元素的集合
$('.box').next('div');
```

### `.nextAll()` {#nextAll}

获取当前集合中，每个元素后面的所有同辈元素组成的集合。可以传入一个 CSS 选择器作为参数，仅获取和该参数匹配的同辈元素的集合。

```js
// 获取 .box 元素后面的所有同辈元素
$('.box').nextAll();

// 获取 .box 元素后面的所有含 .selected 的同辈元素
$('.box').nextAll('.selected');
```

### `.nextUntil()` {#nextUntil}

获取当前集合中，每个元素后面所有的同辈元素，直到遇到和第一个参数匹配的元素为止（不包含匹配元素）。

第一个参数可以是 CSS 选择器、DOM 元素、JQ 对象。可以传入第二个参数，必须是 CSS 选择器，表示仅返回和该参数匹配的元素。

若没有指定参数，则后面所有同辈元素都将被返回。即和 `.nextAll()` 效果一样。

```js
// 获取 .box 元素后面所有的同辈元素
$('.box').nextUntil();

// 获取 .box 元素后所有的同辈元素，直到遇到 .until 元素为止
$('.box').nextUntil('.until');

// 获取 .box 元素后面同辈的 div 元素，直到遇到 .until 元素为止
$('.box').nextUntil('.until', 'div');
```

### `.closest()` {#closest}

从当前元素向上逐级匹配，返回最先匹配到的元素。参数可以是 CSS 选择器、DOM 元素、JQ 对象。

```js
// 获取 .box 元素的父元素中最近的 .parent 元素
$('.box').closest('.parent');
```

### `.siblings()` {#siblings}

获取当前集合中，每个元素的兄弟元素。可以传入一个 CSS 选择器作为参数，仅获取和该参数匹配的兄弟元素。

```js
// 获取 .box 元素的所有兄弟元素
$('.box').siblings();

// 获取 .box 元素的所有兄弟元素中含 .selected 的元素
$('.box').siblings('.selected');
```

### `.add()` {#add}

添加元素到当前集合中。参数可以是 HTML 字符串、CSS 选择器、JQ 对象、DOM 元素、DOM 元素数组、NodeList。

```js
// 把含 .selected 的元素添加到当前集合中
$('.box').add('.selected');
```

## 节点操作 {#api-dom}

### `.empty()` {#empty}

移除当前元素中所有的子元素。

```js
$('.box').empty();
```

### `.remove()` {#remove}

从 DOM 中移除当前集合中的元素。可以传入一个 CSS 选择器作为参数，仅移除与该参数匹配的元素。

```js
// 移除所有 p 元素
$('p').remove();

// 移除所有含 .box 的 p 元素
$('p').remove('.box');
```

### `.prepend()` {#prepend}

在当前集合的元素内部的前面插入指定内容。

参数类型可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。支持传入多个参数。

也可以传入一个返回 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象的回调函数。函数的第一个参数是当前元素的索引位置，第二个参数是元素的原始 HTML，函数中的 `this` 指向当前元素。

该方法返回原始集合。

```js
// 插入一个元素
$('<p>I would like to say: </p>').prepend('<b>Hello</b>');
// 结果：<p><b>Hello</b>I would like to say: </p>

// 插入多个元素
$('<p>I would like to say: </p>').prepend('<b>Hello</b>', '<b>World</b>');
// 结果：<p><b>Hello</b><b>World</b>I would like to say: </p>

// 通过回调函数插入一个元素
$('<p>Hello</p>').append(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// 结果：<p><b>Hello0</b>Hello</p>
```

### `.prependTo()` {#prependTo}

把当前集合中的元素追加到指定元素内部的前面。

参数可以是 CSS 选择器、HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。

该方法返回原始集合。

```js
$('<p>Hello</p>').prependTo('<p>I would like to say: </p>');
// 结果：[ <p><p>Hello</p>I would like to say: </p> ]
```

### `.append()` {#append}

在当前元素内部的后面插入指定内容。

参数类型可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。支持传入多个参数。

也可以传入一个返回 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象的回调函数，函数的第一个参数是当前元素的索引位置，第二个参数是元素的原始 HTML，函数中的 `this` 指向当前元素。

该方法返回原始集合。

```js
// 插入一个元素
$('<p>I would like to say: </p>').append('<b>Hello</b>');
// 结果：<p>I would like to say: <b>Hello</b></p>

// 插入多个元素
$('<p>I would like to say: </p>').append('<b>Hello</b>', '<b>World</b>');
// 结果：<p>I would like to say: <b>Hello</b><b>World</b></p>

// 通过回调函数插入一个元素
$('<p>Hello</p>').append(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// 结果：<p>Hello<b>Hello0</b></p>
```

### `.appendTo()` {#appendTo}

把当前集合中的元素追加到指定元素内部的后面。

参数可以是 CSS 选择器、HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。

该方法返回原始集合。

```js
$('<p>Hello</p>').appendTo('<p>I would like to say: </p>')
// 结果：<p>I would like to say: <p>Hello</p></p>
```

### `.after()` {#after}

在当前集合的元素后面插入指定内容，作为其兄弟节点。

参数类型可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。支持传入多个参数。

也可以传入一个返回 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象的回调函数，函数的第一个参数为当前元素的索引位置，第二个参数为元素的原始 HTML，函数中的 `this` 指向当前元素。

该方法返回原始集合。

```js
// 插入一个元素
$('<p>I would like to say: </p>').after('<b>Hello</b>');
// 结果：<p>I would like to say: </p><b>Hello</b>

// 插入多个元素
$('<p>I would like to say: </p>').after('<b>Hello</b>', '<b>World</b>');
// 结果：<p>I would like to say: </p><b>Hello</b><b>World</b>

// 通过回调函数插入一个元素
$('<p>Hello</p>').after(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// 结果：<p>Hello</p><b>Hello0</b>
```

### `.insertAfter()` {#insertAfter}

把当前集合中的元素插入到目标元素的后面，作为其兄弟元素。

如果当前集合中的元素是页面中已有的元素，则将移动该元素，而不是复制。如果有多个目标，则将克隆当前集合中的元素，并添加到每个目标元素的后面。

可以传入一个 HTML 字符串、CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象作为参数，来指定目标元素。

```js
$('<b>Hello</b>').insertAfter('<p>I would like to say: </p>');
// 结果：<p>I would like to say: </p><b>Hello</b>
```

### `.before()` {#before}

在当前集合的元素前面插入指定内容，作为其兄弟节点。

参数类型可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。支持传入多个参数。

也可以传入一个返回 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象的回调函数，函数的第一个参数为当前元素的索引位置，第二个参数为元素的原始 HTML，函数中的 `this` 指向当前元素。

该方法返回原始集合。

```js
// 插入一个元素
$('<p>I would like to say: </p>').before('<b>Hello</b>');
// 结果：<b>Hello</b><p>I would like to say: </p>

// 插入多个元素
$('<p>I would like to say: </p>').before('<b>Hello</b>', '<b>World</b>');
// 结果：<b>Hello</b><b>World</b><p>I would like to say: </p>

// 通过回调函数插入一个元素
$('<p>Hello</p>').before(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// 结果：<b>Hello0</b><p>Hello</p>
```

### `.insertBefore()` {#insertBefore}

把当前集合中的元素插入到目标元素的前面，作为其兄弟元素。

如果当前集合中的元素是页面中已有的元素，则将移动该元素，而不是复制。如果有多个目标，则将克隆当前集合中的元素，并添加到每个目标元素的后面。

可以传入一个 HTML 字符串、CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象作为参数，来指定目标元素。

```js
$('<p>I would like to say: </p>').insertBefore('<b>Hello</b>');
// 结果：<p>I would like to say: </p><b>Hello</b>
```

### `.replaceWith()` {#replaceWith}

用指定元素来替换当前集合中的元素。

参数可以是 HTML 字符串、DOM 元素、DOM 元素数组、JQ 对象。

也可以传入一个返回 HTML 字符串、DOM 元素、DOM元素数组、JQ 对象的回调函数，函数的第一个参数为当前元素的索引位置，第二个参数为元素的原始 HTML，函数中的 `this` 指向当前元素。

该方法返回原始集合，即被替换掉的集合。

```js
// 用 <p>Hello</p> 替换所有的 .box 元素
$('.box').replaceWith('<p>Hello</p>');

// 用回调函数的返回值替换所有 .box 元素
$('.box').replaceWith(function (index, oldHTML) {
  return oldHTML + index;
});
```

### `.replaceAll()` {#replaceAll}

用当前集合中的元素替换指定元素。

参数为被替换的元素，可以是 CSS 选择器、DOM 元素、DOM 元素数组、JQ 对象。

该方法返回原始集合，即用于替换的元素的集合。

```js
// 用 .new 元素替换所有 .box 元素
$('.new').replaceAll('.box');
```

### `.clone()` {#clone}

通过深度克隆来复制集合中的所有元素。

通过原生 `cloneNode` 方法深度克隆来复制集合中的所有元素。此方法不会有数据和事件处理程序复制到新的元素。这点和 jQuery 中利用一个参数来确定是否复制数据和事件处理不相同。

```js
$('body').append($("#box").clone())
```

## 表单 {#api-form}

### `.serializeArray()` {#serializeArray}

把表单元素的值组合成由 `name` 和 `value` 的键值对组成的数组。

该方法可对单独表单元素进行操作，也可以对整个 `<form>` 表单进行操作。

```js
$('form').serializeArray();
// [
//   { "name": "golang", "value":"456" },
//   { "name": "name", "value": "mdui" },
//   { "name": "password", "value": "" }
// ]
```

### `.serializeObject()` {#serializeObject}

把表单元素的值转换为对象。

若存在相同的键名，则对应的值会转为数组。

该方法可对单独表单元素进行操作，也可以对整个 `<form>` 表单进行操作。

```js
$('form').serializeObject()
// { name: mdui, password: 123456 }
```

### `.serialize()` {#serialize}

把表单元素的值编译为字符串。

```js
$('form').serialize();
// golang=456&name=mdui&password=
```

## 事件 {#api-event}

### `.on()` {#on}

为集合中每个元素的特定事件绑定事件处理函数。具体用法见下方示例：

```js
// 绑定点击事件
$('.box').on('click', function (e) {
  console.log('点击了 .box 元素');
});

// 绑定多个事件
$('.box').on('click focus', function (e) {
  console.log('click 和 focus 事件都会触发该函数');
});

// 事件委托
$(document).on('click', '.box', function (e) {
  console.log('点击 .box 时会触发该函数');
});

// 同时绑定多个事件和事件处理函数
$('.box').on({
  'click': function (e) {
    console.log('触发了 click 事件');
  },
  'focus': function (e) {
    console.log('触发了 focus 事件');
  }
});

// 传入参数
$('.box').on('click', { key1: 'value1', key2: 'value2' }, function (e) {
  console.log('点击了 .box 元素，并为事件处理函数传入了参数');
  // e._data 为 {key1: 'value1', key2: 'value2'}
});

// 同时绑定多个事件和事件处理函数，并传入参数
$('.box').on({
  'click': function (e) {
    console.log('触发了 click 事件');
    // e._data 为 {key1: 'value1', key2: 'value2'}
  },
  'focus': function (e) {
    console.log('触发了 focus 事件');
    // e._data 为 {key1: 'value1', key2: 'value2'}
  }
}, { key1: 'value1', key2: 'value2' });

// 通过事件委托绑定事件，并传入参数
$(document).on('click', '.box', { key1: 'value1', keys: 'value2' }, function (e) {
  console.log('点击了 .box 元素，并为事件处理函数传入了参数');
  // e._data 为 {key1: 'value1', key2: 'value2'}
});

// 通过事件委托同时绑定多个事件和事件处理函数
$(document).on({
  'click': function (e) {
    console.log('触发了 click 事件');
  },
  'focus': function (e) {
    console.log('触发了 focus 事件');
  }
}, '.box');

// 通过事件委托同时绑定多个事件和事件处理函数，并传入参数
$(document).on({
  'click': function (e) {
    console.log('触发了 click 事件');
    // e._data 为 {key1: 'value1', key2: 'value2'}
  },
  'focus': function (e) {
    console.log('触发了 focus 事件');
    // e._data 为 {key1: 'value1', key2: 'value2'}
  }
}, '.box', { key1: 'value1', key2: 'value2' });

// 获取事件参数
$('.box').on('click', function (e, data) {
  // data 等于 e.detail
});

// 事件名支持使用命名空间
$('.box').on('click.myPlugin', function () {
  console.log('点击了 .box 元素');
});
```

### `.one()` {#one}

为每个匹配元素的特定事件绑定事件处理函数。但事件只会触发一次。

该方法的用法和 `.on()` 相同，所以不再举例了。

### `.off()` {#off}

为集合中每个元素解除绑定的事件。具体用法见下方示例：

```js
// 解除所有绑定的事件处理函数
$('.box').off();

// 解除绑定的指定事件
$('.box').off('click');

// 同时解除多个绑定的事件
$('.box').off('click focus');

// 解除绑定的指定事件处理函数
$('.box').off('click', callback);

// 解除通过事件委托绑定的事件
$(document).off('click', '.box');

// 解除通过事件委托绑定的指定事件处理函数
$(document).off('click', '.box', callback);

// 同时解绑多个事件处理函数
$('.box.').off({
  'click': callback1,
  'focus': callback2,
});

// 同时解绑多个通过事件委托绑定的事件处理函数
$(document).off({
  'click': callback1,
  'focus': callback2,
}, '.box');

// 事件名支持使用命名空间，下面的用法将解绑所有以 .myPlugin 结尾的事件
$(document).off('.myPlugin');
```

### `.trigger()` {#trigger}

触发指定的事件。具体用法见下方示例：

```js
// 触发指定的事件
$('.box').trigger('click');

// 触发事件时传入参数
$('.box').trigger('click', { key1: 'value1', key2: 'value2' });

// 事件名支持命名空间
$('.box').trigger('click.myPlugin');

// 传入 CustomEvent 的参数
$('.box').trigger('click', undefined, {
  bubbles: true;
  cancelable: true;
  composed: true
});
```

## ajax {#api-ajax}

### `$.ajaxSetup()` {#d-ajaxSetup}

为 ajax 请求设置全局配置参数。

```js
$.ajaxSetup({
  // 默认禁止触发全局 ajax 事件
  global: false,

  // 默认使用 POST 请求
  method: 'POST'
});
```

详细参数列表见下方的 [ajax 参数](#ajax-options)。

### `$.ajax()` {#d-ajax}

发送 ajax 请求，返回 Promise。

```js
const promise = $.ajax({
  method: 'POST',
  url: './test.php',
  data: {
    key1: 'val1',
    key2: 'val2'
  },
  success: function (response) {
    console.log(response);
  }
});

promise
  .then((response) => {
    console.log(response);
  })
  .catch((error) => {
    console.log(error);
  });
```

详细参数列表见下方的 [ajax 参数](#ajax-options)。

还可以使用 `.on()` 方法来监听 ajax 全局事件。

```js
// ajax 请求开始时会触发该事件
$(document).on('ajaxStart', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest 对象
  // options: $.ajax() 方法的参数
});

// ajax 请求成功时会触发该事件
$(document).on('ajaxSuccess', function (e, { xhr, options, response }) {
  // xhr: XMLHttpRequest 对象
  // options: $.ajax() 方法的参数
  // response: 请求的响应
});

// ajax 请求失败时会触发该事件
$(document).on('ajaxError', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest 对象
  // options: $.ajax() 方法的参数
});

// ajax 请求完成时会触发该事件
$(document).on('ajaxComplete', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest 对象
  // options: $.ajax() 方法的参数
});
```

### ajax 参数 {#ajax-options}

<table>
  <thead>
    <tr>
      <th>属性名</th>
      <th>类型</th>
      <th>默认值</th>
    </tr>
  </thead>
  <tbody>
    <tr id="ajax-options-url">
      <td><a href="#ajax-options-url"><code>url</code></a></td>
      <td><code>string</code></td>
      <td>当前页面 URL</td>
    </tr>
    <tr>
      <td colspan="3">请求的 URL 地址。</td>
    </tr>
    <tr id="ajax-options-method">
      <td><a href="#ajax-options-method"><code>method</code></a></td>
      <td><code>string</code></td>
      <td><code>GET</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>请求方式。</p>
        <p>包括：<code>GET</code>、<code>POST</code>、<code>PUT</code>、<code>PATCH</code>、<code>HEAD</code>、<code>OPTIONS</code>、<code>DELETE</code>。</p>
      </td>
    </tr>
    <tr id="ajax-options-data">
      <td><a href="#ajax-options-data"><code>data</code></a></td>
      <td><code>any</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">发送到服务器的数据。</td>
    </tr>
    <tr id="ajax-options-processData">
      <td><a href="#ajax-options-processData"><code>processData</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">是否把传递进来的数据转换成查询字符串发送。</td>
    </tr>
    <tr id="ajax-options-async">
      <td><a href="#ajax-options-async"><code>async</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">是否为异步请求。</td>
    </tr>
    <tr id="ajax-options-cache">
      <td><a href="#ajax-options-cache"><code>cache</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">是否从缓存中读取。只对 <code>GET</code>、<code>HEAD</code> 请求有效。</td>
    </tr>
    <tr id="ajax-options-username">
      <td><a href="#ajax-options-username"><code>username</code></a></td>
      <td><code>string</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">HTTP 访问认证的用户名。</td>
    </tr>
    <tr id="ajax-options-password">
      <td><a href="#ajax-options-password"><code>password</code></a></td>
      <td><code>string</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">HTTP 访问认证的密码。</td>
    </tr>
    <tr id="ajax-options-headers">
      <td><a href="#ajax-options-headers"><code>headers</code></a></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>添加到 Headers 中的数据。可以在 <code>beforeSend</code> 回调函数中重写该值。</p>
        <p>值为字符串或 <code>null</code> 的字段会被发送，值为 <code>undefined</code> 的字段会被移除。</p>
      </td>
    </tr>
    <tr id="ajax-options-xhrFields">
      <td><a href="#ajax-options-xhrFields"><code>xhrFields</code></a></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>设置在 <code>XMLHttpRequest</code> 对象上的数据。</p>
<pre><code class="language-js">$.ajax({
  url: '一个跨域 URL',
  xhrFields: {
    withCredentials: true
  }
});</code></pre>
      </td>
    </tr>
    <tr id="ajax-options-statusCode">
      <td><a href="#ajax-options-statusCode"><code>statusCode</code></a></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>HTTP 状态码和函数组成的对象。</p>
<pre><code class="language-js">$.ajax({
  statusCode: {
    404: function (xhr, textStatus) {
      alert('返回状态码为 404 时被调用');
    },
    200: function (data, textStatus, xhr) {
      alert('返回状态码为 200 时被调用');
    }
  }
});</code></pre>
        <p>状态码在 200 - 299 之间、或状态码为 304 时，表示请求成功，函数参数和 <code>success</code> 回调的参数相同；否则表示请求失败，函数参数和 <code>error</code> 回调的参数相同。</p>
      </td>
    </tr>
    <tr id="ajax-options-dataType">
      <td><a href="#ajax-options-dataType"><code>dataType</code></a></td>
      <td><code>string</code></td>
      <td><code>text</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>服务器返回的数据类型。</p>
        <p>包括：<code>text</code>、<code>json</code></p>
      </td>
    </tr>
    <tr id="ajax-options-contentType">
      <td><a href="#ajax-options-contentType"><code>contentType</code></a></td>
      <td><code>string</code></td>
      <td><code>application/x-www-form-urlencoded</code></td>
    </tr>
    <tr>
      <td colspan="3">内容的编码类型。为 <code>false</code> 时将不设置 <code>Content-Type</code>。</td>
    </tr>
    <tr id="ajax-options-timeout">
      <td><a href="#ajax-options-timeout"><code>timeout</code></a></td>
      <td><code>number</code></td>
      <td><code>0</code></td>
    </tr>
    <tr>
      <td colspan="3">请求的超时时间（毫秒）。为 <code>0</code> 时表示永不超时。</td>
    </tr>
    <tr id="ajax-options-global">
      <td><a href="#ajax-options-global"><code>global</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">是否触发全局 AJAX 事件。</td>
    </tr>
    <tr id="ajax-options-beforeSend">
      <td><a href="#ajax-options-beforeSend"><code>beforeSend</code></a></td>
      <td><code>function</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>在请求发送之前调用。返回 <code>false</code> 时将取消 AJAX 请求。</p>
<pre><code class="language-js">$.ajax({
  beforeSend: function (xhr) {
    // xhr 为 XMLHttpRequest 对象
  }
});</code></pre>
      </td>
    </tr>
    <tr id="ajax-options-success">
      <td><a href="#ajax-options-success"><code>success</code></a></td>
      <td><code>function</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>请求成功之后调用。</p>
<pre><code class="language-js">$.ajax({
  success: function (data, textStatus, xhr) {
    // data 为 AJAX 请求返回的数据
    // textStatus 为包含成功代码的字符串
    // xhr 为 XMLHttpRequest 对象
  }
});</code></pre>
      </td>
    </tr>
    <tr id="ajax-options-error">
      <td><a href="#ajax-options-error"><code>error</code></a></td>
      <td><code>function</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>请求出错时调用。</p>
<pre><code class="language-js">$.ajax({
  error: function (xhr, textStatus) {
    // xhr 为 XMLHttpRequest 对象
    // textStatus 为包含错误代码的字符串
  }
});</code></pre>
      </td>
    </tr>
    <tr id="ajax-options-complete">
      <td><a href="#ajax-options-complete"><code>complete</code></a></td>
      <td><code>function</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>请求完成时调用，无论请求成功或失败。</p>
<pre><code class="language-js">$.ajax({
  complete: function (xhr, textStatus) {
    // xhr 为 XMLHttpRequest 对象
    // textStatus 为一个包含成功或错误代码的字符串
  }
});</code></pre>
      </td>
    </tr>
  </tbody>
</table>
