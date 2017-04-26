/**
 * =============================================================================
 * ************   Slider 滑块   ************
 * =============================================================================
 */

(function () {

  /**
   * 滑块的值变更后修改滑块样式
   * @param $slider
   */
  var updateValueStyle = function ($slider) {
    var data = $slider.data();

    var $track = data.$track;
    var $fill = data.$fill;
    var $thumb = data.$thumb;
    var $input = data.$input;
    var min = data.min;
    var max = data.max;
    var isDisabled = data.disabled;
    var isDiscrete = data.discrete;
    var $thumbText = data.$thumbText;
    var value = $input.val();
    var percent = (value - min) / (max - min) * 100;

    $fill.width(percent + '%');
    $track.width((100 - percent) + '%');

    if (isDisabled) {
      $fill.css('padding-right', '6px');
      $track.css('padding-left', '6px');
    }

    $thumb.css('left', percent + '%');

    if (isDiscrete) {
      $thumbText.text(value);
    }

    $slider[parseFloat(percent) === 0 ? 'addClass' : 'removeClass']('mdui-slider-zero');
  };

  /**
   * 重新初始化
   * @param $slider
   */
  var reInit = function ($slider) {
    var $track = $('<div class="mdui-slider-track"></div>');
    var $fill = $('<div class="mdui-slider-fill"></div>');
    var $thumb = $('<div class="mdui-slider-thumb"></div>');
    var $input = $slider.find('input[type="range"]');

    // 禁用状态
    var isDisabled = $input[0].disabled;
    $slider[isDisabled ? 'addClass' : 'removeClass']('mdui-slider-disabled');

    // 重新填充 HTML
    $slider.find('.mdui-slider-track').remove();
    $slider.find('.mdui-slider-fill').remove();
    $slider.find('.mdui-slider-thumb').remove();
    $slider.append($track).append($fill).append($thumb);

    // 间续型滑块
    var isDiscrete = $slider.hasClass('mdui-slider-discrete');

    var $thumbText;
    if (isDiscrete) {
      $thumbText = $('<span></span>');
      $thumb.empty().append($thumbText);
    }

    $slider.data({
      $track: $track,
      $fill: $fill,
      $thumb: $thumb,
      $input: $input,
      min: $input.attr('min'),    // 滑块最小值
      max: $input.attr('max'),    // 滑块最大值
      disabled: isDisabled,       // 是否禁用状态
      discrete: isDiscrete,       // 是否是间续型滑块
      $thumbText: $thumbText,      // 间续型滑块的数值
    });

    // 设置默认值
    updateValueStyle($slider);
  };

  var rangeSelector = '.mdui-slider input[type="range"]';

  $document

    // 滑动滑块事件
    .on('input change', rangeSelector, function () {
      var $slider = $(this).parent();
      updateValueStyle($slider);
    })

    // 开始触摸滑块事件
    .on(TouchHandler.start, rangeSelector, function (e) {
      if (!TouchHandler.isAllow(e)) {
        return;
      }

      TouchHandler.register(e);

      if (!this.disabled) {
        var $slider = $(this).parent();
        $slider.addClass('mdui-slider-focus');
      }
    })

    // 结束触摸滑块事件
    .on(TouchHandler.end, rangeSelector, function (e) {
      if (!TouchHandler.isAllow(e)) {
        return;
      }

      if (!this.disabled) {
        var $slider = $(this).parent();
        $slider.removeClass('mdui-slider-focus');
      }
    })

    .on(TouchHandler.unlock, rangeSelector, TouchHandler.register);

  /**
   * 页面加载完后自动初始化
   */
  $(function () {
    $('.mdui-slider').each(function () {
      reInit($(this));
    });
  });

  /**
   * 重新初始化滑块
   */
  mdui.updateSliders = function () {
    $(arguments.length ? arguments[0] : '.mdui-slider').each(function () {
      reInit($(this));
    });
  };
})();
