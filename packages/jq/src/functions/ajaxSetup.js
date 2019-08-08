import $ from '../$';
import { globalOptions } from './utils/ajax';

/**
 * 为 ajax 请求设置全局配置参数
 * @param options
 */
export default function ajaxSetup(options) {
  $.extend(globalOptions, options || {});
}
