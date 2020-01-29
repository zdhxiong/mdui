/**
 * 测试 typescript 的类型提示
 */
import $ from '../es/index';
import { JQ } from '../es/JQ';

const getElementById = document.getElementById('test');
const querySelector = document.querySelector('.test');
const querySelectorAll = document.querySelectorAll('.test');
const getElementsByClassName = document.getElementsByClassName('test');
const getElementsByTagName = document.getElementsByTagName('div');
const getElementsByName = document.getElementsByName('test');
const textNode = document.createTextNode('test');
const $elements = $('.test');
const arr = [1, 2, 3];

// $()
$(window);
$(document);
$(getElementById);
$(querySelector);
$(querySelectorAll);
$(getElementsByClassName);
$(getElementsByTagName);
$(getElementsByName);
$(textNode);
$($elements);
$(arr);
$('.selector');
$('<div>');

function test(selector: string | HTMLElement | ArrayLike<HTMLElement>): JQ {
  return $(selector).eq(0);
}

test('.test');

/**
 * ========================================= Function
 */

// ajax()

// ajaxSetup()

// contains()
$.contains(document, document);
$.contains(document, getElementById);
$.contains(document, querySelector);
$.contains(getElementById, document);
$.contains($elements.get(0), $elements[0]);

// data()
$.data(document, 'key', undefined);
$.data(window, 'type', 'image');
$.data(getElementById as HTMLElement, 'type');
$.data($elements[0]);
$.data($elements.get(0), { key1: 'value1', key2: 'value2' });

// each()
$.each(['a', 'b', 'c'], function(i, value) {
  console.log(i);
  console.log(value);
});

$.each($elements, function(i, element) {
  console.log(i);
  console.log(element);
});

$.each({ key1: 'value1', key2: 'value2' }, function(key, value) {
  console.log(key);
  console.log(value);
});

// extend()
$.extend({ key1: 'value1' });
$.extend({ key1: 'value1' }, { key2: 'value2' });
$.extend({ key1: 'value1' }, { key2: 'value2' }, { key3: 'value3' });
$.extend(
  { key1: 'value1' },
  { key2: 'value2' },
  { key3: 'value3' },
  { key4: 'value4' },
);
$.extend(
  { key1: 'value1' },
  { key2: 'value2' },
  { key3: 'value3' },
  { key4: 'value4' },
  { key5: 'value5' },
);
$.extend(
  { key1: 'value1' },
  { key2: 'value2' },
  { key3: 'value3' },
  { key4: 'value4' },
  { key5: 'value5' },
  { key6: 'value6' },
);
$.extend(
  { key1: 'value1' },
  { key2: 'value2' },
  { key3: 'value3' },
  { key4: 'value4' },
  { key5: 'value5' },
  { key6: 'value6' },
  { key7: 'value7' },
);
$.extend(
  { key1: 'value1' },
  { key2: 'value2' },
  { key3: 'value3' },
  { key4: 'value4' },
  { key5: 'value5' },
  { key6: 'value6' },
  { key7: 'value7' },
  { key8: 'value8' },
);

// map()
$.map(['a', 'b', 'c'], function(value, index) {
  return [value, index];
});
$.map({ key1: 'value1', key2: 'value2' }, function(value, key) {
  return [value, key];
});

// merge()
$.merge($('.new1').get(), $('.new2').get());
$.merge([1, 2, 3], [4, 5]);

// param()
$.param({ width: 1680, height: 1050 });
$.param([
  { name: 'name', value: 'mdui' },
  { name: 'password', value: '123456' },
]);

// removeData()
$.removeData($elements[0], 'key');
$.removeData($elements[0]);
$.removeData(document);
$.removeData(window);

// unique()
$.unique([1, 2, 3, 3]);

/**
 * ========================================= Method
 */

// .add()
$elements.add('<p>test</p>');
$elements.add('.test');
$elements.add($elements);
$elements.add($elements[0]);
$elements.add($elements.get());
$elements.add(querySelectorAll);

// .addClass()
$elements.addClass('new');
$elements.addClass('new1 new2');
$elements.addClass(function(index, currentClassName) {
  return currentClassName + '-' + index;
});

// .after()
$elements.after('<p>new</p>');
$elements.after('<p>new1</p>', '<p>new2</p>');
$elements.after($elements);
$elements.after($elements, $elements);
$elements.after($elements.get());
$elements.after($elements.get(), $elements.get());
$elements.after($elements[0]);
$elements.after($elements[0], $elements[0]);
$elements.after(function(index, html) {
  return `<div>${html}-${index}</div>`;
});
$elements.after(function() {
  return $('<p>new</p>');
});
$elements.after(function() {
  return $('<p>new</p>').get();
});
$elements.after(function() {
  return $('<p>new</p>')[0];
});

// .ajaxComplete()

// .ajaxError()

// .ajaxStart()

// .ajaxSuccess()

