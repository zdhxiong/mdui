/**
 * 浮动操作按钮
 */
(function(){

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    trigger: 'hover'
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
    inst.$dial = inst.$dom.find('.md-btn-fab-dial');
    inst.$dialFirstBtn = inst.$dial.find('.md-btn').first();
    inst.$dialLastBtn = inst.$dial.find('.md-btn').last();
    inst.state = 'closed';
  }

  /**
   * 打开表盘
   */
  Fab.prototype.open = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    inst.$dial.addClass('md-btn-fab-dial-show');
    inst.state = 'opening';
    inst.$dom.trigger('opening.fab.mdui', [inst]);

    // 打开顺序为从下倒上逐个打开，最上面的打开才表示动画完成
    mdui.transitionEnd(inst.$dialFirstBtn, function(){
      inst.state = 'opened';
      inst.$dom.trigger('opened.fab.mdui', [inst]);
    });
  };

  /**
   * 关闭表盘
   */
  Fab.prototype.close = function(){
    var inst = this;

    if(inst.state === 'closing' || inst.state === 'closed'){
      return;
    }

    inst.$dial.removeClass('md-btn-fab-dial-show');
    inst.state = 'closing';
    inst.$dom.trigger('closing.fab.mdui', [inst]);

    //从上往下依次关闭，最后一个关闭后才表示动画完成
    mdui.transitionEnd(inst.$dialLastBtn, function(){
      inst.state = 'closed';
      inst.$dom.trigger('closed.fab.mdui', [inst]);
    })
  };

  /**
   * 切换表盘的打开状态
   */
  Fab.prototype.toggle = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      inst.close();
    }else if(inst.state === 'closing' || inst.state === 'closed'){
      inst.open();
    }
  };

  /**
   * 获取表盘状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Fab.prototype.getState = function(){
    return this.state;
  };

  // JQUERY PLUGIN
  // =============
  function Plugin(option){
    var inst;
    this.each(function(){
      var $this = $(this);
      inst = $this.data('fab-inst-mdui');

      if(!inst){
        var options = $.extend(
          {},
          parseOptions($this.data('md-fab')),
          typeof option === 'object' && option
        );

        inst = new Fab($this, options);
        $this.data('fab-inst-mdui', inst);
      }
    });

    return inst;
  }

  var old = $.fn.mdFab;

  $.fn.mdFab = Plugin;
  $.fn.mdFab.Constructor = Fab;

  // NO CONFLICT
  // ===========
  $.fn.mdFab.noConflict = function(){
    $.fn.mdFab = old;
    return this;
  };

  $(function(){

    // DATA-API
    // ========
  });

})();