import $ from 'mdui.jq/es/$';
import extend from 'mdui.jq/es/functions/extend';
import 'mdui.jq/es/methods/addClass';
import 'mdui.jq/es/methods/appendTo';
import 'mdui.jq/es/methods/attr';
import 'mdui.jq/es/methods/each';
import 'mdui.jq/es/methods/find';
import 'mdui.jq/es/methods/is';
import 'mdui.jq/es/methods/on';
import 'mdui.jq/es/methods/outerHeight';
import 'mdui.jq/es/methods/parent';
import 'mdui.jq/es/methods/parents';
import 'mdui.jq/es/methods/remove';
import 'mdui.jq/es/methods/removeClass';
import 'mdui.jq/es/methods/text';
import 'mdui.jq/es/methods/trigger';
import 'mdui.jq/es/methods/val';
import Selector from 'mdui.jq/es/types/Selector';
import { isUndefined } from 'mdui.jq/es/utils';
import mdui from '../../mdui';
import '../../global/mutation';
import { $document } from '../../utils/dom';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * 动态修改了文本框后，需要调用该方法重新初始化文本框。
     *
     * 若传入了参数，则只初始化该参数对应的文本框。若没有传入参数，则重新初始化所有文本框。
     * @param selector CSS 选择器、或 DOM 元素、或 DOM 元素组成的数组、或 JQ 对象
     */
    updateTextFields(
      selector?: Selector | HTMLElement | ArrayLike<HTMLElement>,
    ): void;
  }
}

type INPUT_EVENT_DATA = {
  reInit?: boolean;
  domLoadedEvent?: boolean;
};

const defaultData: INPUT_EVENT_DATA = {
  reInit: false,
  domLoadedEvent: false,
};

/**
 * 输入框事件
 * @param event
 * @param data
 */
function inputEvent(event: Event, data: INPUT_EVENT_DATA = {}): void {
  data = extend({}, defaultData, data);

  const input = event.target as HTMLInputElement;
  const $input = $(input);
  const eventType = event.type;
  const value = $input.val() as string;

  // 文本框类型
  const inputType = $input.attr('type') || '';
  if (
    ['checkbox', 'button', 'submit', 'range', 'radio', 'image'].indexOf(
      inputType,
    ) > -1
  ) {
    return;
  }

  const $textfield = $input.parent('.mdui-textfield');

  // 输入框是否聚焦
  if (eventType === 'focus') {
    $textfield.addClass('mdui-textfield-focus');
  }

  if (eventType === 'blur') {
    $textfield.removeClass('mdui-textfield-focus');
  }

  // 输入框是否为空
  if (eventType === 'blur' || eventType === 'input') {
    value
      ? $textfield.addClass('mdui-textfield-not-empty')
      : $textfield.removeClass('mdui-textfield-not-empty');
  }

  // 输入框是否禁用
  input.disabled
    ? $textfield.addClass('mdui-textfield-disabled')
    : $textfield.removeClass('mdui-textfield-disabled');

  // 表单验证
  if (
    (eventType === 'input' || eventType === 'blur') &&
    !data.domLoadedEvent &&
    input.validity
  ) {
    input.validity.valid
      ? $textfield.removeClass('mdui-textfield-invalid-html5')
      : $textfield.addClass('mdui-textfield-invalid-html5');
  }

  // textarea 高度自动调整
  if ($input.is('textarea')) {
    // IE bug：textarea 的值仅为多个换行，不含其他内容时，textarea 的高度不准确
    //         此时，在计算高度前，在值的开头加入一个空格，计算完后，移除空格
    const inputValue = value;
    let hasExtraSpace = false;

    if (inputValue.replace(/[\r\n]/g, '') === '') {
      $input.val(' ' + inputValue);
      hasExtraSpace = true;
    }

    // 设置 textarea 高度
    $input.outerHeight('');
    const height = $input.outerHeight();
    const scrollHeight = input.scrollHeight;

    if (scrollHeight > height) {
      $input.outerHeight(scrollHeight);
    }

    // 计算完，还原 textarea 的值
    if (hasExtraSpace) {
      $input.val(inputValue);
    }
  }

  // 实时字数统计
  if (data.reInit) {
    $textfield.find('.mdui-textfield-counter').remove();
  }

  const maxLength = $input.attr('maxlength');
  if (maxLength) {
    if (data.reInit || data.domLoadedEvent) {
      $(
        '<div class="mdui-textfield-counter">' +
          `<span class="mdui-textfield-counter-inputed"></span> / ${maxLength}` +
          '</div>',
      ).appendTo($textfield);
    }

    $textfield
      .find('.mdui-textfield-counter-inputed')
      .text(value.length.toString());
  }

  // 含 帮助文本、错误提示、字数统计 时，增加文本框底部内边距
  if (
    $textfield.find('.mdui-textfield-helper').length ||
    $textfield.find('.mdui-textfield-error').length ||
    maxLength
  ) {
    $textfield.addClass('mdui-textfield-has-bottom');
  }
}

$(() => {
  // 绑定事件
  $document.on(
    'input focus blur',
    '.mdui-textfield-input',
    { useCapture: true },
    inputEvent,
  );

  // 可展开文本框展开
  $document.on(
    'click',
    '.mdui-textfield-expandable .mdui-textfield-icon',
    function () {
      $(this as HTMLElement)
        .parents('.mdui-textfield')
        .addClass('mdui-textfield-expanded')
        .find('.mdui-textfield-input')[0]
        .focus();
    },
  );

  // 可展开文本框关闭
  $document.on(
    'click',
    '.mdui-textfield-expanded .mdui-textfield-close',
    function () {
      $(this)
        .parents('.mdui-textfield')
        .removeClass('mdui-textfield-expanded')
        .find('.mdui-textfield-input')
        .val('');
    },
  );

  /**
   * 初始化文本框
   */
  mdui.mutation('.mdui-textfield', function () {
    $(this).find('.mdui-textfield-input').trigger('input', {
      domLoadedEvent: true,
    });
  });
});

mdui.updateTextFields = function (
  selector?: Selector | HTMLElement | ArrayLike<HTMLElement>,
): void {
  const $elements = isUndefined(selector) ? $('.mdui-textfield') : $(selector);

  $elements.each((_, element) => {
    $(element).find('.mdui-textfield-input').trigger('input', {
      reInit: true,
    });
  });
};
