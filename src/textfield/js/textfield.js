/**
 * Text Field 文本框
 * =============================================================================
 */

(function(){

  var notInputs = ['checkbox', 'button', 'submit', 'range', 'radio', 'image'];
  var classNames = {
    field: 'md-textfield',
    focus: 'md-textfield-focus',
    notEmpty: 'md-textfield-not-empty'
  };

  /**
   * 表单验证
   *
   * require        不能为空
   * type="email"   验证邮箱
   * type="url"     验证url
   * type="number"  验证数值
   * min            数值控件的最小值
   * max            数值控件的最大值
   * step           数值空间的 step
   * pattern        正则表达式验证
   * maxLength      字符串长度
   *
   *
   *
   * @param target
   */
  var validate = function(target){
  };

  /**
   * 聚焦在输入框时
   * @param e
   */
  var focusEvent = function(e){
    var target = e.target;
    var type = target.getAttribute('type');
    if(notInputs.indexOf(type) >= 0){
      return;
    }

    var textField = $.parents(target, '.' + classNames.field)[0];
    textField.classList.add(classNames.focus);
  };

  /**
   * 输入框失去焦点时
   * @param e
   */
  var blurEvent = function(e){
    var target = e.target;
    var value = target.value;
    var type = target.getAttribute('type');
    if(notInputs.indexOf(type) >= 0){
      return;
    }

    var textField = $.parents(target, '.' + classNames.field)[0];
    textField.classList.remove(classNames.focus);

    if(value && value.trim() !== ''){
      textField.classList.add(classNames.notEmpty);
    }else{
      textField.classList.remove(classNames.notEmpty);
    }
  };

  /**
   * 输入框的值变化时
   * @param e
   */
  var inputEvent = function(e){
    var target = e.target;
    var value = target.value;
    var type = target.getAttribute('type');
    if(notInputs.indexOf(type) >= 0){
      return;
    }

    var textField = $.parents(target, '.' + classNames.field)[0];
    if(value && value.trim() !== ''){
      textField.classList.add(classNames.notEmpty);
    }else{
      textField.classList.remove(classNames.notEmpty);
    }
  };

  // 绑定事件
  var inputSelector = '.'+ classNames.field +' input, .' + classNames.field + ' textarea';
  $.on(document, 'input', inputSelector, inputEvent, true);
  $.on(document, 'focus', inputSelector, focusEvent, true);
  $.on(document, 'blur', inputSelector, blurEvent, true);
})();