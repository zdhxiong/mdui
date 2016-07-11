// MDUI requires jQuery
if (typeof jQuery === 'undefined') {
  throw new Error('MDUI\'s JavaScript requires jQuery');
}

// check jQuery version
(function($){
  var version = $.fn.jquery.split(' ')[0].split('.');
  for(var i = 0; i < version.length; i++){
    version[i] = parseInt(version[i]);
  }

  if ((version[0] < 2 && version[1] < 9) || (version[0] === 1 && version[1] === 9 && version[2] < 1) || (version[0] >= 4)) {
    throw new Error('MDUI\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
  }
})(jQuery);


var mdui = {};
var util = {};