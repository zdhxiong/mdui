import { getWindow } from 'ssr-window';
import { extend } from '../functions/extend.js';
import { eachObject, isUndefined } from './helper.js';
import type { PlainObject } from './helper.js';

// 请求方法名
export type Method =
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

// 回调函数名称
export type CallbackName<TResponse> = keyof OptionsCallback<TResponse>;

// 状态码
export type SuccessTextStatus = 'success' | 'notmodified' | 'nocontent';
export type ErrorTextStatus = 'timeout' | 'error' | 'abort' | 'parsererror';
export type TextStatus = SuccessTextStatus | ErrorTextStatus;

// 回调函数
export type BeforeSendCallback<TResponse> = (
  xhr: XMLHttpRequest,
  options: Required<OptionsParams<TResponse>> & Options<TResponse>,
) => void | false;
export type SuccessCallback<TResponse> = (
  response: TResponse,
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

export interface OptionsCallback<TResponse> extends PlainObject {
  /**
   * 在请求发送之前调用。返回 false 时将取消 AJAX 请求
   * @param xhr
   */
  beforeSend?: BeforeSendCallback<TResponse>;

  /**
   * 请求成功之后调用
   */
  success?: SuccessCallback<TResponse>;

  /**
   * 请求出错时调用
   */
  error?: ErrorCallback;

  /**
   * 请求完成之后调用
   */
  complete?: CompleteCallback;
}

export interface OptionsParams<TResponse> extends PlainObject {
  /**
   * 请求的 URL 地址
   */
  url?: string;

  /**
   * 请求方式 (e.g. "POST", "GET", "PUT")
   */
  method?: Lowercase<Method> | Uppercase<Method>;

  /**
   * 请求发送的数据
   */
  data?: unknown;

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
  statusCode?: StatusCodeCallbacks<TResponse>;

  /**
   * 服务器返回的数据类型，若为空字符串，则将根据响应的 Content-Type 解析
   */
  dataType?: 'text' | 'json' | '';

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

export interface Options<TResponse>
  extends OptionsParams<TResponse>,
    OptionsCallback<TResponse> {}

// 状态码对应回调函数
export type StatusCodeCallbacks<TResponse> = {
  // 成功状态码：2xx 和 304 为成功
  200?: SuccessCallback<TResponse>;
  201?: SuccessCallback<TResponse>;
  202?: SuccessCallback<TResponse>;
  203?: SuccessCallback<TResponse>;
  204?: SuccessCallback<TResponse>;
  205?: SuccessCallback<TResponse>;
  206?: SuccessCallback<TResponse>;
  207?: SuccessCallback<TResponse>;
  208?: SuccessCallback<TResponse>;
  209?: SuccessCallback<TResponse>;
  210?: SuccessCallback<TResponse>;
  211?: SuccessCallback<TResponse>;
  212?: SuccessCallback<TResponse>;
  213?: SuccessCallback<TResponse>;
  214?: SuccessCallback<TResponse>;
  215?: SuccessCallback<TResponse>;
  216?: SuccessCallback<TResponse>;
  217?: SuccessCallback<TResponse>;
  218?: SuccessCallback<TResponse>;
  219?: SuccessCallback<TResponse>;
  220?: SuccessCallback<TResponse>;
  221?: SuccessCallback<TResponse>;
  222?: SuccessCallback<TResponse>;
  223?: SuccessCallback<TResponse>;
  224?: SuccessCallback<TResponse>;
  225?: SuccessCallback<TResponse>;
  226?: SuccessCallback<TResponse>;
  227?: SuccessCallback<TResponse>;
  228?: SuccessCallback<TResponse>;
  229?: SuccessCallback<TResponse>;
  230?: SuccessCallback<TResponse>;
  231?: SuccessCallback<TResponse>;
  232?: SuccessCallback<TResponse>;
  233?: SuccessCallback<TResponse>;
  234?: SuccessCallback<TResponse>;
  235?: SuccessCallback<TResponse>;
  236?: SuccessCallback<TResponse>;
  237?: SuccessCallback<TResponse>;
  238?: SuccessCallback<TResponse>;
  239?: SuccessCallback<TResponse>;
  240?: SuccessCallback<TResponse>;
  241?: SuccessCallback<TResponse>;
  242?: SuccessCallback<TResponse>;
  243?: SuccessCallback<TResponse>;
  244?: SuccessCallback<TResponse>;
  245?: SuccessCallback<TResponse>;
  246?: SuccessCallback<TResponse>;
  247?: SuccessCallback<TResponse>;
  248?: SuccessCallback<TResponse>;
  249?: SuccessCallback<TResponse>;
  250?: SuccessCallback<TResponse>;
  251?: SuccessCallback<TResponse>;
  252?: SuccessCallback<TResponse>;
  253?: SuccessCallback<TResponse>;
  254?: SuccessCallback<TResponse>;
  255?: SuccessCallback<TResponse>;
  256?: SuccessCallback<TResponse>;
  257?: SuccessCallback<TResponse>;
  258?: SuccessCallback<TResponse>;
  259?: SuccessCallback<TResponse>;
  260?: SuccessCallback<TResponse>;
  261?: SuccessCallback<TResponse>;
  262?: SuccessCallback<TResponse>;
  263?: SuccessCallback<TResponse>;
  264?: SuccessCallback<TResponse>;
  265?: SuccessCallback<TResponse>;
  266?: SuccessCallback<TResponse>;
  267?: SuccessCallback<TResponse>;
  268?: SuccessCallback<TResponse>;
  269?: SuccessCallback<TResponse>;
  270?: SuccessCallback<TResponse>;
  271?: SuccessCallback<TResponse>;
  272?: SuccessCallback<TResponse>;
  273?: SuccessCallback<TResponse>;
  274?: SuccessCallback<TResponse>;
  275?: SuccessCallback<TResponse>;
  276?: SuccessCallback<TResponse>;
  277?: SuccessCallback<TResponse>;
  278?: SuccessCallback<TResponse>;
  279?: SuccessCallback<TResponse>;
  280?: SuccessCallback<TResponse>;
  281?: SuccessCallback<TResponse>;
  282?: SuccessCallback<TResponse>;
  283?: SuccessCallback<TResponse>;
  284?: SuccessCallback<TResponse>;
  285?: SuccessCallback<TResponse>;
  286?: SuccessCallback<TResponse>;
  287?: SuccessCallback<TResponse>;
  288?: SuccessCallback<TResponse>;
  289?: SuccessCallback<TResponse>;
  290?: SuccessCallback<TResponse>;
  291?: SuccessCallback<TResponse>;
  292?: SuccessCallback<TResponse>;
  293?: SuccessCallback<TResponse>;
  294?: SuccessCallback<TResponse>;
  295?: SuccessCallback<TResponse>;
  296?: SuccessCallback<TResponse>;
  297?: SuccessCallback<TResponse>;
  298?: SuccessCallback<TResponse>;
  299?: SuccessCallback<TResponse>;
  304?: SuccessCallback<TResponse>;

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
  [index: number]: SuccessCallback<TResponse> | ErrorCallback;
};

export type XHRFields = Partial<
  Pick<
    XMLHttpRequest,
    'onreadystatechange' | 'responseType' | 'timeout' | 'withCredentials'
  >
>;

// ajax 事件参数 (ajaxStart, ajaxError, ajaxComplete)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface EventParams<TResponse = any> extends PlainObject {
  xhr: XMLHttpRequest;
  options: Required<OptionsParams<TResponse>> & Options<TResponse>;
}

// ajax 事件参数 (ajaxSuccess)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface SuccessEventParams<TResponse = any> extends EventParams {
  response: TResponse;
}

