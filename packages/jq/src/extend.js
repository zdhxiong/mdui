import $ from './$';

function extend(...args) {
  if (!args.length) {
    return this;
  }

  // $.extend(obj)
  if (args.length === 1) {
    Object.keys(args[0]).forEach((prop) => {
      this[prop] = args[0][prop];
    });

    return this;
  }

  // $.extend({}, defaults[, obj])
  const target = args.shift();

  for (let i = 0; i < args.length; i += 1) {
    Object.keys(args[i]).forEach((prop) => {
      target[prop] = args[i][prop];
    });
  }

  return target;
}

$.fn.extend = extend;
$.extend = extend;
