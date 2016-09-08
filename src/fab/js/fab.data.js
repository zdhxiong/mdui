$.ready(function(){
  $.each( $.queryAll('[data-md-fab]'), function(index, target){
    var options = $.parseOptions(target.getAttribute('data-md-fab'));
    new mdui.Fab(target, options);
  } );
});