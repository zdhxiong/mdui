import AjaxOptions from '../../interfaces/AjaxOptions';
import { EventName } from '../../types/JQAjax';

type AjaxEventsInterface = { [name: string]: EventName };

// 全局配置参数
const globalOptions: AjaxOptions = {};

// 全局事件名
const ajaxEvents: AjaxEventsInterface = {
  ajaxStart: 'start.mdui.ajax',
  ajaxSuccess: 'success.mdui.ajax',
  ajaxError: 'error.mdui.ajax',
  ajaxComplete: 'complete.mdui.ajax',
};

export { globalOptions, ajaxEvents };
