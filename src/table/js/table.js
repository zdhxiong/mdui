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
   * 更新表头的 checkbox
   */
  Table.prototype.updateThCheckbox = function () {
    var _this = this;
    var thCheckbox;

    if (_this.selectable) {
      if (!$.query('.md-table-cell-checkbox', _this.thRow)) {
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
      }
    } else {
      thCheckbox = $.query('.md-table-cell-checkbox', _this.thRow);
      if (thCheckbox) {
        thCheckbox.parentNode.removeChild(thCheckbox);
      }
    }
  };

  /**
   * 更新表格行的 checkbox
   */
  Table.prototype.updateTdCheckbox = function () {
    var _this = this;
    var td;

    if (_this.selectable) {
      $.each(_this.tdRows, function (i, row) {

        if (!$.query('.md-table-cell-checkbox', row)) {
          // 创建 DOM
          td = $.dom(checkboxTdHTML)[0];
          row.insertBefore(td, row.childNodes[0]);

          var checkbox = $.query('input[type="checkbox"]', td);

          // 默认选中的行
          if (row.classList.contains('md-table-row-selected')) {
            checkbox.checked = true;
          }

          // 绑定事件
          $.on(checkbox, 'change', function () {
            row.classList[checkbox.checked ? 'add' : 'remove']('md-table-row-selected');
          });

          _this.tdCheckboxs.push(checkbox);
        }

      });
    }
  };

  /**
   * 创建表头的 checkbox
   * @private
   */
  Table.prototype.createThCheckbox = function () {
    var _this = this;

    if (!$.query('.md-table-cell-checkbox', _this.thRow)) {
      // 创建 DOM
      var th = $.dom(checkboxThHTML)[0];
      _this.thRow.insertBefore(th, _this.thRow.childNodes[0]);

      // 绑定事件
      var thCheckbox = $.query('input[type="checkbox"]', th);
      $.on(thCheckbox, 'change', function () {

        $.each(_this.tdCheckboxs, function (i, checkbox) {
          checkbox.checked = thCheckbox.checked;
        });

        $.each(_this.tdRows, function (i, row) {
          row.classList[thCheckbox.checked ? 'add' : 'remove']('md-table-row-selected');
        });

      });
    }

  };

  /**
   * 创建行的 checkbox
   */
  Table.prototype.createTdCheckbox = function () {
    var _this = this;
    var td;

    $.each(_this.tdRows, function (i, row) {

      if (!$.query('.md-table-cell-checkbox', row)) {
        // 创建 DOM
        td = $.dom(checkboxTdHTML)[0];
        row.insertBefore(td, row.childNodes[0]);

        // 默认选中的行
        if (row.classList.contains('md-table-row-selected')) {
          $.query('input[type="checkbox"]', td).checked = true;
        }

        // 绑定事件
        var checkbox = $.query('input[type="checkbox"]', td);
        $.on(checkbox, 'change', function () {
          row.classList[checkbox.checked ? 'add' : 'remove']('md-table-row-selected');
        });

        _this.tdCheckboxs.push(checkbox);
      }

    });
  };

  /**
   * 移除表头的 checkbox
   */
  Table.prototype.removeThCheckbox = function () {
    var _this = this;
    var thCheckbox = $.query('.md-table-cell-checkbox', _this.thRow);
    if (thCheckbox) {
      thCheckbox.parentNode.removeChild(thCheckbox);
    }
  };

  /**
   * 移除行的 checkbox
   */
  Table.prototype.removeTdCheckbox = function () {
    var _this = this;
    var tdCheckbox;
    $.each(_this.tdRows, function (i, tdRow) {
      tdCheckbox = $.query('.md-table-cell-checkbox', tdRow);
      if (tdCheckbox) {
        tdCheckbox.parentNode.removeChild(tdCheckbox);
      }
    });

    _this.tdCheckboxs = [];
  };

  /**
   * 处理数值列
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

      // 更新复选框
      if (inst.table.classList.contains('md-table-selectable')) {
        if (inst.thRow) {
          inst.createThCheckbox();
        }

        inst.createTdCheckbox();
      } else {
        inst.removeThCheckbox();
        inst.removeTdCheckbox();
      }

      // 更新数值列对齐
      inst.updateNumericCol();

    });
  };

})();
