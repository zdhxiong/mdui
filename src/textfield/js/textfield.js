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
    invalid: 'md-textfield-invalid'
  };

  /**
   * 输入框事件
   * @param e
   */
  var inputEvent = function (e) {
    var input = e.target;
    var event = e.type;
    var value = input.value;

    var type = input.getAttribute('type');
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
      if (value && value.trim() !== '') {
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
    if (event === 'input' || event === 'blur') {
      if (input.validity) {
        if (input.validity.valid) {
          textField.classList.remove(classNames.invalid);
        } else {
          textField.classList.add(classNames.invalid);
        }
      }
    }
  };

  // 绑定事件
  var inputSelector = '.' + classNames.field + ' input, .' + classNames.field + ' textarea';
  $.on(document, 'input focus blur', inputSelector, inputEvent, true);
})();
