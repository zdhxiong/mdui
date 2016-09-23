/**
 * ToolTip 工具提示
 * =============================================================================
 */

mdui.Tooltip = (function(){

  /**
   * 默认参数
   */
  var DEFAULT = {
    // 提示位置
    position: 'auto',
    // 延迟，单位毫秒
    delay: 0,
    // 提示文本，允许包含 HTML
    text: '',

    // 回调
    onOpening: function(inst){},
    onOpened: function(inst){},
    onClosing: function(inst){},
    onClosed: function(inst){}
  };

  /**
   * 自动判断 Tooltip 位置
   * @param inst
   */
  function setPosition(inst){
    var props = inst.target.getBoundingClientRect();
    var left = props.left + (props.width / 2);
    var top = props.top + (props.height / 2);
    var marginLeft = -1 * (inst.tooltip.offsetWidth / 2);
    var marginTop = -1 * (inst.tooltip.offsetHeight / 2);
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
    var oldInst = $.getData(inst.target, 'tooltip.mdui');
    if(oldInst){
      return oldInst;
    }

    inst.options = $.extend(DEFAULT, (opts || {}));
    inst.state = 'closed';

    var guid = mdui.guid();
    inst.tooltip = $.dom('<div class="md-tooltip ' + (mdui.support.touch ? 'md-tooltip-mobile' : 'md-tooltip-desktop') + '" id="md-tooltip-' + guid + '">' + inst.options.text + '</div>')[0];
    document.body.appendChild(inst.tooltip);
  }

  /**
   * 打开 Tooltip
   * @param opts
   */
  Tooltip.prototype.open = function (opts) {
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    var oldOpts = inst.options;
    if(opts) {
      inst.options = $.extend(inst.options, opts);
    }

    if(oldOpts.text !== inst.options.text) {
      inst.tooltip.innerHTML = inst.options.text;
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

  return Tooltip;

})();