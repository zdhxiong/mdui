/**
 * Snackbar
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
    message: '',                    // 文本内容
    timeout: 4000,                  // 在用户没有操作时多长时间自动隐藏
    buttonText: '',                 // 按钮的文本
    buttonColor: '#90CAF9',         // 按钮的颜色，支持 blue #90caf9 rgba(...)
    closeOnButtonClick: true,       // 点击按钮时关闭
    closeOnOutsideClick: true,      // 触摸或点击屏幕其他地方时关闭
    onClick: function(){},          // 在 Snackbar 上点击的回调
    onButtonClick: function(){},    // 点击按钮的回调
    onClose: function(){}           // 关闭动画开始时的回调
  };

  /**
   * 点击 Snackbar 外面的区域关闭
   * @param e
   */
  var closeOnOutsideClick = function(e){
    if(!e.target.classList.contains('md-snackbar') && !$.parents(e.target, '.md-snackbar').length){
      current.close();
    }
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
    $.transform(inst.snackbar, 'translateY(' + inst.snackbar.clientHeight + 'px)');
    inst.snackbar.style['left'] = (document.body.clientWidth - inst.snackbar.clientWidth) / 2 + 'px';
    $.getStyle(inst.snackbar);
    inst.snackbar.classList.add('md-snackbar-transition');
  }

  /**
   * 打开 Snackbar
   */
  Snackbar.prototype.open = function(){
    var inst = this;

    if(inst.state === 'opening' || inst.state === 'opened'){
      return;
    }

    // 如果当前有正在显示的 Snackbar，则先加入队列，等旧 Snackbar 关闭后再打开
    if(current){
      $.queue(queueName, function(){
        inst.open();
      });
      return;
    }

    current = inst;

    // 开始打开
    inst.state = 'opening';
    $.transform(inst.snackbar, 'translateY(0)');

    $.transitionEnd(inst.snackbar, function(){
      inst.state = 'opened';

      // 有按钮时绑定事件
      if(inst.options.buttonText){
        var action = $.query('.md-snackbar-action', inst.snackbar);
        $.on(action, 'click', function(){
          inst.options.onButtonClick();
          if(inst.options.closeOnButtonClick) {
            inst.close();
          }
        });
      }

      // 点击 Snackbar 的事件
      $.on(inst.snackbar, 'click', function(e){
        if(!e.target.classList.contains('md-snackbar-action')){
          inst.options.onClick();
        }
      });

      // 点击 Snackbar 外面的区域关闭
      if(inst.options.closeOnOutsideClick){
        $.on(document, mdui.support.touch ? 'touchstart' : 'click', closeOnOutsideClick);
      }

      // 超时后自动关闭
      inst.timeoutId = setTimeout(function(){
        inst.close();
      }, inst.options.timeout);

    });
  };

  /**
   * 关闭 Snackbar
   */
  Snackbar.prototype.close = function(){
    var inst = this;

    if(inst.state === 'closing' || inst.state === 'closed'){
      return;
    }

    if(typeof inst.timeoutId !== 'undefined'){
      clearTimeout(inst.timeoutId);
    }

    if(inst.options.closeOnOutsideClick){
      $.off(document, mdui.support.touch ? 'touchstart' : 'click', closeOnOutsideClick);
    }

    inst.state = 'closing';
    $.transform(inst.snackbar, 'translateY(' + inst.snackbar.clientHeight + 'px)');
    inst.options.onClose();
    current = null;

    $.transitionEnd(inst.snackbar, function(){
      inst.state = 'closed';

      inst.snackbar.parentNode.removeChild(inst.snackbar);

      $.dequeue(queueName);
    });
  };

  /**
   * 打开 Snackbar
   * @param params
   */
  mdui.snackbar = function(params){
    var inst = new Snackbar(params);

    inst.open();
    return inst;
  };

})();
