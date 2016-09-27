/**
 * snackbar 和 toast
 * ============================================================================
 */
(function(){

  // 当前正在显示的 snackbar
  var current;

  var DEFAULT = {
    massage: '',            // 文本内容
    hold: 4000,             // 多长时间自动隐藏
    minHold: 400,           // 至少停留多长时间
    button: {
      text: 'dismiss',      // 按钮的文本
      color: 'blue',        // 按钮的颜色
      close: true,          // 点击按钮后是否关闭
      onClick: function(){} // 点击按钮的回调函数
    },
    onClose: function(){}   // 关闭的回掉函数
  };

  /**
   * Snackbar 实例
   * @param opts
   * @constructor
   */
  function Snackbar(opts){
    var inst = this;

    var buttonOpts = $.extend(DEFAULT.button, (opts.button || {}));
    inst.options = $.extend(DEFAULT, (opts || {}));

    // 添加 HTML
    var tpl = '<div class="md-snackbar"><div class="md-snackbar-text">' + inst.options.message + '</div><a href="javascript:void(0)" class="md-snackbar-action md-btn md-ripple md-ripple-white">' + inst.options.button.text + '</a></div>';
    inst.snackbar = $.dom(tpl)[0];
    document.body.appendChild(inst.snackbar);

    // 设置样式
    inst.snackbar.style['transform'] = 'translateY(' + inst.snackbar.clientHeight + 'px)';
    inst.snackbar.style['left'] = (document.body.clientWidth - inst.snackbar.clientWidth) / 2 + 'px';
  }

  /**
   * 打开 Snackbar
   */
  Snackbar.prototype.open = function(){
    var inst = this;

    setTimeout(function(){
      inst.snackbar.style['-webkit-transition'] = '-webkit-transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      inst.snackbar.style['transition'] = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      inst.snackbar.style['transform'] = 'translateY(0)';
    }, 0);
  };

  /**
   * 关闭 Snackbar
   */
  Snackbar.prototype.close = function(){
    var inst = this;

    inst.snackbar.style['transform'] = 'translateY(' + inst.snackbar.clientHeight + 'px)';

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
      button: false,
      onClose: function(){return false;}
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