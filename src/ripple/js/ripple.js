/**
 * =============================================================================
 * ************   涟漪   ************
 * =============================================================================
 *
 * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
 * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
 */

(function () {

  var touchStartX;
  var touchStartY;
  var rippleWave;
  var rippleTarget;
  var rippleTransform;

  /**
   * 找到含 mdui-ripple 类的元素，如果当前元素不存在 mdui-ripple 类，则从父元素找
   * 含 .mdui-disabled 类和 disabled 属性的元素不产生涟漪
   * @param el
   * @returns {*}
   */
  function findRippleElement(el) {
    var target;
    var rippleParents;

    if (el.classList.contains('mdui-ripple')) {
      target = el;
    } else {
      rippleParents = $.parents(el, '.mdui-ripple');
      if (rippleParents.length) {
        target = rippleParents[0];
      }
    }

    if (
      target &&
      !target.classList.contains('mdui-disabled') &&
      target.getAttribute('disabled') === null
    ) {
      return target;
    } else {
      return false;
    }
  }

  /**
   * 创建涟漪动画
   * @param x
   * @param y
   * @param el
   */
  function createRipple(x, y, el) {
    // 计算涟漪位置
    // ===========
    var box = el.getBoundingClientRect();
    var offset = $.offset(el);
    var center;

    // 涟漪始终从中心扩散的元素
    if (

      // el.classList.contains('mdui-btn-icon') ||
      // el.classList.contains('mdui-btn-fab') ||
      // el.classList.contains('mdui-btn-fab-mini')
      false
    ) {
      center = {
        x: box.width / 2,
        y: box.height / 2,
      };
    }

    // 其他元素上涟漪从鼠标点击位置开始扩散
    else {
      center = {
        x: x - offset.left,
        y: y - offset.top,
      };
    }

    var height = box.height;
    var width = box.width;
    var diameter = Math.max(
        Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
    );

    // 添加涟漪
    // ========
    rippleWave = $.dom('<div class="mdui-ripple-wave" style="' +
        'width: ' + diameter + 'px; ' +
        'height: ' + diameter + 'px; ' +
        'margin-top:-' + diameter / 2 + 'px; ' +
        'margin-left:-' + diameter / 2 + 'px; ' +
        'left:' + center.x + 'px; ' +
        'top:' + center.y + 'px;">' +
        '</div>')[0];
    $.prepend(el, rippleWave);
    $.getStyle(rippleWave, 'opacity');
    rippleTransform =
      'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) ' +
      'scale(1)';
    $.transform(rippleWave, rippleTransform);
  }

  /**
   * 移除涟漪动画
   */
  function removeRipple() {
    if (!rippleWave) {
      return;
    }

    var toRemove = rippleWave;

    var removeTimeout = setTimeout(function () {
      $.remove(toRemove);
    }, 400);

    rippleWave.classList.add('mdui-ripple-wave-fill');
    $.transform(rippleWave, rippleTransform.replace('scale(1)', 'scale(1.01)'));
    $.transitionEnd(rippleWave, function (e) {
      clearTimeout(removeTimeout);

      var rippleWave = e.target;
      rippleWave.classList.add('mdui-ripple-wave-out');
      $.transform(rippleWave, rippleTransform.replace('scale(1)', 'scale(1.01)'));

      removeTimeout = setTimeout(function () {
        $.remove(rippleWave);
      }, 700);

      setTimeout(function () {
        $.transitionEnd(rippleWave, function (e) {
          clearTimeout(removeTimeout);
          $.remove(e.target);
        });
      }, 0);
    });

    rippleWave = rippleTarget = undefined;
  }

  function rippleTouchStart(el) {
    rippleTarget = findRippleElement(el);
    if (!rippleTarget) {
      rippleTarget = undefined;
      return;
    }

    createRipple(touchStartX, touchStartY, rippleTarget);
  }

  function rippleTouchMove() {
    removeRipple();
  }

  function rippleTouchEnd() {
    removeRipple();
  }

  // 事件监听
  // ======
  $.on(document, mdui.touchEvents.start, '.mdui-ripple', function (e) {
    touchStartX = mdui.support.touch ? e.targetTouches[0].pageX : e.pageX;
    touchStartY = mdui.support.touch ? e.targetTouches[0].pageY : e.pageY;
    rippleTouchStart(e.target);
  });

  $.on(document, mdui.touchEvents.move, '.mdui-ripple', function () {
    rippleTouchMove();
  });

  $.on(document, mdui.touchEvents.end, '.mdui-ripple', function () {
    rippleTouchEnd();
  });
})();
