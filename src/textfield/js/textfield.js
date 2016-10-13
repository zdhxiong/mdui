/**
 * =============================================================================
 * ************   Text Field 文本框   ************
 * =============================================================================
 */

(function () {

  var notInputs = ['checkbox', 'button', 'submit', 'range', 'radio', 'image'];

  var classNames = {
    field: 'md-textfield',
    focus: 'md-textfield-focus',
    notEmpty: 'md-textfield-not-empty',
    disabled: 'md-textfield-disabled',
    invalid: 'md-textfield-invalid',
  };

  /**
   * 输入框事件
   * @param e
   */
  var inputEvent = function (e) {
    var input = e.target;
    var event = e.type;
    var value = input.value;

    // 是否是 DOM 加载完后自动执行的操作
    var domLoadEvent;
    if (
      typeof e.detail === 'object' &&
      typeof e.detail.domLoadEvent !== 'undefined' &&
      e.detail.domLoadEvent
    ) {
      domLoadEvent = e.detail.domLoadEvent;
    } else {
      domLoadEvent = false;
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

    // 表单验证，DOM 加载完后自动执行的操作不包括表单验证
    if ((event === 'input' || event === 'blur') && !domLoadEvent) {
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
      if (domLoadEvent) {
        var wrap = $.dom('<div class="md-textfield-flex-wrap"></div>')[0];
        var pre = $.dom('<pre><span></span><br/></pre>')[0];
        input.parentNode.insertBefore(wrap, input);
        wrap.appendChild(pre);
        wrap.appendChild(input);
      }

      var span = textField.querySelector('.md-textfield-flex-wrap pre span');
      span.innerText = input.value.replace(/\r?\n/g, '\r\n');
    }

  };

  // 绑定事件
  var inputSelector = '.' + classNames.field + ' input, .' + classNames.field + ' textarea';
  $.on(document, 'input focus blur', inputSelector, inputEvent, true);

  /**
   * 通过 JS 更新了表单内容，需要重新进行表单处理
   * @param dom 如果传入了 .md-textfield 所在的 DOM 元素，则更新该文本框；否则，更新所有文本框
   */
  mdui.updateTextFields = function () {
    var textfields = [];

    if (arguments.length === 1) {
      textfields.push(arguments[0]);
    } else {
      textfields = $.queryAll('.md-textfield-input');
    }

    $.each(textfields, function (i, input) {
      $.trigger(input, 'input');
    });
  };

  $.ready(function () {

    // DOM 加载完后自动执行
    $.each($.queryAll('.md-textfield-input'), function (i, input) {
      $.trigger(input, 'input', {
        domLoadEvent: true,
      });
    });

  });

})();
