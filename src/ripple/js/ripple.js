/**
 * 涟漪
 *
 * Inspired by https://github.com/nolimits4web/Framework7/blob/master/src/js/fast-clicks.js
 * https://github.com/nolimits4web/Framework7/blob/master/LICENSE
 */
(function () {

  var touchStartX, touchStartY;
  var rippleWave, rippleTarget, rippleTransform;

  /**
   * 找到含 md-ripple 类的元素，如果当前元素不存在 md-ripple 类，则从父元素找
   * 含 .md-disabled 类和 disabled 属性的元素不产生涟漪
   * @param el
   * @returns {*}
   */
  function findRippleElement(el) {
    var target, rippleParents;

    if(el.classList.contains('md-ripple')){
      target = el;
    }else{
      rippleParents = $.parents(el, '.md-ripple');
      if(rippleParents.length){
        target = rippleParents[0];
      }
    }
    if(target && !target.classList.contains('md-disabled') && target.getAttribute('disabled') === null){
      return target;
    }else{
      return false;
    }
  }

  /**
   * 获取 body 中的 md-theme-[color] 的颜色值
   */
  function getThemeColorName() {
    var bodyClassStr = document.body.getAttribute('class');
    if(bodyClassStr){
      var themeColorClassArray = bodyClassStr.match(/md-theme-(\w+)/g);
      if (themeColorClassArray) {
        var themeColorName = themeColorClassArray[themeColorClassArray.length - 1].replace('md-theme-', '');
        if(mdui.isColorDark[themeColorName]){
          return themeColorName;
        }
      }
    }
    return 'primary';
  }

  /**
   * 创建涟漪动画
   * @param x
   * @param y
   * @param el
   */
  function createRipple(x, y, el) {
    // 设置涟漪颜色
    // ===========
    var classStr = el.getAttribute('class') || '';
    var rippleColorClass = '';

    // md-ripple 元素上 md-ripple- 开头的类都是设置颜色的，不存在颜色类时，自动判断
    if (classStr.indexOf('md-ripple-') < 0) {
      var colorReg = /(md-color-\w+(-\w+)?(-\w+)?)/g;
      var colorClassArray = classStr.match(colorReg);

      // 存在背景色，根据背景色判断使用深色还是浅色涟漪
      if (colorClassArray) {
        var colorClass = colorClassArray[colorClassArray.length - 1];
        var colorClassTempArray = colorClass.replace('md-color-', '').split('-');
        var colorIsDark;

        // md-color-red  md-color-primary
        if (colorClassTempArray.length === 1) {
          if (colorClassTempArray[0] === 'primary') {
            colorIsDark = mdui.isColorDark[getThemeColorName()][500];
          } else {
            colorIsDark = mdui.isColorDark[colorClassTempArray[0]][500];
          }
        } else if (colorClassTempArray.length === 2) {
          // md-color-red-200  md-color-primary-200
          if (["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "a100", "a200", "a400", "a700"].indexOf(colorClassTempArray[1]) > -1) {
            if (colorClassTempArray[0] === 'primary') {
              colorIsDark = mdui.isColorDark[getThemeColorName()][colorClassTempArray[1]];
            } else {
              colorIsDark = mdui.isColorDark[colorClassTempArray[0]][colorClassTempArray[1]];
            }
          }
          // md-color-light-blue
          else {
            colorIsDark = mdui.isColorDark[colorClassTempArray[0] + '-' + colorClassTempArray[1]][500];
          }
        } else if (colorClassTempArray.length === 3) {
          //md-color-light-blue-200
          colorIsDark = mdui.isColorDark[colorClassTempArray[0] + '-' + colorClassTempArray[1]][colorClassTempArray[2]];
        }

        if (typeof colorIsDark !== 'undefined') {
          rippleColorClass = colorIsDark ? 'md-ripple-white' : 'md-ripple-black';
        }
      }
      if (!rippleColorClass) {
        rippleColorClass = 'md-ripple-black';
      }
    }

    // 计算涟漪位置
    // ===========
    var box = el.getBoundingClientRect();
    var offset = $.offset(el);
    var center = {
          x: x - offset.left,
          y: y - offset.top
        },
        height = box.height,
        width = box.width;
    var diameter = Math.max(
        Math.pow((Math.pow(height, 2) + Math.pow(width, 2)), 0.5), 48
    );

    // 添加涟漪
    // ========
    rippleWave = $.dom('<div class="md-ripple-wave" style="' +
        'width: ' + diameter + 'px; ' +
        'height: ' + diameter + 'px; ' +
        'margin-top:-' + diameter / 2 + 'px; ' +
        'margin-left:-' + diameter / 2 + 'px; ' +
        'left:' + center.x + 'px; ' +
        'top:' + center.y + 'px;">' +
        '</div>')[0];
    if (rippleColorClass) {
      rippleWave.classList.add(rippleColorClass);
    }
    el.insertBefore(rippleWave, el.childNodes[0]);
    window.getComputedStyle(rippleWave).getPropertyValue('opacity');
    rippleTransform = 'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) scale(1)';
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
      toRemove.parentNode.removeChild(toRemove);
    }, 400);

    rippleWave.classList.add('md-ripple-wave-fill');
    $.transform(rippleWave, rippleTransform.replace('scale(1)', 'scale(1.01)'));
    $.transitionEnd(rippleWave, function(e){
      clearTimeout(removeTimeout);

      var rippleWave = e.target;
      rippleWave.classList.add('md-ripple-wave-out');
      $.transform(rippleWave, rippleTransform.replace('scale(1)', 'scale(1.01)'));

      removeTimeout = setTimeout(function () {
        rippleWave.parentNode.removeChild(rippleWave);
      }, 700);

      setTimeout(function () {
        $.transitionEnd(rippleWave, function(e){
          clearTimeout(removeTimeout);
          e.target.parentNode.removeChild(e.target);
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
  $.on(document, mdui.touchEvents.start, '.md-ripple', function(e){
    touchStartX = mdui.support.touch ? e.originalEvent.targetTouches[0].pageX : e.pageX;
    touchStartY = mdui.support.touch ? e.originalEvent.targetTouches[0].pageY : e.pageY;
    rippleTouchStart(e.target);
  });

  $.on(document, mdui.touchEvents.move, '.md-ripple', function(e){
    rippleTouchMove();
  });

  $.on(document, mdui.touchEvents.end, '.md-ripple', function(e){
    rippleTouchEnd();
  });
})();