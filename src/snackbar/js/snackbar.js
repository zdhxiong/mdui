/**
 * snackbar 和 toast
 * ============================================================================
 */
(function(){

  /**
   * 当前打开着的 Snackbar
   */
  var current;

  /**
   * 对列名
   * @type {string}
   */
  var queueName = '__md_snackbar';

  var DEFAULT = {
    massage: '',                    // 文本内容
    hold: 4000,                     // 多长时间自动隐藏
    minHold: 400,                   // 至少停留多长时间才自动关闭
    buttonText: 'dismiss',          // 按钮的文本
    buttonColor: '#90CAF9',         // 按钮的颜色
    closeOnButtonClick: true,       // 点击按钮时关闭
    onButtonClick: function(){},    // 点击按钮的回调
    onClose: function(){}           // 关闭后的回调
  };

  /**
   * Snackbar 实例
   * @param opts
   * @constructor
   */
  function Snackbar(opts){
    var inst = this;

    inst.options = $.extend(DEFAULT, (opts || {}));

    // message 参数必须
    if(!inst.options.message){
      return;
    }

    inst.state = 'closed';

    // 按钮颜色
    var buttonColorStyle = '', buttonColorClass = '';
    if(inst.options.buttonColor.indexOf('#') === 0 || inst.options.buttonColor.indexOf('rgb') === 0) {
      buttonColorStyle = 'style="color:' + inst.options.buttonColor + '"';
    }else if(inst.options.buttonColor !== ''){
      buttonColorClass = 'md-text-color-' + inst.options.buttonColor;
    }

    // 添加 HTML
    var tpl =
      '<div class="md-snackbar ' + (mdui.screen.mdUp() ? 'md-snackbar-desktop' : 'md-snackbar-mobile') + '">' +
        '<div class="md-snackbar-text">' + inst.options.message + '</div>' +
        (inst.options.buttonText ? ('<a href="javascript:void(0)" class="md-snackbar-action md-btn md-ripple md-ripple-white ' + buttonColorClass + '" ' + buttonColorStyle + '>' + inst.options.buttonText + '</a>') : '') +
      '</div>';
    inst.snackbar = $.dom(tpl)[0];
    document.body.appendChild(inst.snackbar);

    // 设置位置
    inst.snackbar.style['transform'] = 'translateY(' + inst.snackbar.clientHeight + 'px)';
    inst.snackbar.style['left'] = (document.body.clientWidth - inst.snackbar.clientWidth) / 2 + 'px';
    $.getStyle(inst.snackbar, 'transform');
    inst.snackbar.style['-webkit-transition'] = '-webkit-transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    inst.snackbar.style['transition'] = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';

    // 有按钮时绑定事件
    var action = $.query('.md-snackbar-action', inst.snackbar);
    if(inst.options.buttonText){
      $.on(action, 'click', function(){
        inst.close();
      });
    }
  }

  /**
   * 打开 Snackbar
   */
  Snackbar.prototype.open = function(){
    var inst = this;

    // 如果当前有正在显示的 Snackbar，则先加入队列，等旧 Snackbar 关闭后再打开
    if(current){
      $.queue(queueName, function(){
        inst.open();
      });
      return;
    }

    current = inst;

    // 开始打开
    inst.snackbar.style['transform'] = 'translateY(0)';

    // 动画结束后开始计时，hold 时间到后关闭
    $.transitionEnd(inst.snackbar, function(){
      inst.timeoutId = setTimeout(function(){
        inst.close();
      }, inst.options.hold);
    });
  };

  /**
   * 关闭 Snackbar
   */
  Snackbar.prototype.close = function(){
    var inst = this;

    inst.snackbar.style['transform'] = 'translateY(' + inst.snackbar.clientHeight + 'px)';

  };

  /**
   * 销毁 Snackbar
   */
  Snackbar.prototype.destroy = function(){
    var inst = this;


  };


  /**
   * 打开 Snackbar
   * @param params
   */
  mdui.snackbar = function(params){
    var inst = new Snackbar(params);

    inst.open();
  };

  /**
   * 打开 toast
   * @param params
   */
  mdui.toast = function(params){
    if(!params){
      return;
    }

    var opts = {
      buttonText: false
    };

    if(typeof params.message !== 'undefined'){
      opts.message = params.message;
    }
    if(typeof params.hold !== 'undefined'){
      opts.hold = params.hold;
    }
    if(typeof params.minHold !== 'undefined'){
      opts.minHold = params.minHold;
    }

    var inst = new Snackbar(opts);

    inst.open();
  };

})();