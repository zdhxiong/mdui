$.ready(function(){
  $.each( document.querySelectorAll('[data-md-fab]'), function(index, target){
    var options = $.parseOptions(target.getAttribute('data-md-fab'));
    new mdui.Fab(target, options);
  } );
});