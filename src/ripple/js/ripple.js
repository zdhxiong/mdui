/**
 * =============================================================================
 * ************   涟漪   ************
 * =============================================================================
 *
 * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
 * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
 *
 * Inspired by https://github.com/fians/Waves
 */

(function () {

  var Ripple = {

    /**
     * 显示涟漪动画
     * @param e
     * @param $ripple
     */
    show: function (e, $ripple) {

      // 鼠标右键不产生涟漪
      if (e.button === 2) {
        return;
      }

      // 点击位置坐标
      var tmp;
      if ('touches' in e && e.touches.length) {
        tmp = e.touches[0];
      } else {
        tmp = e;
      }

      var touchStartX = tmp.pageX;
      var touchStartY = tmp.pageY;

      // 涟漪位置
      var offset = $ripple.offset();
      var center = {
        x: touchStartX - offset.left,
        y: touchStartY - offset.top,
      };

      var height = $ripple.innerHeight();
      var width = $ripple.innerWidth();
      var diameter = Math.max(
        Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
      );

      // 涟漪扩散动画
      var translate =
        'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) ' +
        'scale(1)';

      // 涟漪的 DOM 结构
      $('<div class="mdui-ripple-wave" style="' +
        'width: ' + diameter + 'px; ' +
        'height: ' + diameter + 'px; ' +
        'margin-top:-' + diameter / 2 + 'px; ' +
        'margin-left:-' + diameter / 2 + 'px; ' +
        'left:' + center.x + 'px; ' +
        'top:' + center.y + 'px;">' +
        '</div>')

        // 缓存动画效果
        .data('translate', translate)

        .prependTo($ripple)
        .reflow()
        .transform(translate);
    },

    /**
     * 隐藏涟漪动画
     */
    hide: function () {
      var $ripple = $(this);

      $ripple.children('.mdui-ripple-wave').each(function () {
        removeRipple($(this));
      });

      $ripple.off('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
    },
  };

  /**
   * 隐藏并移除涟漪
   * @param $wave
   */
  function removeRipple($wave) {
    if (!$wave.length || $wave.data('isRemoved')) {
      return;
    }

    $wave.data('isRemoved', true);

    var removeTimeout = setTimeout(function () {
      $wave.remove();
    }, 400);

    var translate = $wave.data('translate');

    $wave
      .addClass('mdui-ripple-wave-fill')
      .transform(translate.replace('scale(1)', 'scale(1.01)'))
      .transitionEnd(function () {
        clearTimeout(removeTimeout);

        $wave
          .addClass('mdui-ripple-wave-out')
          .transform(translate.replace('scale(1)', 'scale(1.01)'));

        removeTimeout = setTimeout(function () {
          $wave.remove();
        }, 700);

        setTimeout(function () {
          $wave.transitionEnd(function () {
            clearTimeout(removeTimeout);
            $wave.remove();
          });
        }, 0);
      });
  }

  /**
   * 显示涟漪，并绑定 touchend 等事件
   * @param e
   */
  function showRipple(e) {
    if (!TouchHandler.isAllow(e)) {
      return;
    }

    TouchHandler.register(e);

    var $ripple;
    var $target = $(e.target);

    // 获取含 .mdui-ripple 类的元素
    if ($target.hasClass('mdui-ripple')) {
      $ripple = $target;
    } else {
      $ripple = $target.parents('.mdui-ripple').eq(0);
    }

    if ($ripple.length) {

      // 禁用状态的元素上不产生涟漪效果
      if ($ripple[0].disabled || $ripple.attr('disabled') !== null) {
        return;
      }

      Ripple.show(e, $ripple);

      $ripple.on('touchmove touchend touchcancel mousemove mouseup mouseleave', Ripple.hide);
    }
  }

  // 初始化绑定的事件
  $document
    .on(TouchHandler.start, showRipple)
    .on(TouchHandler.unlock, TouchHandler.register);
})();
