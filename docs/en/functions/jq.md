mdui includes a lightweight JavaScript utility library that provides a jQuery-like API with chainable calls, but at only a fraction of jQuery's size.

Import the function:

```js
import { $ } from 'mdui/jq.js';
```

## Core {#api-core}

### `$()` {#dollar}

This function has several uses:

Pass a CSS selector to get a JQ object containing the matching elements.

```js
$('.box');
```

Pass a DOM element, an array, a NodeList, or a JQ object to get a JQ object containing the specified elements.

```js
$(document);
```

Pass an HTML string to create a JQ object containing the DOM elements created from the HTML.

```js
$(`<div id="wrapper">
  <span id="inner"></span>
</div>`);
```

Pass a function to be called when the DOM is fully loaded.

```js
$(function () { console.log('DOM Loaded') });
```

## Extension {#api-extend}

### `$.extend()` {#d-extend}

Passing a single object merges its properties into the `$` object, effectively adding new functionality to the `$` namespace.

```js
$.extend({
  customFunc: function () {}
});

// Now you can call the custom method like this
$.customFunc();
```

Passing two or more objects merges all properties from each object into the first one. The merged object is returned. Note that properties with a value of `undefined` are not merged.

```js
const object = $.extend(
  { key1: val1 },
  { key2: val2 },
  { key3: val3 }
);

// Both the first object and the returned value are now { key1: val1, key2: val2, key3: val3 }
```

### `$.fn.extend()` {#fn-extend}

This method extends the prototype chain of `$`, adding new methods.

```js
$.fn.extend({
  customFunc: function () {}
});

// Now you can use the extended method like this
$(document).customFunc();
```

## URL {#api-url}

### `$.param()` {#d-param}

This method serializes an array or an object into a string that can be used as a URL query string.

```js
$.param({ width: 1680, height: 1050 });
// Returns: "width=1680&height=1050"

$.param({ foo: { one: 1, two: 2 } });
// Returns: "foo[one]=1&foo[two]=2"

$.param({ ids: [1, 2, 3] });
// Returns: "ids[]=1&ids[]=2&ids[]=3"
```

If the parameter passed is an array, it should be in the format returned by the [`.serializeArray()`] method.

```js
$.param([
  { "name": "name", "value": "mdui" },
  { "name": "password", "value": "123456" }
]);
// Returns: "name=mdui&password=123456"
```

## Array and Object Operations {#api-array}

### `$.each()` {#d-each}

This method iterates over an array or object. It returns the first parameter, which is the array or object being traversed.

The callback function's first parameter is the index for arrays or the key for objects. The second parameter is the value at the corresponding position.

The `this` keyword in the callback function refers to the current value. If the callback function returns `false`, the iteration stops.

```js
// Iterate over an array
$.each(['a', 'b', 'c'], function (index, value) {
  console.log(index + ':' + value);
});

// Result:
// 0:a
// 1:b
// 2:c
```

```js
// Iterate over an object
$.each({'name': 'mdui', 'lang': 'zh'}, function (key, value) {
  console.log(key + ':' + value);
});

// Result:
// name:mdui
// lang:zh
```

### `$.merge()` {#d-merge}

This method appends the elements of the second array to the first array and returns the merged array.

```js
const first = ['a', 'b', 'c'];
const second = ['c', 'd', 'e'];
const result = $.merge(first, second);

console.log(first); // ['a', 'b', 'c', 'c', 'd', 'e']
console.log(result); // ['a', 'b', 'c', 'c', 'd', 'e']
```

### `$.unique()` {#d-unique}

This method removes duplicate elements from an array.

```js
const result = $.unique([1, 2, 12, 3, 2, 1, 2, 1, 1, 1, 1]);
console.log(result); // [1, 2, 12, 3]
```

### `$.map()` {#d-map}

This method iterates over an array or object, applying a function to each element, and returns a new array composed of the function's return values.

The callback function's first parameter is the current element's value, and the second parameter is the index for arrays or the key for objects.

The callback function can return any value. If it returns an array, the array will be flattened. If it returns `null` or `undefined`, the value will be ignored. The `this` keyword inside the function refers to the global window object.

```js
// Iterate over an array
const result = $.map(['a', 'b', 'c'], function (value, index) {
  return index + value;
});
console.log(result); // ['0a', '1b', '2c']
```

```js
// When the callback function returns an array, it will be flattened
const result = $.map([1, 2, 3], function (value, index) {
  return [value, value + 1];
});
console.log(result); // [1, 2, 2, 3, 3, 4]
```

```js
// Iterate over an object
const result = $.map({ name: 'mdui', password: '123456' }, function (value, key) {
  return key + ':' + value;
});
console.log(result); // ['name:mdui', 'password:123456']
```

### `$.contains()` {#d-contains}

This method checks if a parent node contains a child node, returning a boolean value.

```js
$.contains(document, document.body); // true
$.contains(document.body, document); // false
```

## Data Type Checking {#api-type}

### `.is()` {#is}

This method checks if at least one element in the collection matches the specified parameter. It returns a boolean value.

The parameter can be a CSS selector, a DOM element, an array of DOM elements, a JQ object, or a function.

When the parameter is a function, it takes the index and current element as arguments. `this` refers to the current element. The function should return `true` if the element matches, and `false` otherwise.

```js
$('.box').is('.box'); // true
$('.box').is('.boxss'); // false
$('.box').is($('.box')[0]); // true
```

```js
// Using a function for comparison
$(document).is(function (index, element) {
  return element === document;
});
// true
```

## Object Access {#api-object}

### `.length` {#length}

This property returns the number of elements in the current collection.

```js
$('body').length; // 1
```

### `.each()` {#each}

This method iterates over the current collection, executing a function for each element. The iteration stops if the function returns `false`.

The function's first parameter is the element's index, and the second is the current element. `this` refers to the current element.

```js
$('img').each(function(index, element) {
  this.src = 'test' + index + '.jpg';
});
```

### `.map()` {#map}

