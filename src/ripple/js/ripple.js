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
     * @param element
     */
    show: function (e, element) {

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
      var box = element.getBoundingClientRect();
      var offset = $.offset(element);
      var center = {
        x: touchStartX - offset.left,
        y: touchStartY - offset.top,
      };

      var height = box.height;
      var width = box.width;
      var diameter = Math.max(
        Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
      );

      // 涟漪扩散动画
      var translate =
        'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) ' +
        'scale(1)';

      // 涟漪的 DOM 结构
      var ripple = $.dom('<div class="mdui-ripple-wave" style="' +
        'width: ' + diameter + 'px; ' +
        'height: ' + diameter + 'px; ' +
        'margin-top:-' + diameter / 2 + 'px; ' +
        'margin-left:-' + diameter / 2 + 'px; ' +
        'left:' + center.x + 'px; ' +
        'top:' + center.y + 'px;">' +
        '</div>')[0];

      // 缓存动画效果
      $.data(ripple, {
        translate: translate,
      });

      $.prepend(element, ripple);
      $.relayout(ripple);
      $.transform(ripple, translate);
    },

    /**
     * 隐藏涟漪动画
     * @param e
     * @param element
     */
    hide: function (e, element) {
      element = element || this;

      var ripples = $.children(element, '.mdui-ripple-wave');

      $.each(ripples, function (i, ripple) {
        removeRipple(ripple);
      });

      if (mdui.support.touch) {
        $.off(element, 'touchmove touchend touchcancel', Ripple.hide);
      }

      $.off(element, 'mousemove mouseup mouseleave', Ripple.hide);
    },
  };

  /**
   * 隐藏并移除涟漪
   * @param ripple
   */
  function removeRipple(ripple) {
    if (!ripple || $.data(ripple, 'isRemoved')) {
      return;
    }

    $.data(ripple, 'isRemoved', true);

    var removeTimeout = setTimeout(function () {
      $.remove(ripple);
    }, 400);

    ripple.classList.add('mdui-ripple-wave-fill');
    var translate = $.data(ripple, 'translate');
    $.transform(ripple, translate.replace('scale(1)', 'scale(1.01)'));
    $.transitionEnd(ripple, function (e) {
      clearTimeout(removeTimeout);

      var ripple = e.target;
      ripple.classList.add('mdui-ripple-wave-out');
      $.transform(ripple, translate.replace('scale(1)', 'scale(1.01)'));

      removeTimeout = setTimeout(function () {
        $.remove(ripple);
      }, 700);

      setTimeout(function () {
        $.transitionEnd(ripple, function (e) {
          clearTimeout(removeTimeout);
          $.remove(e.target);
        });
      }, 0);
    });
  }

  /**
   * touch 事件后的 500ms 内禁用 mousedown 事件
   */
  var TouchHandler = {
    touches: 0,

    allowEvent: function (e) {
      var allow = true;

      if (e.type === 'mousedown' && TouchHandler.touches) {
        allow = false;
      }

      return allow;
    },

    registerEvent: function (e) {
      var eType = e.type;

      if (eType === 'touchstart') {
        TouchHandler.touches += 1;
      } else if (['touchmove', 'touchend', 'touchcancel'].indexOf(eType) > -1) {
        setTimeout(function () {
          if (TouchHandler.touches) {
            TouchHandler.touches -= 1;
          }
        }, 500);
      }
    },
  };

  /**
   * 找到含 .mdui-ripple 类的元素
   * @param e
   * @returns {*}
   */
  function getRippleElement(e) {
    if (TouchHandler.allowEvent(e) === false) {
      return null;
    }

    var element = null;
    var target = e.target;
    var rippleParents;

    if (target.classList.contains('mdui-ripple')) {
      element = target;
    } else {
      rippleParents = $.parents(target, '.mdui-ripple');
      if (rippleParents.length) {
        element = rippleParents[0];
      }
    }

    return element;
  }

  /**
   * 显示涟漪，并绑定 touchend 等事件
   * @param e
   */
  function showRipple(e) {
    var element = getRippleElement(e);

    if (element !== null) {

      // 禁用状态的元素上不产生涟漪效果
      if (element.disabled || element.getAttribute('disabled')) {
        return;
      }

      TouchHandler.registerEvent(e);

      Ripple.show(e, element);

      if (mdui.support.touch) {
        $.on(element, 'touchmove touchend touchcancel', Ripple.hide);
      }

      $.on(element, 'mousemove mouseup mouseleave', Ripple.hide);
    }
  }

  // 初始化绑定的事件
  if (mdui.support.touch) {
    $.on(document, 'touchstart', showRipple);
    $.on(document, 'touchmove touchend touchcancel', TouchHandler.registerEvent);
  }

  $.on(document, 'mousedown', showRipple);
})();
