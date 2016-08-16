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
    inst.$btn = inst.$dom.children('.md-btn');
    inst.$dial = inst.$dom.find('.md-btn-fab-dial');
    inst.$dialBtns = inst.$dial.find('.md-btn');

    inst.state = 'closed';

    // 支持 touch 时，始终在 touchstart 时切换，不受 trigger 参数影响
    if(mdui.support.touch) {
      inst.$btn.on('touchstart.fab.mdui', function(){
        inst.open();
      });

      mdui.$document.on('touchend.fab.mdui', function(e){
        var $target = $(e.target);
        if(!$target.parents('.md-btn-fab-wrapper').length){
          inst.close();
        }
      });
    }

    // 不支持 touch
    else{
      // 点击切换
      if(inst.options.trigger === 'click') {
        inst.$btn.on('click.fab.mdui', function(){
          inst.toggle();
        });
      }

      // 鼠标悬浮切换
      if(inst.options.trigger === 'hover') {
        inst.$dom.on('mouseenter.fab.mdui', function(){
          inst.open();
        });

        inst.$dom.on('mouseleave.fab.mdui', function(){
          inst.close();
        });
      }
    }
  }

  /**
   * 打开表盘
   */
  Fab.prototype.open = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    // 为表盘中的按钮添加不同的 transition-delay
    inst.$dialBtns.each(function(index){
      $(this).css('transition-delay', 15*(inst.$dialBtns.length - index) + 'ms');
    });

    inst.$dial.addClass('md-btn-fab-dial-show');
    inst.state = 'opening';
    inst.$dom.trigger('opening.fab.mdui', [inst]);

    // 打开顺序为从下到上逐个打开，最上面的打开后才表示动画完成
    mdui.transitionEnd(inst.$dialBtns.first(), function(){
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

    // 为表盘中的按钮添加不同的 transition-delay
    inst.$dialBtns.each(function(index){
      $(this).css('transition-delay', 15*index + 'ms');
    });

    inst.$dial.removeClass('md-btn-fab-dial-show');
    inst.state = 'closing';
    inst.$dom.trigger('closing.fab.mdui', [inst]);

    //从上往下依次关闭，最后一个关闭后才表示动画完成
    mdui.transitionEnd(inst.$dialBtns.last(), function(){
      inst.state = 'closed';
      inst.$dom.trigger('closed.fab.mdui', [inst]);
    });
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
    $('[data-md-fab]').each(function(){
      var $this = $(this);
      var options = parseOptions($this.data('md-fab'));
      $this.mdFab(options);
    });

  });

})();