This method iterates over the current collection, executing a function for each element. It returns a new collection composed of the function's return values.

The function can return a single value or an array. If it returns an array, the elements are added to the new collection. `null` or `undefined` returns are ignored.

The function's first parameter is the element's index, and the second is the current element. `this` refers to the current element.

```js
const result = $('input.checked').map(function (i, element) {
  return element.value;
});

// result is a JQ object of values from matching elements
```

### `.eq()` {#eq}

This method returns a collection containing only the element at the specified index.

```js
$('div').eq(0); // Returns a collection with the first div
$('div').eq(-1); // Returns a collection with the last div
$('div').eq(-2); // Returns a collection with the second-to-last div
```

### `.first()` {#first}

This method returns a collection containing only the first element of the current collection.

```js
$('div').first(); // Returns a collection with the first div
```

### `.last()` {#last}

This method returns a collection containing only the last element of the current collection.

```js
$('div').last(); // Returns a collection with the last div
```

### `.get()` {#get}

This method returns the element at the specified index. If no parameter is passed, it returns an array of all elements in the collection.

```js
$('div').get(); // Returns an array of all div elements
$('div').get(0); // Returns the first div element
$('div').get(-1); // Returns the last div element
```

### `.index()` {#index}

This method returns the index of the first element in the current collection relative to its sibling elements if no parameter is passed.

If a CSS selector is passed as a parameter, it returns the index relative to the elements matched by the selector.

If a DOM element or a JQ object is passed as a parameter, it returns the index of that element within the current collection.

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

This method returns a subset of the current collection.

The first parameter is the start position, and the second is the end position (exclusive). If the second parameter is omitted, the method includes all elements from the start position to the end of the collection.

```js
$('div').slice(3); // Returns all elements from the third position onwards
$('div').slice(3, 5); // Returns elements from the third to the fifth position (excluding the fifth)
```

### `.filter()` {#filter}

This method filters the current collection based on the specified criteria.

The parameter can be a CSS selector, a DOM element, an array of DOM elements, or a callback function that returns a boolean.

When the parameter is a callback, it takes the index of the element and the current element as arguments. `this` refers to the current element. If the function returns `true`, the element is included in the result; if `false`, it's excluded.

```js
// Filters all div elements that contain the class .box
$('div').filter('.box');

// Filters all selected options
$('#select option').filter(function (index, element) {
  return element.selected;
});
```

### `.not()` {#not}

This method excludes elements from the current collection that match the specified criteria.

The parameter can be a CSS selector, a DOM element, an array of DOM elements, a JQ object, or a callback function returning a boolean.

When the parameter is a callback, the function's first parameter is the index of the element, the second is the current element, and `this` refers to the current element. If the function returns `true`, the element is excluded; if `false`, it's included.

```js
// Exclude all div elements that contain the class .box
$('div').not('.box');

// Exclude all unselected options
$('#select option').not(function (index, element) {
  return element.selected;
});
```

## CSS Classes {#api-css}

### `.hasClass()` {#hasClass}

This method checks if the first element in the collection has the specified CSS class.

```js
// Returns true if the first div has the class .item
$('div').hasClass('item');
```

### `.addClass()` {#addClass}

This method adds CSS classes to each element in the collection. You can add multiple class names by separating them with spaces.

The parameter can be a string or a callback function that returns a CSS class name. The callback function's first parameter is the element's index, the second is the existing CSS class name, and `this` refers to the current element.

```js
// Adds .item to all div elements
$('div').addClass('item');

// Adds .item1 and .item2 to all div elements
$('div').addClass('item1 item2');

// Adds CSS classes returned by the callback function to all div elements
$('div').addClass(function (index, currentClassName) {
  return currentClassName + '-' + index;
});
```

### `.removeClass()` {#removeClass}

This method removes specified CSS classes from each element in the collection. You can remove multiple class names by separating them with spaces.

The parameter can be a string or a callback function that returns a CSS class name. The callback function's first parameter is the element's index, the second is the existing CSS class name, and `this` refers to the current element.

If no parameter is passed, it will remove the `class` attribute from the elements.

```js
// Removes .item from all div elements
$('div').removeClass('item');

// Removes .item1 and .item2 from all div elements
$('div').removeClass('item1 item2');

// Removes CSS classes returned by the callback function from all div elements
$('div').removeClass(function (index, currentClassName) {
  return 'item';
});
```

### `.toggleClass()` {#toggleClass}

This method toggles CSS classes for each element in the collection. If a class exists, it's removed; if it doesn't exist, it's added. You can toggle multiple class names by separating them with spaces.

The parameter can be a string or a callback function that returns a CSS class name. The callback function's first parameter is the element's index, the second is the existing CSS class name, and `this` refers to the current element.

```js
// Toggles .item on all div elements
$('div').toggleClass('item');

// Toggles .item1 and .item2 on all div elements
$('div').toggleClass('item1 item2');

// Toggles CSS classes returned by the callback function on all div elements
$('div').toggleClass(function (index, currentClassName) {
  return 'item';
});
```

## Element Properties {#api-attr}

### `.prop()` {#prop}

This method retrieves the JavaScript property value of the first element in the collection.

```js
// Get the 'checked' property value of the first input element
$('input').prop('checked');
```

This method can also set JavaScript property values for all elements in the collection.

The property value can be any type, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing property value, and `this` refers to the current element.

If the property value or the callback function's return value is `undefined`, the original property remains unchanged.

```js
// Set the 'checked' property to true for all input elements
$('input').prop('checked', true);

// Toggle the 'checked' property for all input elements
$('input').prop('checked', function (index, oldPropValue) {
  return true;
});
```

You can also set multiple properties at once by passing an object.

```js
// Set multiple property values for the elements
$('input').prop({
  checked: false,
  disabled: function (index, oldPropValue) {
    return true;
  }
});
```

### `.removeProp()` {#removeProp}

This method removes the specified JavaScript property from all elements in the collection.

