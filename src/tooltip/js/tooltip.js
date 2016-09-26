/**
 * ToolTip 工具提示
 * =============================================================================
 */

mdui.Tooltip = (function(){

  /**
   * 默认参数
   */
  var DEFAULT = {
    position: 'auto',     // 提示所在位置
    delay: 0,             // 延迟，单位毫秒
    content: ''           // 提示文本，允许包含 HTML
  };

  /**
   * 自动判断 Tooltip 位置
   * @param inst
   */
  function setPosition(inst){
    var targetOffset = $.offset(inst.target);
    var targetProps = inst.target.getBoundingClientRect();

    var left = targetOffset.left + (targetProps.width / 2);
    var top = targetOffset.top + (targetProps.height / 2);

    var marginLeft = -1 * (inst.tooltip.offsetWidth / 2);
    var marginTop = (targetProps.height / 2) + (mdui.support.touch ? 24 : 14);

    inst.tooltip.style.top = top + 'px';
    inst.tooltip.style.left = left + 'px';
    inst.tooltip.style['margin-left'] = marginLeft + 'px';
    inst.tooltip.style['margin-top'] = marginTop + 'px';
  }

  /**
   * Tooltip 实例
   * @param selector
   * @param opts
   * @returns {*|string}
   * @constructor
   */
  function Tooltip(selector, opts) {
    var inst = this;

    inst.target = $.dom(selector)[0];

    // 已通过 data 属性实例化过，不再重复实例化
    var oldInst = $.getData(inst.target, 'mdui.tooltip');
    if(oldInst){
      return oldInst;
    }

    inst.options = $.extend(DEFAULT, (opts || {}));
    inst.state = 'closed';

    // 创建 Tooltip HTML
    var guid = mdui.guid();
    inst.tooltip = $.dom('<div class="md-tooltip ' + (mdui.support.touch ? 'md-tooltip-mobile' : 'md-tooltip-desktop') + '" id="md-tooltip-' + guid + '">' + inst.options.content + '</div>')[0];
    document.body.appendChild(inst.tooltip);

    // 绑定事件
    var openEvent = mdui.support.touch ? 'touchstart' : 'mouseenter';
    var closeEvent = mdui.support.touch ? 'touchend' : 'mouseleave';
    $.on(inst.target, openEvent, function(){
      inst.open();
    });
    $.on(inst.target, closeEvent, function(){
      inst.close();
    });
  }

  /**
   * 打开 Tooltip
   * @param opts 允许每次打开时设置不同的参数
   */
  Tooltip.prototype.open = function (opts) {
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    var oldOpts = inst.options;

    // 合并 data 属性参数
    var dataOpts = $.parseOptions(inst.target.getAttribute('data-md-tooltip'));
    inst.options = $.extend(inst.options, dataOpts);

    if(opts) {
      inst.options = $.extend(inst.options, opts);
    }

    if(oldOpts.content !== inst.options.content) {
      inst.tooltip.innerHTML = inst.options.content;
    }

    setPosition(inst);

    inst.timeoutId = setTimeout(function(){
      inst.tooltip.classList.add('md-tooltip-open');
    }, inst.options.delay);
  };

  /**
   * 关闭 Tooltip
   */
  Tooltip.prototype.close = function () {
    var inst = this;

    clearTimeout(inst.timeoutId);
    inst.tooltip.classList.remove('md-tooltip-open');
  };

  /**
   * 切换 Tooltip 状态
   */
  Tooltip.prototype.toggle = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      inst.close();
    }
    if(inst.state === 'closing' || inst.state === 'closed'){
      inst.open();
    }
  };

  /**
   * 获取 Tooltip 状态
   * @returns {'opening'|'opened'|'closing'|'closed'}
   */
  Tooltip.prototype.getState = function(){
    return this.state;
  };

  /**
   * 销毁 Tooltip
   */
  Tooltip.prototype.destroy = function(){
    var inst = this;
    clearTimeout(inst.timeoutId);
    $.removeData(inst.target, 'mdui.tooltip');
    if(typeof jQuery !== 'undefined'){
      jQuery(inst.target).removeData('mdui.tooltip');
    }
    inst.tooltip.parentNode.removeChild(inst.tooltip);
  };

  return Tooltip;

})();