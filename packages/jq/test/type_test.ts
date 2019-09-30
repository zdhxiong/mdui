import $ from '../es/index';

const getElementById = document.getElementById('test');
const querySelector = document.querySelector('.test');
const querySelectorAll = document.querySelectorAll('.test');
const getElementsByClassName = document.getElementsByClassName('test');
const getElementsByTagName = document.getElementsByTagName('div');
const getElementsByName = document.getElementsByName('test');
const textNode = document.createTextNode('test');

// $()
$(getElementById);
$(querySelector);
$(querySelectorAll);
$(getElementsByClassName);
$(getElementsByTagName);
$(getElementsByName);
const $elements = $('.test');

// .add()