// 全局事件名
export const ajaxStart = 'ajaxStart';
export const ajaxSuccess = 'ajaxSuccess';
export const ajaxError = 'ajaxError';
export const ajaxComplete = 'ajaxComplete';

// 事件名称
export type EventName =
  | typeof ajaxStart
  | typeof ajaxSuccess
  | typeof ajaxError
  | typeof ajaxComplete;

// 全局配置参数
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const globalOptions: Partial<Options<any>> = {};

/**
 * 判断此请求方法是否通过查询字符串提交参数
 * @param method 请求方法，大写
 */
export const isQueryStringData = (
  method: Uppercase<Method>,
): method is 'GET' | 'HEAD' => {
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
 * url 是否跨域
 * @param url
 */
export const isCrossDomain = (url: string): boolean => {
  const window = getWindow();
  return (
    /^([\w-]+:)?\/\/([^/]+)/.test(url) && RegExp.$2 !== window.location.host
  );
};

/**
 * HTTP 状态码是否表示请求成功
 * @param status
 */
export const isHttpStatusSuccess = (status: number): boolean => {
  return (status >= 200 && status < 300) || [0, 304].includes(status);
};

/**
 * 合并请求参数，参数优先级：options > globalOptions > defaults
 * @param options
 */
export const mergeOptions = <TResponse>(
  options: Options<TResponse>,
): Required<OptionsParams<TResponse>> & Options<TResponse> => {
  // 默认参数
  const defaults: Required<OptionsParams<TResponse>> & Options<TResponse> = {
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
    dataType: '',
    contentType: 'application/x-www-form-urlencoded',
    timeout: 0,
    global: true,
  };

  // globalOptions 中的回调函数不合并
  eachObject<Options<TResponse>, keyof Options<TResponse>>(
    globalOptions,
    (key, value) => {
      const callbacks: Array<CallbackName<TResponse> | 'statusCode'> = [
        'beforeSend',
        'success',
        'error',
        'complete',
        'statusCode',
      ];

      if (!callbacks.includes(key) && !isUndefined(value)) {
        defaults[key] = value;
      }
    },
  );

  return extend({}, defaults, options);
};
