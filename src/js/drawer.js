/**
 * 抽屉栏
 * 在桌面设备上默认显示抽屉栏，不显示遮罩层
 * 在手机和平板设备上默认不显示抽屉栏，始终显示遮罩层，且覆盖导航栏
 */
(function($, util){

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    //width: 232 //抽屉栏宽度，仅桌面和平板设备有效。手机上始终距离右侧 56px
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
    inst.$body = $('body');
    inst.masked = false;//是否显示着遮罩层

    inst.drawer_left = inst.$drawer.hasClass('md-drawer-right') ? false : true;
    inst.drawer_right = !inst.drawer_left;

    if(inst.$drawer.length > 0){
      inst.$drawer = inst.$drawer.eq(0);
    }

    if(inst.$drawer.hasClass('md-drawer-close')){
      inst.state = 'closed';
    }else if(inst.$drawer.hasClass('md-drawer-open')){
      inst.state = 'opened';
    }else if(util.isDesktop()){
      inst.state = 'opened';
    }else{
      inst.state = 'closed';
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

    inst.$drawer.removeClass('md-drawer-close').addClass('md-drawer-open');
    inst.state = 'opening';
    inst.$drawer.trigger('opening.drawer.mdui', [inst]);

    if(inst.drawer_right){
      inst.$body.addClass('md-drawer-body-right');
    }
    if(inst.drawer_left){
      inst.$body.addClass('md-drawer-body-left');
    }

    util.transitionEnd(inst.$drawer, function(){
      inst.state = 'opened';
      inst.$drawer.trigger('opened.drawer.mdui', [inst]);
    });

    if(!util.isDesktop()){
      util.showMask(100);
      inst.masked = true;

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

    inst.$drawer.addClass('md-drawer-close').removeClass('md-drawer-open');
    inst.state = 'closing';
    inst.$drawer.trigger('closing.drawer.mdui', [inst]);

    if(inst.drawer_right){
      inst.$body.removeClass('md-drawer-body-right');
    }
    if(inst.drawer_left){
      inst.$body.removeClass('md-drawer-body-left');
    }

    util.transitionEnd(inst.$drawer, function(){
      inst.state = 'closed';
      inst.$drawer.trigger('closed.drawer.mdui', [inst]);
    });

    if(inst.masked){
      util.hideMask();
      inst.masked = false;
    }
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