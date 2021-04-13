import extend from '../functions/extend.js';
import { PlainObject, eachObject, isUndefined } from './core.js';

// 请求方法名
export type MethodUpperCase =
  | 'GET'
  | 'DELETE'
  | 'HEAD'
  | 'OPTIONS'
  | 'POST'
  | 'PUT'
  | 'PATCH'
  | 'PURGE'
  | 'LINK'
  | 'UNLINK';
export type MethodLowerCase =
  | 'get'
  | 'delete'
  | 'head'
  | 'options'
  | 'post'
  | 'put'
  | 'patch'
  | 'purge'
  | 'link'
  | 'unlink';
export type Method = MethodUpperCase | MethodLowerCase;

// 请求响应类型
export type DataType = 'text' | 'json';

// 回调函数名称
export type CallbackName = 'beforeSend' | 'success' | 'error' | 'complete';

// 状态码
export type SuccessTextStatus = 'success' | 'notmodified' | 'nocontent';
export type ErrorTextStatus = 'timeout' | 'error' | 'abort' | 'parsererror';
export type TextStatus = SuccessTextStatus | ErrorTextStatus;

// 回调函数
export type BeforeSendCallback = (xhr: XMLHttpRequest) => void | false;
export type SuccessCallback = (
  data: any,
  textStatus: SuccessTextStatus,
  xhr: XMLHttpRequest,
) => void;
export type ErrorCallback = (
  xhr: XMLHttpRequest,
  textStatus: ErrorTextStatus,
) => void;
export type CompleteCallback = (
  xhr: XMLHttpRequest,
  textStatus: TextStatus,
) => void;

export interface OptionsCallback {
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

export interface OptionsParams {
  /**
   * 请求的 URL 地址
   */
  url?: string;