```js
$('input').removeProp('disabled');
```

### `.attr()` {#attr}

This method retrieves the HTML attribute value of the first element in the collection.

```js
// Get the 'username' attribute value of the first div element
$('div').attr('username');
```

This method can also set HTML attribute values for all elements in the collection.

The attribute value can be a string, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing attribute value, and `this` refers to the current element.

If the attribute value or the callback function's return value is `null`, the specified attribute will be removed. If it's `undefined`, the original attribute remains unchanged.

```js
// Set the 'username' attribute to 'mdui' for all div elements
$('div').attr('username', 'mdui');

// Set the 'username' attribute to 'mdui' for all div elements
$('div').attr('username', function (index, oldAttrValue) {
  return 'mdui';
});
```

You can also set multiple attributes at once by passing an object.

```js
// Set multiple attribute values for all div elements
$('div').attr({
  username: 'mdui',
  lastname: function (index, oldAttrValue) {
    return 'test';
  }
});
```

### `.removeAttr()` {#removeAttr}

This method removes specified attributes from all elements in the collection. Multiple attribute names can be separated by spaces.

```js
// Remove 'username' attribute from all div elements
$('div').removeAttr('username');

// Remove 'username' and 'lastname' attributes from all div elements
$('div').removeAttr('username lastname');
```

### `.val()` {#val}

This method retrieves the value of the first element in the collection.

For a `<select multiple="multiple">` element, it returns an array containing the values of each selected option.

```js
// Get the value of the first selected element
$('#input').val();
```

This method can also set values for all elements in the collection.

The value can be a string, a number, an array (for `<select multiple="multiple">`, `<input type="checkbox">`, `<input type="radio">`, or `<option>`), or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing value, and `this` refers to the current element.

If the value or the callback function's return value is `undefined`, the element's value will be set to an empty string.

```js
// Set the value to 'mdui' for all selected elements
$('#input').val('mdui');

// Set the value to 'mdui' for all selected elements
$('#input').val(function (index, oldValue) {
  return 'mdui';
});
```

### `.text()` {#text}

This method retrieves the combined text content of all elements in the collection, including their descendants.

```js
// Get the text content of all .box elements
$('.box').text();
```

This method can also set the text content for all elements in the collection.

The value can be a string, a number, a boolean, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing text content, and `this` refers to the current element.

If the value or the callback function's return value is `undefined`, the original text content remains unchanged.

```js
// Set the text content for all .box elements
$('.box').text('text content');

// Set the text content using the return value of the callback function
$('.box').text(function (index, oldTextContent) {
  return 'new text content';
});
```

### `.html()` {#html}

This method retrieves the HTML content of the first element in the collection.

```js
// Get the HTML content of the first .box element
$('.box').html();
```

This method can also set the HTML content for all elements in the collection.

The value can be an HTML string, a DOM element, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing HTML content, and `this` refers to the current element.

If the value or the callback function's return value is `undefined`, the original HTML content remains unchanged.

```js
// Set the HTML content for all .box elements
$('.box').html('<div>new html content</div>');

// Set the HTML content using the return value of the callback function
$('.box').html(function (index, oldHTMLContent) {
  return '<div>new html content</div>';
});
```

## Data Storage {#api-data}

### `$.data()` {#d-data}

This method stores or retrieves data on a specified element.

If the value is `undefined` when storing data, it is equivalent to reading the corresponding data on the element. For example, `$.data(element, 'key', undefined)` is equivalent to `$.data(element, 'key')`.

Note: This method does not retrieve `data-*` attributes on the element.

```js
// Store data on the specified element and return the stored value
$.data(document.body, 'layout', 'dark'); // Returns 'dark'

// Store multiple data on the specified element simultaneously
$.data(document.body, {
  primary: 'indigo',
  accent: 'pink',
}); // Returns { primary: 'indigo', accent: 'pink' }

// Retrieve stored data on the specified element
$.data(document.body, 'layout'); // Returns 'dark'

// Retrieve all stored data on the specified element
$.data(document.body); // Returns { layout: 'dark', primary: 'indigo', accent: 'pink' }
```

### `$.removeData()` {#d-removeData}

This method removes stored data from the specified element.

Multiple keys can be specified either as a space-separated string or as an array. If no keys are provided, all data on the element is removed.

```js
// Remove 'name' data from the element
$.removeData(document.body, 'name');

// Remove 'name1' and 'name2' data from the element. The following two methods are equivalent:
$.removeData(document.body, 'name1 name2');
$.removeData(document.body, ['name1', 'name2']);

// Remove all stored data from the element
$.removeData(document.body);
```

### `.data()` {#data}

This method retrieves or stores data on the elements in the current collection.

If the value is `undefined` when storing data, it will not be stored.

Note: This method include `data-*` attributes on the elements when retrieving data.

```js
// Store data on elements in the current collection
$('.box').data('layout', 'dark');

// Store multiple data on elements in the current collection simultaneously
$('.box').data({
  primary: 'indigo',
  accent: 'pink',
});

// Retrieve specified data stored on the first element in the current collection
$('.box').data('layout'); // Returns 'dark'

// Retrieve all stored data on the first element in the current collection
$('.box').data(); // Returns { layout: 'dark', primary: 'indigo', accent: 'pink' }
```

### `.removeData()` {#removeData}

This method removes stored data from elements in the current collection.

Multiple keys can be specified either as a space-separated string or as an array. If no keys are provided, all data is removed.

Note: This method only removes data set by the `.data()` method and does not affect `data-*` attributes.

```js
// Remove 'name' data from elements in the current collection
$('.box').removeData('name');

// Remove 'name1' and 'name2' data from elements in the current collection. The following two methods are equivalent:
$('.box').removeData('name1 name2');
$('.box').removeData(['name1', 'name2']);

// Remove all stored data from elements in the current collection
$('.box').removeData();
```

## Styles {#api-style}

### `.css()` {#css}

This method retrieves the CSS property value of the first element in the collection.

