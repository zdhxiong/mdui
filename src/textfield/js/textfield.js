/**
 * =============================================================================
 * ************   Text Field 文本框   ************
 * =============================================================================
 */

(function () {

  var getProp = function (obj, prop) {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      typeof obj[prop] !== 'undefined' &&
      obj[prop]
    ) ? obj[prop] : false;
  };

  /**
   * 输入框事件
   * @param e
   */
  var inputEvent = function (e) {
    var input = e.target;
    var $input = $(input);
    var event = e.type;
    var value = $input.val();

    // reInit 为 true 时，需要重新初始化文本框
    var reInit = getProp(e.detail, 'reInit');

    // domLoadedEvent 为 true 时，为 DOM 加载完毕后自动触发的事件
    var domLoadedEvent = getProp(e.detail, 'domLoadedEvent');

    // 文本框类型
    var type = $input.attr('type') || '';
    if (['checkbox', 'button', 'submit', 'range', 'radio', 'image'].indexOf(type) >= 0) {
      return;
    }

    var $textField = $input.parent('.mdui-textfield');

    // 输入框是否聚焦
    if (event === 'focus') {
      $textField.addClass('mdui-textfield-focus');
    }

    if (event === 'blur') {
      $textField.removeClass('mdui-textfield-focus');
    }

    // 输入框是否为空
    if (event === 'blur' || event === 'input') {
      $textField[(value && value !== '') ? 'addClass' : 'removeClass']('mdui-textfield-not-empty');
    }

    // 输入框是否禁用
    $textField[input.disabled ? 'addClass' : 'removeClass']('mdui-textfield-disabled');

    // 表单验证
    if ((event === 'input' || event === 'blur') && !domLoadedEvent) {
      if (input.validity) {
        var method = input.validity.valid ? 'removeClass' : 'addClass';
        $textField[method]('mdui-textfield-invalid-html5');
      }
    }

    // textarea 高度自动调整
    if (e.target.nodeName.toLowerCase() === 'textarea') {
      $input.height('');
      var height = input.offsetHeight;
      var diff = height - input.clientHeight;
      var scrollHeight = input.scrollHeight;

      if (scrollHeight + diff > height) {
        var newAreaHeight = scrollHeight + diff;
        $input.height(newAreaHeight);
      }
    }

    // 实时字数统计
    if (reInit) {
      $textField
        .removeClass('mdui-textfield-has-counter')
        .find('.mdui-textfield-counter')
        .remove();
    }

    var maxlength = $input.attr('maxlength');
    if (maxlength) {
      if (reInit || domLoadedEvent) {
        $('<div class="mdui-textfield-counter">' +
            '<span class="mdui-textfield-counter-inputed"></span> / ' + maxlength +
          '</div>').appendTo($textField);

        // 如果没有 .mdui-textfield-error 作为占位，需要增加 .mdui-textfield 的下边距，
        // 使 .mdui-textfield-counter 不会覆盖在文本框上
        if (!$textField.find('.mdui-textfield-error').length) {
          $textField.addClass('mdui-textfield-has-counter');
        }
      }

      // 字符长度，确保统计方式和 maxlength 一致
      var inputed = value.length + value.split('\n').length - 1;
      $textField.find('.mdui-textfield-counter-inputed').text(inputed.toString());
    }

  };

  // 绑定事件
  $document.on('input focus blur', '.mdui-textfield-input', { useCapture: true }, inputEvent);

  // 可展开文本框展开
  $document.on('click', '.mdui-textfield-expandable .mdui-textfield-icon', function () {
    $(this)

      // 展开文本框
      .parents('.mdui-textfield')
      .addClass('mdui-textfield-expanded')

      // 聚焦到输入框
      .find('.mdui-textfield-input')[0].focus();
  });

  // 可展开文本框关闭
  $document.on('click', '.mdui-textfield-expanded .mdui-textfield-close', function () {
    $(this)

      // 关闭文本框
      .parents('.mdui-textfield')
      .removeClass('mdui-textfield-expanded')

      // 清空输入框
      .find('.mdui-textfield-input')
      .val('');
  });

  /**
   * 通过 JS 更新了表单内容，需要重新进行表单处理
   * @param- 如果传入了 .mdui-textfield 所在的 DOM 元素，则更新该文本框；否则，更新所有文本框
   */
  mdui.updateTextFields = function () {
    $(arguments.length ? arguments[0] : '.mdui-textfield').each(function () {
      $(this)
        .find('.mdui-textfield-input')
        .trigger('input', {
          reInit: true,
        });
    });
  };

  $(function () {
    // DOM 加载完后自动执行
    $('.mdui-textfield-input').each(function () {
      $(this).trigger('input', {
        domLoadedEvent: true,
      });
    });
  });

})();
