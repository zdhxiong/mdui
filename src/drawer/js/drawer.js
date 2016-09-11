/**
 * 抽屉栏
 * 在桌面设备上默认显示抽屉栏，不显示遮罩层
 * 在手机和平板设备上默认不显示抽屉栏，始终显示遮罩层，且覆盖导航栏
 */
mdui.Drawer = (function () {

  /**
   * 默认参数
   * @type {{}}
   */
  var DEFAULT = {
    // 在桌面设备上是否显示遮罩层。手机和平板不受这个参数影响，始终会显示遮罩层
    mask: false,
    onOpening: function (inst) {
    },
    onOpened: function (inst) {
    },
    onClosing: function (inst) {
    },
    onClosed: function (inst) {
    }
  };

  /**
   * 调整超小屏上的宽度
   * 因为 css3 calc 兼容性不好，所以用js实现
   * @param inst
   */
  var drawerWidth = function(inst){
    var isScreenXs = mdui.screen.xs();

    var width = window.innerWidth - 56 + 'px';
    var transform = 'translateX(' + ( (inst.position == 'left' ? 10 : -10) - window.innerWidth) + 'px)';

    inst.target.style['width'] = isScreenXs ? width : '';
    inst.target.style['-webkit-transform'] = isScreenXs ? transform : '';
    inst.target.style['transform'] = isScreenXs ? transform : '';
  };

  /**
   * 抽屉栏实例
   * @param selector 选择器或 HTML 字符串或 DOM 元素
   * @param opts
   * @constructor
   */
  function Drawer(selector, opts) {
    var inst = this;

    inst.target = $.dom(selector)[0];

    var oldInst = $.getData(inst.target, 'drawer.mdui');
    if(oldInst){
      return oldInst;
    }

    inst.options = $.extend(DEFAULT, (opts || {}));

    inst.masked = false; // 是否显示着遮罩层
    inst.position = inst.target.classList.contains('md-drawer-right') ? 'right' : 'left';

    if (inst.target.classList.contains('md-drawer-close')) {
      inst.state = 'closed';
    } else if (inst.target.classList.contains('md-drawer-open')) {
      inst.state = 'opened';
    } else if (mdui.screen.mdUp()) {
      inst.state = 'opened';
    } else {
      inst.state = 'closed';
    }

    // 浏览器窗口大小调整时
    $.on(window, 'resize', function () {
      //由手机平板切换到桌面时
      if (mdui.screen.mdUp()) {
        // 如果显示着遮罩，则隐藏遮罩
        if (inst.masked && !inst.options.mask) {
          mdui.hideMask();
          inst.masked = false;
        }
        // 没有强制关闭，则状态为打开状态
        if(!inst.target.classList.contains('md-drawer-close')){
          inst.state = 'opened';
        }
      }
      //由桌面切换到手机平板时。如果抽屉栏是打开着的且没有遮罩层，则关闭抽屉栏
      else {
        if (!inst.masked && inst.state === 'opened') {
          // 抽屉栏处于强制打开状态，添加遮罩
          if (inst.target.classList.contains('md-drawer-open')) {
            mdui.showMask(100);
            inst.masked = true;

            $.one( $.query('.md-mask'), 'click', function () {
              inst.close();
            });
          }else{
            inst.state = 'closed';
          }
        }
      }

      drawerWidth(inst);
    });

    // 不支持 touch 的设备默认隐藏滚动条，鼠标移入时显示滚动条；支持 touch 的设备会自动隐藏滚动条
    if (!mdui.support.touch) {
      inst.target.style['overflow-y'] = 'hidden';
      inst.target.classList.add('md-drawer-scrollbar');
    }
  }

  /**
   * 打开抽屉栏
   */
  Drawer.prototype.open = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      return;
    }

    // 超小屏上宽度为 100% - 56px
    drawerWidth(inst);

    inst.target.classList.remove('md-drawer-close');
    inst.target.classList.add('md-drawer-open');

    inst.state = 'opening';
    $.pluginEvent('opening', 'drawer', inst);

    if(!inst.options.mask){
      document.body.classList.add('md-drawer-body-' + inst.position);
    }

    $.transitionEnd(inst.target, function () {
      inst.state = 'opened';
      $.pluginEvent('opened', 'drawer', inst);
    });

    if (!mdui.screen.mdUp() || inst.options.mask) {
      mdui.showMask(100);
      inst.masked = true;

      $.one( $.query('.md-mask'), 'click', function () {
        inst.close();
      });
    }
  };

  /**
   * 关闭抽屉栏
   */
  Drawer.prototype.close = function () {
    var inst = this;

    if (inst.state === 'closing' || inst.state === 'closed') {
      return;
    }

    inst.target.classList.add('md-drawer-close');
    inst.target.classList.remove('md-drawer-open');
    inst.state = 'closing';
    $.pluginEvent('closing', 'drawer', inst);

    if(!inst.options.mask){
      document.body.classList.remove('md-drawer-body-' + inst.position);
    }

    $.transitionEnd(inst.target, function () {
      inst.state = 'closed';
      $.pluginEvent('closed', 'drawer', inst);
    });

    if (inst.masked) {
      mdui.hideMask();
      inst.masked = false;
    }
  };

  /**
   * 切换抽屉栏打开/关闭状态
   */
  Drawer.prototype.toggle = function () {
    var inst = this;

    if (inst.state === 'opening' || inst.state === 'opened') {
      inst.close();
    } else if (inst.state === 'closing' || inst.state === 'closed') {
      inst.open();
    }
  };

  /**
   * 获取抽屉栏状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Drawer.prototype.getState = function () {
    return this.state;
  };

  return Drawer;

})();