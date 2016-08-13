/**
 * 浮动操作按钮
 */
(function(){

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
  };

  /**
   * 浮动操作按钮实例
   * @param $dom
   * @param opts
   * @constructor
   */
  function Fab($dom, opts){
    var inst = this;

    inst.options = $.extend({}, DEFAULT, (opts || {}));

    inst.$dom = $dom;
  }

  /**
   * 打开表盘
   */
  Fab.prototype.openDial = function(){

  };

  /**
   * 关闭表盘
   */
  Fab.prototype.closeDial = function(){

  };

  /**
   * 显示按钮，带动画
   */
  Fab.prototype.show = function(){

  };

  /**
   * 隐藏按钮
   */
  Fab.prototype.hide = function(){

  };

})();