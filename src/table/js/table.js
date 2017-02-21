/**
 * =============================================================================
 * ************   Table 表格   ************
 * =============================================================================
 */

(function () {

  /**
   * 生成 checkbox 的 HTML 结构
   * @param tag
   * @returns {string}
   */
  var checkboxHTML = function (tag) {
    return '<' + tag + ' class="mdui-table-cell-checkbox">' +
             '<label class="mdui-checkbox">' +
               '<input type="checkbox"/>' +
               '<i class="mdui-checkbox-icon"></i>' +
             '</label>' +
           '</' + tag + '>';
  };

  /**
   * Table 表格
   * @param selector
   * @constructor
   */
  function Table(selector) {
    var _this = this;
    _this.table = $.dom(selector)[0];
    _this.init();
  }

  /**
   * 初始化
   */
  Table.prototype.init = function () {
    var _this = this;

    _this.thRow = $.query('thead tr', _this.table);
    _this.tdRows = $.queryAll('tbody tr', _this.table);
    _this.tdCheckboxs = [];
    _this.selectable = _this.table.classList.contains('mdui-table-selectable');

    _this.updateTdCheckbox();
    _this.updateThCheckbox();
    _this.updateNumericCol();
  };

  /**
   * 更新表格行的 checkbox
   */
  Table.prototype.updateTdCheckbox = function () {
    var _this = this;
    var td;
    var tdCheckbox;
    _this.tdCheckboxs = [];

    $.each(_this.tdRows, function (i, tdRow) {
      // 移除旧的 checkbox
      tdCheckbox = $.query('.mdui-table-cell-checkbox', tdRow);
      if (tdCheckbox) {
        $.remove(tdCheckbox);
      }

      // 创建新的 checkbox
      if (_this.selectable) {
        // 创建 DOM
        td = $.dom(checkboxHTML('td'))[0];
        $.prepend(tdRow, td);

        var checkbox = $.query('input[type="checkbox"]', td);

        // 默认选中的行
        if (tdRow.classList.contains('mdui-table-row-selected')) {
          checkbox.checked = true;
        }

        // 绑定事件
        $.on(checkbox, 'change', function () {
          tdRow.classList[checkbox.checked ? 'add' : 'remove']('mdui-table-row-selected');
        });

        _this.tdCheckboxs.push(checkbox);
      }
    });
  };

  /**
   * 更新表头的 checkbox
   */
  Table.prototype.updateThCheckbox = function () {
    var _this = this;
    var thCheckbox;

    // 移除旧的 checkbox
    thCheckbox = $.query('.mdui-table-cell-checkbox', _this.thRow);
    if (thCheckbox) {
      $.remove(thCheckbox);
    }

    if (!_this.selectable) {
      return;
    }

    // 创建 DOM
    var th = $.dom(checkboxHTML('th'))[0];
    $.prepend(_this.thRow, th);

    // 绑定事件
    thCheckbox = $.query('input[type="checkbox"]', th);
    $.on(thCheckbox, 'change', function () {

      $.each(_this.tdCheckboxs, function (i, checkbox) {
        checkbox.checked = thCheckbox.checked;
      });

      $.each(_this.tdRows, function (i, row) {
        row.classList[thCheckbox.checked ? 'add' : 'remove']('mdui-table-row-selected');
      });

    });
  };

  /**
   * 更新数值列
   */
  Table.prototype.updateNumericCol = function () {
    var _this = this;

    var ths = $.queryAll('th', _this.thRow);
    $.each(ths, function (i, th) {
      $.each(_this.tdRows, function (j, tdRow) {
        var method = th.classList.contains('mdui-table-col-numeric') ? 'add' : 'remove';
        var td = $.queryAll('td', tdRow)[i];
        if (td) {
          td.classList[method]('mdui-table-col-numeric');
        }
      });
    });
  };

  $.ready(function () {
    // 实例化表格
    var tables = $.queryAll('.mdui-table');
    $.each(tables, function (i, table) {
      if (!$.data(table, 'mdui.table')) {
        $.data(table, 'mdui.table', new Table(table));
      }
    });
  });

  /**
   * 更新表格
   */
  mdui.updateTables = function () {
    var tables;

    if (arguments.length === 1) {
      tables = $.dom(arguments[0]);
    } else {
      tables = $.queryAll('.mdui-table');
    }

    $.each(tables, function (i, table) {
      var inst = $.data(table, 'mdui.table');
      if (inst) {
        inst.init();
      } else {
        $.data(table, 'mdui.table', new Table(table));
      }
    });
  };

})();
