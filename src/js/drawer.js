/**
 * 抽屉栏
 * 在手机和平板设备上始终显示遮罩层，且覆盖导航栏
 */
(function($, util){

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    mask: false //在桌面设备上是否显示遮罩层。在手机和平板上不受这个参数影响，始终会显示遮罩层
  };

  /**
   * 抽屉栏实例
   * @param $drawer
   * @param opts
   * @constructor
   */
  function Drawer($drawer, opts){
    var inst = this;

    inst.options = $.extend({}, DEFAULT, (opts || {}));

    inst.$drawer = $drawer;
    if(inst.$drawer.length > 0){
      inst.$drawer = inst.$drawer.eq(0);
    }

    if(inst.$drawer.hasClass('md-drawer-close')){
      inst.state = 'closed';
    }else{
      inst.state = 'opened';
    }
  }

  /**
   * 打开抽屉栏
   */
  Drawer.prototype.open = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    inst.$drawer.removeClass('md-drawer-close');
    inst.state = 'opening';
    inst.$drawer.trigger('opening.drawer.mdui', [inst]);

    util.transitionEnd(inst.$drawer, function(){
      inst.state = 'opened';
      inst.$drawer.trigger('opened.drawer.mdui', [inst]);
    });

    if(inst.options.mask){
      util.showMask(100);

      $('.md-mask').one('click.mask.drawer.mdui', function(){
        inst.close();
      });
    }
  };

  /**
   * 关闭抽屉栏
   */
  Drawer.prototype.close = function(){
    var inst = this;

    if(inst.state === 'closing' || inst.state === 'closed'){
      return;
    }

    inst.$drawer.addClass('md-drawer-close');
    inst.state = 'closing';
    inst.$drawer.trigger('closing.drawer.mdui', [inst]);

    util.transitionEnd(inst.$drawer, function(){
      inst.state = 'closed';
      inst.$drawer.trigger('closed.drawer.mdui', [inst]);
    });

    util.hideMask();
  };

  /**
   * 切换抽屉栏打开/关闭状态
   */
  Drawer.prototype.toggle = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      inst.close();
    }else if(inst.state === 'closing' || inst.state === 'closed'){
      inst.open();
    }
  };

  /**
   * 获取抽屉栏状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Drawer.prototype.getState = function(){
    return this.state;
  };


  /**
   * jQuery 插件
   * @param option
   * @returns {*}
   */
  $.fn.mduiDrawer = function(option){
    var inst;
    this.each(function(){
      var $this = $(this);
      inst = $this.data('drawer-inst-mdui');

      if(!inst){
        var options = $.extend(
            {},
            util.parseOptions($this.data('md-options-drawer')),
            typeof option === 'object' && option
        );

        inst = new Drawer($this, options);
        $this.data('drawer-inst-mdui', inst);
      }
    });

    return inst;
  };

  // data api
  $(function(){
    $(document).on('click.drawer.data-api.mdui', '[data-md-model="drawer"]', function(e){
      var $this = $(this);
      var options = util.parseOptions($this.data('md-options-drawer'));
      var $target = $(options.target || '.md-drawer');

      if($this.is('a')){
        e.preventDefault();
      }

      $target.mduiDrawer(options).toggle();
    });
  });

})($, util);