// .append()
$elements.append('<p>new</p>');
$elements.append('<p>new1</p>', '<p>new2</p>');
$elements.append($elements);
$elements.append($elements, $elements);
$elements.append($elements.get());
$elements.append($elements.get(), $elements.get());
$elements.append($elements[0]);
$elements.append($elements[0], $elements[0]);
$elements.append(function(index, html) {
  return `<div>${html}-${index}</div>`;
});
$elements.append(function() {
  return $('<p>new</p>');
});
$elements.append(function() {
  return $('<p>new</p>').get();
});
$elements.append(function() {
  return $('<p>new</p>')[0];
});

// .appendTo()
$elements.appendTo($elements);
$elements.appendTo('<div></div>');
$elements.appendTo($elements.get());
$elements.appendTo($elements[0]);
$elements.appendTo('.target');

// .attr()
$elements.attr('title', 'mdui');
$elements.attr('title', 123);
$elements.attr('title', null);
$elements.attr('title', undefined);
$elements.attr('title', function(index, oldAttrValue) {
  return oldAttrValue + index;
});
$elements.attr('title', function() {
  return 123;
});
$elements.attr('title', function() {
  return;
});
$elements.attr('title', function() {
  return null;
});

$elements.attr({
  title: 'mdui',
  label: 123,
  alt: function() {
    return 'tes';
  },
});

$elements.attr('title');

// .before()
$elements.before('<p>new</p>');
$elements.before('<p>new1</p>', '<p>new2</p>');
$elements.before($elements);
$elements.before($elements, $elements);
$elements.before($elements.get());
$elements.before($elements.get(), $elements.get());
$elements.before($elements[0]);
$elements.before($elements[0], $elements[0]);
$elements.before(function(index, html) {
  return `<div>${html}-${index}</div>`;
});
$elements.before(function() {
  return $('<p>new</p>');
});
$elements.before(function() {
  return $('<p>new</p>').get();
});
$elements.before(function() {
  return $('<p>new</p>')[0];
});

// .children()
$elements.children();
$elements.children('.new');

// .clone()
$elements.clone();

// .closest()
$elements.closest('.parent');
$elements.closest($elements);
$elements.closest($elements[0]);

// .css()
$elements.css('width', 100);
$elements.css('width', '100px');
$elements.css('width', undefined);
$elements.css('width', function(_, oldCssValue) {
  return oldCssValue;
});
$elements.css('width', function() {
  return 100;
});
$elements.css('width', function() {
  return undefined;
});
$elements.css('width', function() {
  return;
});
$elements.css({
  width: 100,
  height: '100px',
  left: function(_, oldCssValue) {
    return oldCssValue;
  },
  top: function() {
    return undefined;
  },
  right: function() {
    return;
  },
});
$elements.css('width');

// .data()

// .each()
$elements.each(function(_, element) {
  return element.title;
});

// .empty()
$elements.empty();

// .eq()
$elements.eq(0);
$elements.eq(1);
$elements.eq(-1);

// .extend()
$(document).extend({
  addColor: function() {
    return '';
  },
});

// .filter()
$elements.filter('.tes');
$elements.filter($elements);
$elements.filter($elements.get());
$elements.filter($elements[0]);
$elements.filter(function() {
  return true;
});

// .find()
$elements.find('.box');

// .first()
$elements.first();

// .get()
$elements.get(0);
$elements.get(1);
$elements.get(-1);
$elements.get();

// .has()
$elements.has($elements[0]);

// .hasClass()
$elements.hasClass('test');

// .height()
$elements.height(100);
$elements.height('100px');
$elements.height(function() {
  return 100;
});
$elements.height(function() {
  return '100px';
});
$elements.height();

// .hide()
$elements.hide();

// .html()
$elements.html('<p>test</p>');
$elements.html($elements[0]);
$elements.html(function(_, oldHTML) {
  return oldHTML + '<p>test</p>';
});
$elements.html(function() {
  return undefined;
});
$elements.html();

// .index()
$elements.index();
$elements.index('.test');
$elements.index($elements[0]);
$elements.index($elements);

// .innerHeight()

// .innerWidth()

// .insertAfter()
$elements.insertAfter('.test');
$elements.insertAfter('<p>test</p>');
$elements.insertAfter($elements[0]);
$elements.insertAfter($elements);
$elements.insertAfter($elements.get());

// .insertBefore()
$elements.insertBefore('.test');
$elements.insertBefore('<p>test</p>');
$elements.insertBefore($elements[0]);
$elements.insertBefore($elements);
$elements.insertBefore($elements.get());

// .is()
$elements.is('.test');
$elements.is($elements[0]);
$elements.is($elements.get());
$elements.is($elements);
$elements.is(function() {
  return true;
});

// .last()
$elements.last();

// .map()
$elements.map(function(index) {
  return index;
});
$elements.map(function(_, element) {
  return (element as HTMLInputElement).value;
});
$elements.map(function() {
  return null;
});

// .next()
$elements.next();
$elements.next('.box');

// .nextAll()
$elements.nextAll();
$elements.nextAll('.box');

