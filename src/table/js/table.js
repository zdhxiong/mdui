/**
 * =============================================================================
 * ************   Table 表格   ************
 * =============================================================================
 */

(function () {

  var checkboxHTML =
    '<label class="md-checkbox">' +
      '<input type="checkbox"/>' +
      '<i class="md-checkbox-icon"></i>' +
    '</label>';
  var checkboxThHTML = '<th class="md-table-cell-checkbox">' + checkboxHTML + '</th>';
  var checkboxTdHTML = '<td class="md-table-cell-checkbox">' + checkboxHTML + '</td>';

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
    _this.selectable = _this.table.classList.contains('md-table-selectable');

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
      tdCheckbox = $.query('.md-table-cell-checkbox', tdRow);
      if (tdCheckbox) {
        tdCheckbox.parentNode.removeChild(tdCheckbox);
      }

      // 创建新的 checkbox
      if (_this.selectable) {
        // 创建 DOM
        td = $.dom(checkboxTdHTML)[0];
        tdRow.insertBefore(td, tdRow.childNodes[0]);

        var checkbox = $.query('input[type="checkbox"]', td);

        // 默认选中的行
        if (tdRow.classList.contains('md-table-row-selected')) {
          checkbox.checked = true;
        }

        // 绑定事件
        $.on(checkbox, 'change', function () {
          tdRow.classList[checkbox.checked ? 'add' : 'remove']('md-table-row-selected');
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
    thCheckbox = $.query('.md-table-cell-checkbox', _this.thRow);
    if (thCheckbox) {
      thCheckbox.parentNode.removeChild(thCheckbox);
    }

    if (!_this.selectable) {
      return;
    }

    // 创建 DOM
    var th = $.dom(checkboxThHTML)[0];
    _this.thRow.insertBefore(th, _this.thRow.childNodes[0]);

    // 绑定事件
    thCheckbox = $.query('input[type="checkbox"]', th);
    $.on(thCheckbox, 'change', function () {

      $.each(_this.tdCheckboxs, function (i, checkbox) {
        checkbox.checked = thCheckbox.checked;
      });

      $.each(_this.tdRows, function (i, row) {
        row.classList[thCheckbox.checked ? 'add' : 'remove']('md-table-row-selected');
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
        var method = th.classList.contains('md-table-col-numeric') ? 'add' : 'remove';
        $.queryAll('td', tdRow)[i].classList[method]('md-table-col-numeric');
      });
    });
  };

  // 实例化表格
  var tables = $.queryAll('.md-table');
  $.each(tables, function (i, table) {
    var inst = new Table(table);
    $.setData(table, 'mdui.table', inst);
  });

  /**
   * 更新表格
   */
  mdui.updateTables = function () {
    var tables = [];

    if (arguments.length === 1) {
      tables.push(arguments[0]);
    } else {
      tables = $.queryAll('.md-table');
    }

    $.each(tables, function (i, table) {
      var inst = $.getData(table, 'mdui.table');
      inst.init();
    });
  };

})();
