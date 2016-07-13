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

    // 默认使用深色水波纹
    // 添加浅色水波纹的情况是
    if(
      // 不存在已设置的颜色
      classVal.indexOf('md-ripple-') < 0 &&
      // 有深色背景色
      classVal.indexOf('md-color-') > -1 &&
      classVal.indexOf('md-color-white') < 0 &&
      classVal.indexOf('md-color-transparent') < 0
    ){
      $this.addClass('md-ripple-light');
    }

    Waves.attach(this);
  });

  Waves.init();

})();