// .nextUntil()
$elements.nextUntil();
$elements.nextUntil('.until');
$elements.nextUntil($elements);
$elements.nextUntil($elements[0]);
$elements.nextUntil('.until', 'div');

// .not()
$elements.not('.box');
$elements.not($elements);
$elements.not($elements.get());
$elements.not($elements[0]);
$elements.not(function() {
  return false;
});

// .off()

// .offset()
$elements.offset({
  top: 100,
  left: 50,
});
$elements.offset({
  left: 100,
  top: undefined,
});
$elements.offset(function() {
  return { left: 100, top: 20 };
});
$elements.offset();

// .offsetParent()
$elements.offsetParent();

// .on()

// .one()

// .parent()
$elements.parent();
$elements.parent('.parent');

// .parents()
$elements.parents();
$elements.parents('p');

// .parentsUntil()
$elements.parentsUntil();
$elements.parentsUntil('.parent');
$elements.parentsUntil($elements);
$elements.parentsUntil($elements[0]);
$elements.parentsUntil('.parent', 'div');

// .position()
$elements.position();

// .prepend()
$elements.prepend('<p>new</p>');
$elements.prepend('<p>new1</p>', '<p>new2</p>');
$elements.prepend($elements);
$elements.prepend($elements, $elements);
$elements.prepend($elements.get());
$elements.prepend($elements.get(), $elements.get());
$elements.prepend($elements[0]);
$elements.prepend($elements[0], $elements[0]);
$elements.prepend(function(index, html) {
  return `<div>${html}-${index}</div>`;
});
$elements.prepend(function() {
  return $('<p>new</p>');
});
$elements.prepend(function() {
  return $('<p>new</p>').get();
});
$elements.prepend(function() {
  return $('<p>new</p>')[0];
});

// .prependTo()
$elements.prependTo($elements);
$elements.prependTo('<div></div>');
$elements.prependTo($elements.get());
$elements.prependTo($elements[0]);
$elements.prependTo('.target');

// .prev()
$elements.prev();
$elements.prev('.box');

// .prevAll()
$elements.prevAll();
$elements.prevAll('.box');

// .prevUntil()
$elements.prevUntil();
$elements.prevUntil('.until');
$elements.prevUntil($elements);
$elements.prevUntil($elements[0]);
$elements.prevUntil('.until', 'div');

// .prop()
$elements.prop('title', 'mdui');
$elements.prop('checked', false);
$elements.prop('obj', { a: 1, b: 2 });
$elements.prop('title', null);
$elements.prop('title', undefined);
$elements.prop('title', function(index, oldPropValue) {
  return oldPropValue + index;
});
$elements.prop('title', function() {
  return 123;
});
$elements.prop('title', function() {
  return;
});
$elements.prop('title', function() {
  return null;
});

$elements.prop({
  title: 'mdui',
  checked: false,
  disabled: function() {
    return false;
  },
});

$elements.prop('disabled');

// .remove()
$elements.remove();
$elements.remove('.box');

// .removeAttr()
$elements.removeAttr('title');
$elements.removeAttr('title label');

// .removeClass()
$elements.removeClass();
$elements.removeClass('new1');
$elements.removeClass('new1 new2');
$elements.removeClass(function(index, oldClassName) {
  return oldClassName + '-' + index;
});

// .removeData()

// .removeProp()
$elements.removeProp('disabled');

// .replaceAll()
$elements.replaceAll('.box');
$elements.replaceAll($elements);
$elements.replaceAll($elements.get());
$elements.replaceAll($elements[0]);

// .replaceWith()
$elements.replaceWith('<p>Hello</p>');
$elements.replaceWith($elements);
$elements.replaceWith($elements.get());
$elements.replaceWith($elements[0]);
$elements.replaceWith(function(index, html) {
  return html + index;
});

// .serialize()
$elements.serialize();

// .serializeArray()
$elements.serializeArray();

// .show()
$elements.show();

// .siblings()
$elements.siblings();
$elements.siblings('.selected');

// .slice()
$elements.slice(3);
$elements.slice(3, 6);

// .text()
$elements.text('new');
$elements.text(123);
$elements.text(false);
$elements.text(function(index, text) {
  return text + index;
});
$elements.text();

// .toggle()
$elements.toggle();

// .toggleClass()
$elements.toggleClass('item');
$elements.toggleClass('item1 item2');
$elements.toggleClass(function(index, oldClassName) {
  return oldClassName + index;
});

// .trigger()

// .val()
$elements.val('mdui');
$elements.val(123);
$elements.val(['a', 'b']);
$elements.val(function(index, oldValue) {
  return oldValue + '-' + index;
});
$elements.val(function() {
  return;
});
$elements.val(function() {
  return ['a', 'b'];
});
$elements.val(function() {
  return 123;
});
$elements.val();

// .width()
$elements.width(100);
$elements.width('100px');
$elements.width(function() {
  return 100;
});
$elements.width(function() {
  return '100px';
});
$elements.width();
