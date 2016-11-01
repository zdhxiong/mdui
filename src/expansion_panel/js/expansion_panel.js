/**
 * =============================================================================
 * ************   Expansion panel 可扩展面板   ************
 * =============================================================================
 */

mdui.ExpansionPanel = (function () {

  var DEFAULT = {
    accordion: true,      // 是否使用手风情效果，打开一个项目时，自动关闭其他项目
  };

  /**
   * 可扩展面板
   * @param selector
   * @param opts
   * @returns {*}
   * @constructor
   */
  function ExpansionPanel(selector, opts) {
    var _this = this;

    // 可扩展面板元素
    _this.expansion_panel = $.dom(selector)[0];

    // 已通过自定义属性实例化过，不再重复实例化
    var oldInst = $.getData(_this.expansion_panel, 'mdui.expansion_panel');
    if (oldInst) {
      return oldInst;
    }

    _this.options = $.extend(DEFAULT, (opts || {}));
    _this.items = $.children(_this.expansion_panel, '.mdui-expansion-panel-item');

    // 绑定事件
    $.each(_this.items, function (i, item) {
      $.on(item, 'click', function () {
        _this.toggle(i);
      });
    });
  }

  /**
   * 打开指定项
   * @param index
   */
  ExpansionPanel.prototype.open = function (index) {
    var _this = this;

    var item = _this.items[index];
    item.classList.add('mdui-expansion-panel-open');
  };

  /**
   * 关闭指定项
   * @param index
   */
  ExpansionPanel.prototype.close = function (index) {
    var _this = this;

    var item = _this.items[index];
    item.classList.remove('mdui-expansion-panel-open');
  };

  /**
   * 切换指定项的状态
   * @param index
   */
  ExpansionPanel.prototype.toggle = function (index) {
    var _this = this;

    var item = _this.items[index];
    if (item.classList.contains('mdui-expansion-panel-open')) {
      _this.close(index);
    } else {
      _this.open(index);
    }
  };

  /**
   * 打开所有项
   */
  ExpansionPanel.prototype.openAll = function () {
    var _this = this;

    $.each(_this.items, function (i, item) {
      _this.open(i);
    });
  };

  /**
   * 关闭所有项
   */
  ExpansionPanel.prototype.closeAll = function () {
    var _this = this;

    $.each(_this.items, function (i, item) {
      _this.close(i);
    });
  };

  return ExpansionPanel;

})();
