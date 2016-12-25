/**
 * =============================================================================
 * ************   Text Field 文本框   ************
 * =============================================================================
 */

(function () {

  var notInputs = ['checkbox', 'button', 'submit', 'range', 'radio', 'image'];

  var classNames = {
    field: 'mdui-textfield',
    input: 'mdui-textfield-input',
    focus: 'mdui-textfield-focus',
    notEmpty: 'mdui-textfield-not-empty',
    disabled: 'mdui-textfield-disabled',
    invalid: 'mdui-textfield-invalid',
    expanded: 'mdui-textfield-expanded',
  };

  /**
   * 输入框事件
   * @param e
   */
  var inputEvent = function (e) {
    var input = e.target;
    var event = e.type;
    var value = input.value;

    // reInit 为 true 时，需要重新初始化文本框
    var reInit;
    if (
      typeof e.detail === 'object' &&
      typeof e.detail.reInit !== 'undefined' &&
      e.detail.reInit
    ) {
      reInit = e.detail.reInit;
    } else {
      reInit = false;
    }

    // domLoadedEvent 为 true 时，为 DOM 加载完毕后自动触发的事件
    var domLoadedEvent;
    if (
      typeof e.detail === 'object' &&
      typeof e.detail.domLoadedEvent !== 'undefined' &&
      e.detail.domLoadedEvent
    ) {
      domLoadedEvent = e.detail.domLoadedEvent;
    } else {
      domLoadedEvent = false;
    }

    // 文本框类型
    var type = input.getAttribute('type') || '';
    if (notInputs.indexOf(type) >= 0) {
      return;
    }

    var textField = $.parents(input, '.' + classNames.field)[0];

    // 输入框是否聚焦
    if (event === 'focus') {
      textField.classList.add(classNames.focus);
    }

    if (event === 'blur') {
      textField.classList.remove(classNames.focus);
    }

    // 输入框是否为空
    if (event === 'blur' || event === 'input') {
      if (value && value !== '') {
        textField.classList.add(classNames.notEmpty);
      } else {
        textField.classList.remove(classNames.notEmpty);
      }
    }

    // 输入框是否禁用
    if (input.disabled) {
      textField.classList.add(classNames.disabled);
    } else {
      textField.classList.remove(classNames.disabled);
    }

    // 表单验证
    if ((event === 'input' || event === 'blur') && !domLoadedEvent) {
      if (input.validity) {
        if (input.validity.valid) {
          textField.classList.remove(classNames.invalid);
        } else {
          textField.classList.add(classNames.invalid);
        }
      }
    }

    // textarea 高度自动调整
    if (e.target.nodeName.toLowerCase() === 'textarea') {
      input.style.height = '';
      var height = input.offsetHeight;
      var diff = height - input.clientHeight;
      var scrollHeight = input.scrollHeight;

      if (scrollHeight + diff > height) {
        var newAreaHeight = scrollHeight + diff;
        input.style.height = newAreaHeight + 'px';
      }
    }

    // 实时字数统计
    var counter;
    if (reInit) {
      textField.classList.remove('mdui-textfield-has-counter');
      counter = $.query('.mdui-textfield-counter', textField);
      if (counter) {
        $.remove(counter);
      }
    }

    var maxlength = input.getAttribute('maxlength');
    if (maxlength) {
      if (reInit || domLoadedEvent) {
        counter = $.dom(
          '<div class="mdui-textfield-counter">' +
            '<span class="mdui-textfield-counter-inputed"></span> / ' + maxlength +
          '</div>'
        )[0];
        textField.appendChild(counter);

        // 如果没有 .mdui-textfield-error 作为占位，需要增加 .mdui-textfield 的下边距，
        // 使 .mdui-textfield-counter 不会覆盖在文本框上
        if (!$.query('.mdui-textfield-error', textField)) {
          textField.classList.add('mdui-textfield-has-counter');
        }
      }

      // 字符长度，确保统计方式和 maxlength 一致
      var inputed = input.value.length + input.value.split('\n').length - 1;
      $.query('.mdui-textfield-counter-inputed', textField).innerText = inputed.toString();
    }

  };

  // 绑定事件
  var inputSelector = '.' + classNames.field + ' input, .' + classNames.field + ' textarea';
  $.on(document, 'input focus blur', inputSelector, inputEvent, true);

  // 可展开文本框展开
  $.on(document, 'click', '.mdui-textfield-expandable .mdui-textfield-icon', function () {
    var _this = this;
    var textField = $.parents(_this, '.' + classNames.field)[0];
    var input = $.query('.' + classNames.input, textField);

    textField.classList.add(classNames.expanded);
    input.focus();
  });

  // 可展开文本框关闭
  $.on(document, 'click', '.mdui-textfield-expandable .mdui-textfield-close', function () {
    var _this = this;
    var textField = $.parents(_this, '.' + classNames.field)[0];
    var input = $.query('.' + classNames.input, textField);

    textField.classList.remove(classNames.expanded);
    input.value = '';
  });

  /**
   * 通过 JS 更新了表单内容，需要重新进行表单处理
   * @param dom 如果传入了 .mdui-textfield 所在的 DOM 元素，则更新该文本框；否则，更新所有文本框
   */
  mdui.updateTextFields = function () {
    var textfields;
    var input;

    if (arguments.length === 1) {
      textfields = $.dom(arguments[0]);
    } else {
      textfields = $.queryAll('.mdui-textfield');
    }

    $.each(textfields, function (i, textfield) {
      input = $.query('.mdui-textfield-input', textfield);
      if (input) {
        $.trigger(input, 'input', {
          reInit: true,
        });
      }
    });
  };

  $.ready(function () {

    // DOM 加载完后自动执行
    $.each($.queryAll('.mdui-textfield-input'), function (i, input) {
      $.trigger(input, 'input', {
        domLoadedEvent: true,
      });
    });

  });

})();