```js
$('.box').css('color');
```

This method can also set the CSS property values for all elements in the collection.

The value can be a string, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing CSS property value, and `this` refers to the current element.

If the value or the callback function's return value is `undefined`, the CSS property value remains unchanged. If it's `null`, the corresponding CSS property is removed. If it's a number, `px` is automatically added as the unit unless the property doesn't support px.

```js
// Set the 'color' CSS property value
$('.box').css('color', 'red')

// Set the 'color' CSS property value using the return value of the callback function
$('.box').css('color', function (index, oldCSSValue) {
  return 'green';
});

// Set multiple styles simultaneously by passing an object
$('.box').css({
  'background-color': 'white',
  color: function (index, oldCSSValue) {
    return 'blue';
  },
});
```

### `.width()` {#width}

This method retrieves the width (in pixels) of the first element in the collection, excluding `padding`, `border`, and `margin`.

```js
$('.box').width();
```

This method can also set the width (excluding `padding`, `border`, and `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing width, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the width remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the width
$('.box').width('20%');

// Numeric values default to 'px' units
$('.box').width(10);

// Set the width using a callback function
$('.box').width(function (index, oldWidth) {
  return 10;
});
```

### `.height()` {#height}

This method retrieves the height (in pixels) of the first element in the collection, excluding `padding`, `border`, and `margin`.

```js
$('.box').height();
```

This method can also set the height (excluding `padding`, `border`, and `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing height, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the height remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the height
$('.box').height('20%');

// Numeric values default to 'px' units
$('.box').height(10);

// Set the height using a callback function
$('.box').height(function (index, oldWidth) {
  return 10;
});
```

### `.innerWidth()` {#innerWidth}

This method retrieves the width (in pixels) of the first element in the collection, including `padding` but excluding `border` and `margin`.

```js
$('.box').innerWidth();
```

This method can also set the width (including `padding` but excluding `border` and `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing width, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the width remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the width
$('.box').innerWidth('20%');

// Numeric values default to 'px' units
$('.box').innerWidth(10);

// Set the width using the return value of a callback function
$('.box').innerWidth(function (index, oldWidth) {
  return 10;
});
```

### `.innerHeight()` {#innerHeight}

This method retrieves the height (in pixels) of the first element in the collection, including `padding` but excluding `border` and `margin`.

```js
$('.box').innerHeight();
```

This method can also set the height (including `padding`, excluding `border` and `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing height, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the height remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the height
$('.box').innerHeight('20%');

// Numeric values default to 'px' units
$('.box').innerHeight(10);

// Set the height using the return value of a callback function
$('.box').innerHeight(function (index, oldHeight) {
  return 10;
});
```

### `.outerWidth()` {#outerWidth}

This method retrieves the width (in pixels) of the first element in the collection, including `padding` and `border`, but excluding `margin`. If `true` is passed as a parameter, the `margin` width is included.

```js
// Width including padding and border
$('.box').outerWidth();

// Width including padding, border, and margin
$('.box').outerWidth(true);
```

This method can also set the width (including `padding` and `border`, excluding `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing width, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the width remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the width
$('.box').outerWidth('20%');

// Numeric values default to 'px' units
$('.box').outerWidth(10);

// Include margin width by passing true as the second parameter
$('.box').outerWidth(10, true);

// Set width using the return value of a callback function
$('.box').outerWidth(function (index, oldWidth) {
  return 10;
});
```

### `.outerHeight()` {#outerHeight}

This method retrieves the height (in pixels) of the first element in the collection, including `padding` and `border`, but excluding `margin`. If `true` is passed as a parameter, the `margin` height is included.

```js
// Height including padding and border
$('.box').outerHeight();

// Height including padding, border, and margin
$('.box').outerHeight(true);
```

This method can also set the height (including `padding` and `border`, excluding `margin`) for all elements in the collection.

The value can be a string with units, a number, or the return value of a callback function. The callback function's first parameter is the element's index, the second is the existing height, and `this` refers to the current element.

If the value or the callback function's return value is `null` or `undefined`, the height remains unchanged. If it's a number, `px` is automatically added as the unit.

```js
// Set the height
$('.box').outerHeight('20%');

// Numeric values default to 'px' units
$('.box').outerHeight(10);

// Include margin height by passing true as the second parameter
$('.box').outerHeight(10, true);

// Set height using the return value of a callback function
$('.box').outerHeight(function (index, oldWidth) {
  return 10;
});
```

### `.hide()` {#hide}

This method hides all elements in the collection.

```js
$('.box').hide();
```

### `.show()` {#show}

This method displays all elements in the collection.

```js
$('.box').show();
```

### `.toggle()` {#toggle}

This method toggles the visibility of all elements in the collection.

```js
$('.box').toggle();
```

### `.offset()` {#offset}

This method retrieves the coordinates of the first element in the collection relative to the `document`.

```js
$('.box').offset(); // { top: 20, left: 30 }
```

This method can also set the coordinates for all elements in the collection relative to the `document`.

The parameter can be an object with `top` and `left` properties, or a callback function returning such an object. The callback function's first parameter is the element's index, the second is the existing coordinates, and `this` refers to the current element.

If `top` or `left` in the parameter object is `undefined`, the corresponding value remains unchanged.

```js
// Set the coordinates
$('.box').offset({ top: 20, left: 30 });

// Set coordinates using a callback function
$('.box').offset(function (index, oldOffset) {
  return { top: 20, left: 30 };
});
```

### `.offsetParent()` {#offsetParent}

This method returns the closest parent element with a `position` value of `relative` or `absolute` for the first element in the collection.

```js
$('.box').offsetParent();
```

### `.position()` {#position}

This method retrieves the offset of the first element in the collection relative to its positioned parent.

```js
$('.box').position(); // { top: 20, left: 30 }
```

## Element Lookup {#api-selector}

### `.find()` {#find}

This method finds a collection of specified descendant elements based on a CSS selector within the elements of the current collection.

```js
// Find elements with class .box among descendants of #box
$('#box').find('.box')
```

### `.children()` {#children}

This method retrieves a collection of immediate child elements within the elements of the current collection. A CSS selector can be passed as a parameter to filter the child elements.

```js
// Find all immediate child elements of #box
$('#box').children();

// Find elements with class .box among all immediate child elements of #box
$('#box').children('.box');
```

### `.has()` {#has}

This method filters elements within the current collection that contain a specified child element. The parameter can be a CSS selector or a DOM element.

```js
// Add a background color to li elements containing ul
$('li').has('ul').css('background-color', 'red');
```

### `.parent()` {#parent}

This method retrieves a collection of direct parent elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the parent elements.

```js
// Direct parent elements of .box elements
$('.box').parent();

// Direct parent elements of .box elements with class .parent
$('.box').parent('.parent');
```

### `.parents()` {#parents}

This method retrieves a collection of ancestor elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the ancestor elements.

```js
// All ancestor elements of span elements
$('span').parents();

// All ancestor elements of span elements that are p elements
$('span').parents('p');
```

### `.parentsUntil()` {#parentsUntil}

This method retrieves all ancestor elements for each element in the current collection until an element matching the specified parameter is encountered (excluding the matching element).

The first parameter can be a CSS selector, a DOM element, or a JQ object. An optional second parameter, a CSS selector, can be passed to filter the returned elements.

If no parameters are given, it matches all ancestors, similar to `.parents()`.

```js
// All ancestor elements of .item elements
$('.item').parentsUntil();

// Ancestor elements of .item elements until .parent
$('.item').parentsUntil('.parent');

// Ancestor div elements of .item elements until .parent
$('.item').parentsUntil('.parent', 'div');
```

### `.prev()` {#prev}

This method retrieves a collection of the immediately preceding sibling elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the sibling elements.

```js
// Immediately preceding sibling elements of .box elements
$('.box').prev();

// Immediately preceding sibling div elements of .box elements
$('.box').prev('div');
```

### `.prevAll()` {#prevAll}

This method retrieves a collection of all preceding sibling elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the sibling elements.

```js
// All preceding sibling elements of .box elements
$('.box').prevAll();

// All preceding sibling elements of .box elements with class .selected
$('.box').prevAll('.selected');
```

### `.prevUntil()` {#prevUntil}

This method retrieves all preceding sibling elements for each element in the current collection until an element matching the specified parameter is encountered (excluding the matching element).

The first parameter can be a CSS selector, a DOM element, or a JQ object. An optional second parameter, a CSS selector, can be passed to filter the returned elements.

If no parameter is given, it returns all preceding siblings, similar to `.prevAll()`.

```js
// All preceding sibling elements of .box elements
$('.box').prevUntil();

// Preceding sibling elements of .box elements until .until
$('.box').prevUntil('.until');

// Preceding sibling div elements of .box elements until .until
$('.box').prevUntil('.until', 'div');
```

### `.next()` {#next}

This method retrieves a collection of the immediately following sibling elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the sibling elements.

```js
// Immediately following sibling elements of .box elements
$('.box').next();

// Immediately following sibling div elements of .box elements
$('.box').next('div');
```

### `.nextAll()` {#nextAll}

This method retrieves a collection of all following sibling elements for all elements in the current collection. A CSS selector can be passed as a parameter to filter the sibling elements.

```js
// All following sibling elements of .box elements
$('.box').nextAll();

// All following sibling elements of .box elements with class .selected
$('.box').nextAll('.selected');
```

### `.nextUntil()` {#nextUntil}

This method retrieves all following sibling elements for each element in the current collection until an element matching the specified parameter is encountered (excluding the matching element).

The first parameter can be a CSS selector, a DOM element, or a JQ object. An optional second parameter, a CSS selector, can be passed to filter the returned elements.

If no parameter is given, it returns all following siblings, similar to `.nextAll()`.

```js
// All following sibling elements of .box elements
$('.box').nextUntil();

// Following sibling elements of .box elements until .until
$('.box').nextUntil('.until');

// Following sibling div elements of .box elements until .until
$('.box').nextUntil('.until', 'div');
```

### `.closest()` {#closest}

This method traverses upwards from the current element, returning the closest matching element. The parameter can be a CSS selector, a DOM element, or a JQ object.

```js
// Closest .parent element for .box elements
$('.box').closest('.parent');
```

### `.siblings()` {#siblings}

This method retrieves the siblings for each element in the current collection. A CSS selector can be passed as a parameter to filter the sibling elements.

```js
// All siblings for .box elements
$('.box').siblings();

// Siblings with class .selected for .box elements
$('.box').siblings('.selected');
```

### `.add()` {#add}

This method adds elements to the current collection. The parameter can be an HTML string, CSS selector, JQ object, DOM element, an array of DOM elements, or a NodeList.

```js
// Adds elements with class .selected to the current collection
$('.box').add('.selected');
```

## Element Manipulation {#api-dom}

### `.empty()` {#empty}

This method removes all child elements from the current element.

```js
$('.box').empty();
```

### `.remove()` {#remove}

This method removes elements from the DOM that are in the current collection. A CSS selector can be passed as a parameter to only remove elements that match the parameter.

```js
// Removes all p elements
$('p').remove();

// Removes all p elements with class .box
$('p').remove('.box');
```

### `.prepend()` {#prepend}

This method adds content at the beginning of the elements in the current collection.

It accepts an HTML string, DOM element, array of DOM elements, or JQ object as parameters. Multiple parameters can be used.

You can also provide a callback function that returns an HTML string, DOM element, array of DOM elements, or JQ object. The callback function's first parameter is the element's index, the second is its original HTML, and `this` refers to the current element.

The method returns the original collection.

```js
// Insert a single element
$('<p>I would like to say: </p>').prepend('<b>Hello</b>');
// Result: <p><b>Hello</b>I would like to say: </p>

// Insert multiple elements
$('<p>I would like to say: </p>').prepend('<b>Hello</b>', '<b>World</b>');
// Result: <p><b>Hello</b><b>World</b>I would like to say: </p>

// Insert an element using a callback function
$('<p>Hello</p>').append(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// Result: <p><b>Hello0</b>Hello</p>
```

### `.prependTo()` {#prependTo}

This method inserts elements from the current collection at the beginning of the specified element.

It accepts a CSS selector, HTML string, DOM element, array of DOM elements, or JQ object as parameters.

The method returns the original collection.

```js
$('<p>Hello</p>').prependTo('<p>I would like to say: </p>');
// Result: [ <p><p>Hello</p>I would like to say: </p> ]
```

### `.append()` {#append}

This method adds content at the end of the elements in the current collection.

It accepts an HTML string, DOM element, array of DOM elements, or JQ object as parameters. Multiple parameters can be used.

You can also provide a callback function that returns an HTML string, DOM element, array of DOM elements, or JQ object. The callback function's first parameter is the element's index, the second is its original HTML, and `this` refers to the current element.

The method returns the original collection.

```js
// Insert a single element
$('<p>I would like to say: </p>').append('<b>Hello</b>');
// Result: <p>I would like to say: <b>Hello</b></p>

// Insert multiple elements
$('<p>I would like to say: </p>').append('<b>Hello</b>', '<b>World</b>');
// Result: <p>I would like to say: <b>Hello</b><b>World</b></p>

// Insert an element using a callback function
$('<p>Hello</p>').append(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// Result: <p>Hello<b>Hello0</b></p>
```

### `.appendTo()` {#appendTo}

This method inserts elements from the current collection at the end of the specified element.

It accepts a CSS selector, HTML string, DOM element, array of DOM elements, or JQ object as parameters.

The method returns the original collection.

```js
$('<p>Hello</p>').appendTo('<p>I would like to say: </p>')
// Result: <p>I would like to say: <p>Hello</p></p>
```

### `.after()` {#after}

This method inserts content after the elements in the current collection.

It accepts an HTML string, DOM element, array of DOM elements, or JQ object as parameters. Multiple parameters can be used.

You can also provide a callback function that returns an HTML string, DOM element, array of DOM elements, or JQ object. The callback function's first parameter is the element's index, the second is its original HTML, and `this` refers to the current element.

The method returns the original collection.

```js
// Insert a single element
$('<p>I would like to say: </p>').after('<b>Hello</b>');
// Result: <p>I would like to say: </p><b>Hello</b>

// Insert multiple elements
$('<p>I would like to say: </p>').after('<b>Hello</b>', '<b>World</b>');
// Result: <p>I would like to say: </p><b>Hello</b><b>World</b>

// Insert an element using a callback function
$('<p>Hello</p>').after(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// Result: <p>Hello</p><b>Hello0</b>
```

### `.insertAfter()` {#insertAfter}

This method inserts elements from the current collection after the specified element.

Existing elements in the collection are moved, not copied. If there are multiple targets, the elements are cloned and added after each target.

The method accepts a CSS selector, HTML string, DOM element, array of DOM elements, or JQ object as parameters.

```js
$('<b>Hello</b>').insertAfter('<p>I would like to say: </p>');
// Result: <p>I would like to say: </p><b>Hello</b>
```

### `.before()` {#before}

This method inserts content before the elements in the current collection.

It accepts an HTML string, DOM element, array of DOM elements, or JQ object as parameters. Multiple parameters can be used.

You can also provide a callback function that returns an HTML string, DOM element, array of DOM elements, or JQ object. The callback function's first parameter is the element's index, the second is its original HTML, and `this` refers to the current element.

The method returns the original collection.

```js
// Insert a single element
$('<p>I would like to say: </p>').before('<b>Hello</b>');
// Result: <b>Hello</b><p>I would like to say: </p>

// Insert multiple elements
$('<p>I would like to say: </p>').before('<b>Hello</b>', '<b>World</b>');
// Result: <b>Hello</b><b>World</b><p>I would like to say: </p>

// Insert an element using a callback function
$('<p>Hello</p>').before(function (index, oldHTML) {
  return '<b>' + oldHTML + index + '</b>';
});
// Result: <b>Hello0</b><p>Hello</p>
```

### `.insertBefore()` {#insertBefore}

This method inserts elements from the current collection before the specified element.

Existing elements in the collection are moved, not copied. If there are multiple targets, the elements are cloned and added before each target.

The method accepts a CSS selector, HTML string, DOM element, array of DOM elements, or JQ object as parameters.

```js
$('<p>I would like to say: </p>').insertBefore('<b>Hello</b>');
// Result: <p>I would like to say: </p><b>Hello</b>
```

### `.replaceWith()` {#replaceWith}

This method replaces the elements in the current collection with the specified content.

It accepts an HTML string, DOM element, array of DOM elements, or JQ object as parameters.

You can also provide a callback function that returns an HTML string, DOM element, array of DOM elements, or JQ object. The callback function's first parameter is the element's index, the second is its original HTML, and `this` refers to the current element.

The method returns the original collection, i.e., the elements that were replaced.

```js
// Replace all .box elements with <p>Hello</p>
$('.box').replaceWith('<p>Hello</p>');

// Replace all .box elements with the return value of the callback function
$('.box').replaceWith(function (index, oldHTML) {
  return oldHTML + index;
});
```

### `.replaceAll()` {#replaceAll}

This method replaces the specified content with the elements in the current collection.

The parameter can be a CSS selector, DOM element, array of DOM elements, or JQ object.

The method returns the original collection, i.e., the elements that were used for replacement.

```js
// Replace all .box elements with .new elements
$('.new').replaceAll('.box');
```

### `.clone()` {#clone}

This method creates a deep copy of all elements in the current collection.

It uses the native `cloneNode` method and does not copy data and event handlers to the new elements. This behavior differs from jQuery, where a single parameter determines whether to copy data and event handlers.

```js
$('body').append($("#box").clone())
```

## Form {#api-form}

### `.serializeArray()` {#serializeArray}

This method combines the values of form elements into an array of objects with `name` and `value` key-value pairs.

It can operate on individual form elements or an entire `<form>`.

```js
$('form').serializeArray();
// [
//   { "name": "golang", "value":"456" },
//   { "name": "name", "value": "mdui" },
//   { "name": "password", "value": "" }
// ]
```

### `.serializeObject()` {#serializeObject}

This method converts the values of form elements into an object.

If there are duplicate keys, the corresponding values will be converted into an array.

It can operate on individual form elements or an entire <form>.

```js
$('form').serializeObject()
// { name: mdui, password: 123456 }
```

### `.serialize()` {#serialize}

This method compiles the values of form elements into a string.

```js
$('form').serialize();
// golang=456&name=mdui&password=
```

## Event {#api-event}

### `.on()` {#on}

This method binds an event handler to each element in the collection for a specific event. Here are some examples:

```js
// Bind a click event
$('.box').on('click', function (e) {
  console.log('Clicked on .box element');
});

// Bind multiple events
$('.box').on('click focus', function (e) {
  console.log('This function will be triggered for both click and focus events');
});

// Event delegation
$(document).on('click', '.box', function (e) {
  console.log('This function will be triggered when a .box element is clicked');
});

// Binding multiple events and handlers
$('.box').on({
  'click': function (e) {
    console.log('Clicked on .box element');
  },
  'focus': function (e) {
    console.log('Focused on .box element');
  }
});

// Passing parameters
$('.box').on('click', { key1: 'value1', key2: 'value2' }, function (e) {
  console.log('Clicked on .box element and passed parameters to the event handler');
  // e._data is {key1: 'value1', key2: 'value2'}
});

// Binding multiple events and handlers with parameters
$('.box').on({
  'click': function (e) {
    console.log('Clicked on .box element');
    // e._data is {key1: 'value1', key2: 'value2'}
  },
  'focus': function (e) {
    console.log('Focused on .box element');
    // e._data is {key1: 'value1', key2: 'value2'}
  }
}, { key1: 'value1', key2: 'value2' });

// Event delegation with parameters
$(document).on('click', '.box', { key1: 'value1', keys: 'value2' }, function (e) {
  console.log('Clicked on .box element and passed parameters to the event handler');
  // e._data is {key1: 'value1', key2: 'value2'}
});

// Bind multiple events and handlers with event delegation
$(document).on({
  'click': function (e) {
    console.log('Clicked on .box element');
  },
  'focus': function (e) {
    console.log('Focused on .box element');
  }
}, '.box');

// Bind multiple events and handlers with event delegation and parameters
$(document).on({
  'click': function (e) {
    console.log('Clicked on .box element');
    // e._data is {key1: 'value1', key2: 'value2'}
  },
  'focus': function (e) {
    console.log('Focused on .box element');
    // e._data is {key1: 'value1', key2: 'value2'}
  }
}, '.box', { key1: 'value1', key2: 'value2' });

// Get event parameters
$('.box').on('click', function (e, data) {
  // data is equal to e.detail
});

// Event namespaces
$('.box').on('click.myPlugin', function () {
  console.log('Clicked on .box element');
});
```

### `.one()` {#one}

This method binds an event handler to each matched element for a specific event, but the event will only be triggered once. The usage is the same as `.on()`.

### `.off()` {#off}

This method unbinds one or more event handlers from each element in the collection. Here are some examples:

```js
// Unbind all event handlers
$('.box').off();

// Unbind specific event
$('.box').off('click');

// Unbind multiple events
$('.box').off('click focus');

// Unbind a specific event handler
$('.box').off('click', callback);

// Unbind an event with delegated
$(document).off('click', '.box');

// Unbind a specific event handler with delegated
$(document).off('click', '.box', callback);

// Unbind multiple event handlers
$('.box.').off({
  'click': callback1,
  'focus': callback2,
});

// Unbind multiple event handlers with delegated
$(document).off({
  'click': callback1,
  'focus': callback2,
}, '.box');

// Event names support namespaces. The following unbinds all events ending with .myPlugin
$(document).off('.myPlugin');
```

### `.trigger()` {#trigger}

This method triggers a specified event on each element in the collection. Here are some examples:

```js
// Trigger a specified event
$('.box').trigger('click');

// Pass parameters when triggering an event
$('.box').trigger('click', { key1: 'value1', key2: 'value2' });

// Event names support namespaces
$('.box').trigger('click.myPlugin');

// CustomEvent parameters
$('.box').trigger('click', undefined, {
  bubbles: true;
  cancelable: true;
  composed: true
});
```

## ajax {#api-ajax}

### `$.ajaxSetup()` {#d-ajaxSetup}

This method sets global parameters for AJAX requests.

```js
$.ajaxSetup({
  // Disable global Ajax events by default
  global: false,

  // Default to POST request
  method: 'POST'
});
```

Refer to [Ajax options](#ajax-options) for a detailed list of parameters.

### `$.ajax()` {#d-ajax}

This method initiates an AJAX request and returns a Promise.

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

Refer to [Ajax options](#ajax-options) for a detailed list of parameters.

You can listen to global AJAX events using the `.on()` method.

```js
// Triggered when an Ajax request starts
$(document).on('ajaxStart', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest object
  // options: $.ajax() method parameters
});

// Triggered when an Ajax request is successful
$(document).on('ajaxSuccess', function (e, { xhr, options, response }) {
  // xhr: XMLHttpRequest object
  // options: $.ajax() method parameters
  // response: Request response
});

// Triggered when an Ajax request fails
$(document).on('ajaxError', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest object
  // options: $.ajax() method parameters
});

// Triggered when an Ajax request completes
$(document).on('ajaxComplete', function (e, { xhr, options }) {
  // xhr: XMLHttpRequest object
  // options: $.ajax() method parameters
});
```

### Ajax Options {#ajax-options}

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Type</th>
      <th>Default</th>
    </tr>
  </thead>
  <tbody>
    <tr id="ajax-options-url">
      <td><a href="#ajax-options-url"><code>url</code></a></td>
      <td><code>string</code></td>
      <td>Current page URL</td>
    </tr>
    <tr>
      <td colspan="3">The URL of the request.</td>
    </tr>
    <tr id="ajax-options-method">
      <td><a href="#ajax-options-method"><code>method</code></a></td>
      <td><code>string</code></td>
      <td><code>GET</code></td>
    </tr>
    <tr>
      <td colspan="3">The request method. It can be one of the following: <code>GET</code>, <code>POST</code>, <code>PUT</code>, <code>PATCH</code>, <code>HEAD</code>, <code>OPTIONS</code>, <code>DELETE</code>.</td>
    </tr>
    <tr id="ajax-options-data">
      <td><a href="#ajax-options-data"><code>data</code></a></td>
      <td><code>any</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">The data to be sent to the server.</td>
    </tr>
    <tr id="ajax-options-processData">
      <td><a href="#ajax-options-processData"><code>processData</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether to convert the data passed into a query string.</td>
    </tr>
    <tr id="ajax-options-async">
      <td><a href="#ajax-options-async"><code>async</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether the request should be handled asynchronously.</td>
    </tr>
    <tr id="ajax-options-cache">
      <td><a href="#ajax-options-cache"><code>cache</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether to cache the request. This is only applicable to <code>GET</code> and <code>HEAD</code> requests.</td>
    </tr>
    <tr id="ajax-options-username">
      <td><a href="#ajax-options-username"><code>username</code></a></td>
      <td><code>string</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">The username for HTTP authentication.</td>
    </tr>
    <tr id="ajax-options-password">
      <td><a href="#ajax-options-password"><code>password</code></a></td>
      <td><code>string</code></td>
      <td><code>''</code></td>
    </tr>
    <tr>
      <td colspan="3">The password for HTTP authentication.</td>
    </tr>
    <tr id="ajax-options-headers">
      <td><a href="#ajax-options-headers"><code>headers</code></a></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td colspan="3">Data to be added to the headers. This can be overridden in the <code>beforeSend</code> callback. Fields with string or <code>null</code> values will be sent, fields with <code>undefined</code> values will be removed.</td>
    </tr>
    <tr id="ajax-options-xhrFields">
      <td><a href="#ajax-options-xhrFields"><code>xhrFields</code></a></td>
      <td><code>object</code></td>
      <td><code>{}</code></td>
    </tr>
    <tr>
      <td colspan="3">
        <p>This option allows you to set data on the <code>XMLHttpRequest</code> object.</p>
<pre><code class="language-js">$.ajax({
  url: 'a cross-domain URL',
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
        <p>An object of HTTP status codes and corresponding functions.</p>
<pre><code class="language-js">$.ajax({
  statusCode: {
    404: function (xhr, textStatus) {
      alert('Called when the status code is 404');
    },
    200: function (data, textStatus, xhr) {
      alert('Called when the status code is 200');
    }
  }
});</code></pre>
        <p>Status codes between 200 and 299, or status code 304, indicate success. The function parameters are the same as those for the <code>success</code> callback. For other status codes, the function parameters are the same as those for the <code>error</code> callback.</p>
      </td>
    </tr>
    <tr id="ajax-options-dataType">
      <td><a href="#ajax-options-dataType"><code>dataType</code></a></td>
      <td><code>string</code></td>
      <td><code>text</code></td>
    </tr>
    <tr>
      <td colspan="3">The type of data expected from the server. It can be either <code>text</code> or <code>json</code>.</td>
    </tr>
    <tr id="ajax-options-contentType">
      <td><a href="#ajax-options-contentType"><code>contentType</code></a></td>
      <td><code>string</code></td>
      <td><code>application/x-www-form-urlencoded</code></td>
    </tr>
    <tr>
      <td colspan="3">The content encoding type. Set to <code>false</code> to avoid setting the <code>Content-Type</code>.</td>
    </tr>
    <tr id="ajax-options-timeout">
      <td><a href="#ajax-options-timeout"><code>timeout</code></a></td>
      <td><code>number</code></td>
      <td><code>0</code></td>
    </tr>
    <tr>
      <td colspan="3">The request timeout in milliseconds. A value of <code>0</code> means no timeout.</td>
    </tr>
    <tr id="ajax-options-global">
      <td><a href="#ajax-options-global"><code>global</code></a></td>
      <td><code>boolean</code></td>
      <td><code>true</code></td>
    </tr>
    <tr>
      <td colspan="3">Whether to trigger global AJAX events.</td>
    </tr>
    <tr id="ajax-options-beforeSend">
      <td><a href="#ajax-options-beforeSend"><code>beforeSend</code></a></td>
      <td><code>function</code></td>
      <td>-</td>
    </tr>
    <tr>
      <td colspan="3">
        <p>This function is called before the request is sent. If it returns <code>false</code>, the AJAX request will be canceled.</p>
<pre><code class="language-js">$.ajax({
  beforeSend: function (xhr) {
    // xhr: the XMLHttpRequest object
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
        <p>This function is called after the request is successful.</p>
<pre><code class="language-js">$.ajax({
  success: function (data, textStatus, xhr) {
    // data: data returned by the AJAX request
    // textStatus: a string containing the success code
    // xhr: the XMLHttpRequest object
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
        <p>This function is called when an error occurs in the request.</p>
<pre><code class="language-js">$.ajax({
  error: function (xhr, textStatus) {
    // xhr: the XMLHttpRequest object
    // textStatus: a string containing the error code
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
        <p>This function is called when the request is complete, regardless of success or failure.</p>
<pre><code class="language-js">$.ajax({
  complete: function (xhr, textStatus) {
    // xhr: the XMLHttpRequest object
    // textStatus: a string describing the status
  }
});</code></pre>
      </td>
    </tr>
  </tbody>
</table>