  /**
   * 请求方式 (e.g. "POST", "GET", "PUT")
   */
  method?: Method;

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
  dataType?: DataType;

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
}

export interface Options extends OptionsParams, OptionsCallback {}

// 全局回调函数
export type GlobalCallback = (
  event: Event,
  xhr: XMLHttpRequest,
  options: Options,
) => void;

export type GlobalSuccessCallback = (
  event: Event,
  xhr: XMLHttpRequest,
  options: Options,
  data: any,
) => void;

// 状态码对应回调函数
export type StatusCodeCallbacks = {
  // 成功状态码：2xx 和 304 为成功
  200?: SuccessCallback;
  201?: SuccessCallback;
  202?: SuccessCallback;
  203?: SuccessCallback;
  204?: SuccessCallback;
  205?: SuccessCallback;
  206?: SuccessCallback;
  207?: SuccessCallback;
  208?: SuccessCallback;
  209?: SuccessCallback;
  210?: SuccessCallback;
  211?: SuccessCallback;
  212?: SuccessCallback;
  213?: SuccessCallback;
  214?: SuccessCallback;
  215?: SuccessCallback;
  216?: SuccessCallback;
  217?: SuccessCallback;
  218?: SuccessCallback;
  219?: SuccessCallback;
  220?: SuccessCallback;
  221?: SuccessCallback;
  222?: SuccessCallback;
  223?: SuccessCallback;
  224?: SuccessCallback;
  225?: SuccessCallback;
  226?: SuccessCallback;
  227?: SuccessCallback;
  228?: SuccessCallback;
  229?: SuccessCallback;
  230?: SuccessCallback;
  231?: SuccessCallback;
  232?: SuccessCallback;
  233?: SuccessCallback;
  234?: SuccessCallback;
  235?: SuccessCallback;
  236?: SuccessCallback;
  237?: SuccessCallback;
  238?: SuccessCallback;
  239?: SuccessCallback;
  240?: SuccessCallback;
  241?: SuccessCallback;
  242?: SuccessCallback;
  243?: SuccessCallback;
  244?: SuccessCallback;
  245?: SuccessCallback;
  246?: SuccessCallback;
  247?: SuccessCallback;
  248?: SuccessCallback;
  249?: SuccessCallback;
  250?: SuccessCallback;
  251?: SuccessCallback;
  252?: SuccessCallback;
  253?: SuccessCallback;
  254?: SuccessCallback;
  255?: SuccessCallback;
  256?: SuccessCallback;
  257?: SuccessCallback;
  258?: SuccessCallback;
  259?: SuccessCallback;
  260?: SuccessCallback;
  261?: SuccessCallback;
  262?: SuccessCallback;
  263?: SuccessCallback;
  264?: SuccessCallback;
  265?: SuccessCallback;
  266?: SuccessCallback;
  267?: SuccessCallback;
  268?: SuccessCallback;
  269?: SuccessCallback;
  270?: SuccessCallback;
  271?: SuccessCallback;
  272?: SuccessCallback;
  273?: SuccessCallback;
  274?: SuccessCallback;
  275?: SuccessCallback;
  276?: SuccessCallback;
  277?: SuccessCallback;
  278?: SuccessCallback;
  279?: SuccessCallback;
  280?: SuccessCallback;
  281?: SuccessCallback;
  282?: SuccessCallback;
  283?: SuccessCallback;
  284?: SuccessCallback;
  285?: SuccessCallback;
  286?: SuccessCallback;
  287?: SuccessCallback;
  288?: SuccessCallback;
  289?: SuccessCallback;
  290?: SuccessCallback;
  291?: SuccessCallback;
  292?: SuccessCallback;
  293?: SuccessCallback;
  294?: SuccessCallback;
  295?: SuccessCallback;
  296?: SuccessCallback;
  297?: SuccessCallback;
  298?: SuccessCallback;
  299?: SuccessCallback;
  304?: SuccessCallback;

  // 错误状态码
  300?: ErrorCallback;
  301?: ErrorCallback;
  302?: ErrorCallback;
  303?: ErrorCallback;
  305?: ErrorCallback;
  306?: ErrorCallback;
  307?: ErrorCallback;
  308?: ErrorCallback;
  309?: ErrorCallback;
  310?: ErrorCallback;
  311?: ErrorCallback;
  312?: ErrorCallback;
  313?: ErrorCallback;
  314?: ErrorCallback;
  315?: ErrorCallback;
  316?: ErrorCallback;
  317?: ErrorCallback;
  318?: ErrorCallback;
  319?: ErrorCallback;
  320?: ErrorCallback;
  321?: ErrorCallback;
  322?: ErrorCallback;
  323?: ErrorCallback;
  324?: ErrorCallback;
  325?: ErrorCallback;
  326?: ErrorCallback;
  327?: ErrorCallback;
  328?: ErrorCallback;
  329?: ErrorCallback;
  330?: ErrorCallback;
  331?: ErrorCallback;
  332?: ErrorCallback;
  333?: ErrorCallback;
  334?: ErrorCallback;
  335?: ErrorCallback;
  336?: ErrorCallback;
  337?: ErrorCallback;
  338?: ErrorCallback;
  339?: ErrorCallback;
  340?: ErrorCallback;
  341?: ErrorCallback;
  342?: ErrorCallback;
  343?: ErrorCallback;
  344?: ErrorCallback;
  345?: ErrorCallback;
  346?: ErrorCallback;
  347?: ErrorCallback;
  348?: ErrorCallback;
  349?: ErrorCallback;
  350?: ErrorCallback;
  351?: ErrorCallback;
  352?: ErrorCallback;
  353?: ErrorCallback;
  354?: ErrorCallback;
  355?: ErrorCallback;
  356?: ErrorCallback;
  357?: ErrorCallback;
  358?: ErrorCallback;
  359?: ErrorCallback;
  360?: ErrorCallback;
  361?: ErrorCallback;
  362?: ErrorCallback;
  363?: ErrorCallback;
  364?: ErrorCallback;
  365?: ErrorCallback;
  366?: ErrorCallback;
  367?: ErrorCallback;
  368?: ErrorCallback;
  369?: ErrorCallback;
  370?: ErrorCallback;
  371?: ErrorCallback;
  372?: ErrorCallback;
  373?: ErrorCallback;
  374?: ErrorCallback;
  375?: ErrorCallback;
  376?: ErrorCallback;
  377?: ErrorCallback;
  378?: ErrorCallback;
  379?: ErrorCallback;
  380?: ErrorCallback;
  381?: ErrorCallback;
  382?: ErrorCallback;
  383?: ErrorCallback;
  384?: ErrorCallback;
  385?: ErrorCallback;
  386?: ErrorCallback;
  387?: ErrorCallback;
  388?: ErrorCallback;
  389?: ErrorCallback;
  390?: ErrorCallback;
  391?: ErrorCallback;
  392?: ErrorCallback;
  393?: ErrorCallback;
  394?: ErrorCallback;
  395?: ErrorCallback;
  396?: ErrorCallback;
  397?: ErrorCallback;
  398?: ErrorCallback;
  399?: ErrorCallback;
  400?: ErrorCallback;
  401?: ErrorCallback;
  402?: ErrorCallback;
  403?: ErrorCallback;
  404?: ErrorCallback;
  405?: ErrorCallback;
  406?: ErrorCallback;
  407?: ErrorCallback;
  408?: ErrorCallback;
  409?: ErrorCallback;
  410?: ErrorCallback;
  411?: ErrorCallback;
  412?: ErrorCallback;
  413?: ErrorCallback;
  414?: ErrorCallback;
  415?: ErrorCallback;
  416?: ErrorCallback;
  417?: ErrorCallback;
  418?: ErrorCallback;
  419?: ErrorCallback;
  420?: ErrorCallback;
  421?: ErrorCallback;
  422?: ErrorCallback;
  423?: ErrorCallback;
  424?: ErrorCallback;
  425?: ErrorCallback;
  426?: ErrorCallback;
  427?: ErrorCallback;
  428?: ErrorCallback;
  429?: ErrorCallback;
  430?: ErrorCallback;
  431?: ErrorCallback;
  432?: ErrorCallback;
  433?: ErrorCallback;
  434?: ErrorCallback;
  435?: ErrorCallback;
  436?: ErrorCallback;
  437?: ErrorCallback;
  438?: ErrorCallback;
  439?: ErrorCallback;
  440?: ErrorCallback;
  441?: ErrorCallback;
  442?: ErrorCallback;
  443?: ErrorCallback;
  444?: ErrorCallback;
  445?: ErrorCallback;
  446?: ErrorCallback;
  447?: ErrorCallback;
  448?: ErrorCallback;
  449?: ErrorCallback;
  450?: ErrorCallback;
  451?: ErrorCallback;
  452?: ErrorCallback;
  453?: ErrorCallback;
  454?: ErrorCallback;
  455?: ErrorCallback;
  456?: ErrorCallback;
  457?: ErrorCallback;
  458?: ErrorCallback;
  459?: ErrorCallback;
  460?: ErrorCallback;
  461?: ErrorCallback;
  462?: ErrorCallback;
  463?: ErrorCallback;
  464?: ErrorCallback;
  465?: ErrorCallback;
  466?: ErrorCallback;
  467?: ErrorCallback;
  468?: ErrorCallback;
  469?: ErrorCallback;
  470?: ErrorCallback;
  471?: ErrorCallback;
  472?: ErrorCallback;
  473?: ErrorCallback;
  474?: ErrorCallback;
  475?: ErrorCallback;
  476?: ErrorCallback;
  477?: ErrorCallback;
  478?: ErrorCallback;
  479?: ErrorCallback;
  480?: ErrorCallback;
  481?: ErrorCallback;
  482?: ErrorCallback;
  483?: ErrorCallback;
  484?: ErrorCallback;
  485?: ErrorCallback;
  486?: ErrorCallback;
  487?: ErrorCallback;
  488?: ErrorCallback;
  489?: ErrorCallback;
  490?: ErrorCallback;
  491?: ErrorCallback;
  492?: ErrorCallback;
  493?: ErrorCallback;
  494?: ErrorCallback;
  495?: ErrorCallback;
  496?: ErrorCallback;
  497?: ErrorCallback;
  498?: ErrorCallback;
  499?: ErrorCallback;
  500?: ErrorCallback;
  501?: ErrorCallback;
  502?: ErrorCallback;
  503?: ErrorCallback;
  504?: ErrorCallback;
  505?: ErrorCallback;
  506?: ErrorCallback;
  507?: ErrorCallback;
  508?: ErrorCallback;
  509?: ErrorCallback;
  510?: ErrorCallback;
  511?: ErrorCallback;
  512?: ErrorCallback;
  513?: ErrorCallback;
  514?: ErrorCallback;
  515?: ErrorCallback;
  516?: ErrorCallback;
  517?: ErrorCallback;
  518?: ErrorCallback;
  519?: ErrorCallback;
  520?: ErrorCallback;
  521?: ErrorCallback;
  522?: ErrorCallback;
  523?: ErrorCallback;
  524?: ErrorCallback;
  525?: ErrorCallback;
  526?: ErrorCallback;
  527?: ErrorCallback;
  528?: ErrorCallback;
  529?: ErrorCallback;
  530?: ErrorCallback;
  531?: ErrorCallback;
  532?: ErrorCallback;
  533?: ErrorCallback;
  534?: ErrorCallback;
  535?: ErrorCallback;
  536?: ErrorCallback;
  537?: ErrorCallback;
  538?: ErrorCallback;
  539?: ErrorCallback;
  540?: ErrorCallback;
  541?: ErrorCallback;
  542?: ErrorCallback;
  543?: ErrorCallback;
  544?: ErrorCallback;
  545?: ErrorCallback;
  546?: ErrorCallback;
  547?: ErrorCallback;
  548?: ErrorCallback;
  549?: ErrorCallback;
  550?: ErrorCallback;
  551?: ErrorCallback;
  552?: ErrorCallback;
  553?: ErrorCallback;
  554?: ErrorCallback;
  555?: ErrorCallback;
  556?: ErrorCallback;
  557?: ErrorCallback;
  558?: ErrorCallback;
  559?: ErrorCallback;
  560?: ErrorCallback;
  561?: ErrorCallback;
  562?: ErrorCallback;
  563?: ErrorCallback;
  564?: ErrorCallback;
  565?: ErrorCallback;
  566?: ErrorCallback;
  567?: ErrorCallback;
  568?: ErrorCallback;
  569?: ErrorCallback;
  570?: ErrorCallback;
  571?: ErrorCallback;
  572?: ErrorCallback;
  573?: ErrorCallback;
  574?: ErrorCallback;
  575?: ErrorCallback;
  576?: ErrorCallback;
  577?: ErrorCallback;
  578?: ErrorCallback;
  579?: ErrorCallback;
  580?: ErrorCallback;
  581?: ErrorCallback;
  582?: ErrorCallback;
  583?: ErrorCallback;
  584?: ErrorCallback;
  585?: ErrorCallback;
  586?: ErrorCallback;
  587?: ErrorCallback;
  588?: ErrorCallback;
  589?: ErrorCallback;
  590?: ErrorCallback;
  591?: ErrorCallback;
  592?: ErrorCallback;
  593?: ErrorCallback;
  594?: ErrorCallback;
  595?: ErrorCallback;
  596?: ErrorCallback;
  597?: ErrorCallback;
  598?: ErrorCallback;
  599?: ErrorCallback;
} & {
  // 其他状态码
  [index: number]: SuccessCallback | ErrorCallback;
};

export type XHRFields = Partial<
  Pick<
    XMLHttpRequest,
    'onreadystatechange' | 'responseType' | 'timeout' | 'withCredentials'
  >
>;

// ajax 事件参数
export interface EventParams {
  data?: string;
  xhr?: XMLHttpRequest;
  options?: Options;
}

// 全局事件名
export const ajaxStart = 'start.mdui.ajax';
export const ajaxSuccess = 'success.mdui.ajax';
export const ajaxError = 'error.mdui.ajax';
export const ajaxComplete = 'complete.mdui.ajax';

// 事件名称
export type EventName =
  | typeof ajaxStart
  | typeof ajaxSuccess
  | typeof ajaxError
  | typeof ajaxComplete;

export const ajaxEvents = {
  ajaxStart,
  ajaxSuccess,
  ajaxError,
  ajaxComplete,
};

// 全局配置参数
export const globalOptions: Options = {};

/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 */
export const isQueryStringData = (method: MethodUpperCase): boolean => {
  return ['GET', 'HEAD'].includes(method);
};

/**
 * 添加参数到 URL 上，且 URL 中不存在 ? 时，自动把第一个 & 替换为 ?
 * @param url
 * @param query
 */
export const appendQuery = (url: string, query: string): string => {
  return `${url}&${query}`.replace(/[&?]{1,2}/, '?');
};

/**
 * 合并请求参数，参数优先级：options > globalOptions > defaults
 * @param options
 */
export const mergeOptions = (options: Options) => {
  // 默认参数
  const defaults: Required<OptionsParams> & Options = {
    url: '',
    method: 'GET',
    data: '',
    processData: true,
    async: true,
    cache: true,
    username: '',
    password: '',
    headers: {},
    xhrFields: {},
    statusCode: {},
    dataType: 'text',
    contentType: 'application/x-www-form-urlencoded',
    timeout: 0,
    global: true,
  };

  // globalOptions 中的回调函数不合并
  eachObject(globalOptions, (key, value) => {
    const callbacks: (CallbackName | 'statusCode')[] = [
      'beforeSend',
      'success',
      'error',
      'complete',
      'statusCode',
    ];

    // @ts-ignore
    if (!callbacks.includes(key) && !isUndefined(value)) {
      defaults[key] = value as never;
    }
  });

  return extend({}, defaults, options);
};
