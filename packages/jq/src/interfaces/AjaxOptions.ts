import {
  BeforeSendCallback,
  CompleteCallback,
  ErrorCallback,
  StatusCodeCallbacks,
  SuccessCallback,
  XHRFields,
} from '../types/JQAjax';
import PlainObject from './PlainObject';

export default interface AjaxOptions {
  /**
   * 请求的 URL 地址
   */
  url?: string;

  /**
   * 请求方式 (e.g. "POST", "GET", "PUT")
   */
  method?: string;

  /**
   * 请求发送的数据
   */
  data?: any;

  /**
   * 是否把请求数据转换成查询字符串发送
   */
  processData?: boolean;

  /**
   * 是否为异步请求
   */
  async?: boolean;

  /**
   * 是否从缓存中读取。只对 GET、HEAD 请求有效
   */
  cache?: boolean;

  /**
   * HTTP 访问认证的用户名
   */
  username?: string;

  /**
   * HTTP 访问认证的密码
   */
  password?: string;

  /**
   * 添加到 Headers 中的数据。可以在 beforeSend 回调函数中重写该值
   * string 和 null 会被发送，undefined 会被舍去
   */
  headers?: PlainObject<string | null | undefined>;

  /**
   * 设置在 XMLHttpRequest 对象上的数据
   */
  xhrFields?: XHRFields;

  /**
   * HTTP 状态码和函数组成的对象
   */
  statusCode?: StatusCodeCallbacks;

  /**
   * 服务器返回的数据类型
   */
  dataType?: 'text' | 'json';

  /**
   *内容的编码类型。为 false 时将不设置 Content-Type
   */
  contentType?: string | false;

  /**
   * 请求的超时时间（毫秒）。为 0 时表示永不超时
   */
  timeout?: number;

  /**
   * 是否触发全局 AJAX 事件
   */
  global?: boolean;

  /**
   * 在请求发送之前调用。返回 false 时将取消 AJAX 请求
   * @param xhr
   */
  beforeSend?: BeforeSendCallback;

  /**
   * 请求成功之后调用
   */
  success?: SuccessCallback;

  /**
   * 请求出错时调用
   */
  error?: ErrorCallback;

  /**
   * 请求完成之后调用
   */
  complete?: CompleteCallback;
}
