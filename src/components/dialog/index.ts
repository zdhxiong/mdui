import Selector from 'mdui.jq/es/types/Selector';
import mdui from '../../mdui';
import 'mdui.jq/es/methods/on';
import { $document } from '../../utils/dom';
import { currentInst, OPTIONS, Dialog } from './class';

declare module '../../interfaces/MduiStatic' {
  interface MduiStatic {
    /**
     * Dialog 组件
     *
     * 请通过 `new mdui.Dialog()` 调用
     */
    Dialog: {
      /**
       * 实例化 Dialog 组件
       * @param selector CSS 选择器、或 DOM 元素、或 JQ 对象
       * @param options 配置参数
       */
      new (
        selector: Selector | HTMLElement | ArrayLike<HTMLElement>,
        options?: OPTIONS,
      ): Dialog;
    };
  }
}

// esc 按下时关闭对话框
$document.on('keydown', (event: Event) => {
  if (
    currentInst &&
    currentInst.options.closeOnEsc &&
    currentInst.state === 'opened' &&
    (event as KeyboardEvent).keyCode === 27
  ) {
    currentInst.close();
  }
});

mdui.Dialog = Dialog;
