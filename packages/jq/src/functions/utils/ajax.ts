import AjaxOptions from '../../interfaces/AjaxOptions';
import { EventName } from '../../types/JQAjax';

// 全局配置参数
const globalOptions: AjaxOptions = {};

// 全局事件名
const ajaxEvents: {
  [name: string]: EventName;
} = {
  ajaxStart: 'start.mdui.ajax',
  ajaxSuccess: 'success.mdui.ajax',
  ajaxError: 'error.mdui.ajax',
  ajaxComplete: 'complete.mdui.ajax',
};

export { globalOptions, ajaxEvents };
