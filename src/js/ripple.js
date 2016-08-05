/**
 * 水波纹
 */
(function(){

  /**
   * 没有 waves-effect 的是没有初始化的，在鼠标进入时添加水波纹效果
   */
  $(document).on('mouseenter', '.md-ripple:not([class*="waves-effect"])', function(){
    var $this = $(this);
    var classVal = $this.attr('class');

    Waves.attach(this);
  });

  Waves.init();

})();