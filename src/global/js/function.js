/**
 * =============================================================================
 * ************   MDUI 内部使用的函数   ************
 * =============================================================================
 */

/**
 * 解析 DATA API 的参数
 * @param str
 * @returns {*}
 */
var parseOptions = function (str) {
  var options = {};

  if (str === null || !str) {
    return options;
  }

  if (typeof str === 'object') {
    return str;
  }

  /* jshint ignore:start */
  var start = str.indexOf('{');
  try {
    options = (new Function('',
      'var json = ' + str.substr(start) +
      '; return JSON.parse(JSON.stringify(json));'))();
  } catch (e) {
  }
  /* jshint ignore:end */

  return options;
};

/**
 * 绑定组件的事件
 * @param eventName 事件名
 * @param pluginName 插件名
 * @param inst 插件实例
 * @param trigger 在该元素上触发
 * @param obj 事件参数
 */
var componentEvent = function (eventName, pluginName, inst, trigger, obj) {
  if (!obj) {
    obj = {};
  }

  obj.inst = inst;

  var fullEventName = eventName + '.mdui.' + pluginName;

  // jQuery 事件
  if (typeof jQuery !== 'undefined') {
    jQuery(trigger).trigger(fullEventName, obj);
  }

  // JQ 事件
  $(trigger).trigger(fullEventName, obj);
};
