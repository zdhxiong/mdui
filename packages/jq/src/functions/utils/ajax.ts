import { AjaxOptions } from '../../interfaces/AjaxOptions';
import { EventName } from '../../types/JQAjax';

type AjaxEventsInterface = { [name: string]: EventName };

// 全局配置参数
export const globalOptions: AjaxOptions = {};

// 全局事件名
export const ajaxStart = 'start.mdui.ajax';
export const ajaxSuccess = 'success.mdui.ajax';
export const ajaxError = 'error.mdui.ajax';
export const ajaxComplete = 'complete.mdui.ajax';

export const ajaxEvents: AjaxEventsInterface = {
  ajaxStart,
  ajaxSuccess,
  ajaxError,
  ajaxComplete,
};
