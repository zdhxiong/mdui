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

    _this.$table = $(selector).eq(0);

    if (!_this.$table.length) {
      return;
    }

    _this.init();
  }

  /**
   * 初始化
   */
  Table.prototype.init = function () {
    var _this = this;

    _this.$thRow = _this.$table.find('thead tr');
    _this.$tdRows = _this.$table.find('tbody tr');
    _this.$tdCheckboxs = $();
    _this.selectable = _this.$table.hasClass('mdui-table-selectable');
    _this.selectedRow = 0;

    _this._updateThCheckbox();
    _this._updateTdCheckbox();
    _this._updateNumericCol();
  };

  /**
   * 更新表格行的 checkbox
   */
  Table.prototype._updateTdCheckbox = function () {
    var _this = this;

    _this.$tdRows.each(function () {
      var $tdRow = $(this);

      // 移除旧的 checkbox
      $tdRow.find('.mdui-table-cell-checkbox').remove();

      if (!_this.selectable) {
        return;
      }

      // 创建 DOM
      var $checkbox = $(checkboxHTML('td'))
        .prependTo($tdRow)
        .find('input[type="checkbox"]');

      // 默认选中的行
      if ($tdRow.hasClass('mdui-table-row-selected')) {
        $checkbox[0].checked = true;
        _this.selectedRow++;
      }

      // 所有行都选中后，选中表头；否则，不选中表头
      _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;

      // 绑定事件
      $checkbox.on('change', function () {
        if ($checkbox[0].checked) {
          $tdRow.addClass('mdui-table-row-selected');
          _this.selectedRow++;
        } else {
          $tdRow.removeClass('mdui-table-row-selected');
          _this.selectedRow--;
        }

        // 所有行都选中后，选中表头；否则，不选中表头
        _this.$thCheckbox[0].checked = _this.selectedRow === _this.$tdRows.length;
      });

      _this.$tdCheckboxs = _this.$tdCheckboxs.add($checkbox);
    });
  };

  /**
   * 更新表头的 checkbox
   */
  Table.prototype._updateThCheckbox = function () {
    var _this = this;

    // 移除旧的 checkbox
    _this.$thRow.find('.mdui-table-cell-checkbox').remove();

    if (!_this.selectable) {
      return;
    }

    _this.$thCheckbox = $(checkboxHTML('th'))
      .prependTo(_this.$thRow)
      .find('input[type="checkbox"]')
      .on('change', function () {

        var isCheckedAll = _this.$thCheckbox[0].checked;
        _this.selectedRow = isCheckedAll ? _this.$tdRows.length : 0;

        _this.$tdCheckboxs.each(function (i, checkbox) {
          checkbox.checked = isCheckedAll;
        });

        _this.$tdRows.each(function (i, row) {
          $(row)[isCheckedAll ? 'addClass' : 'removeClass']('mdui-table-row-selected');
        });

      });
  };

  /**
   * 更新数值列
   */
  Table.prototype._updateNumericCol = function () {
    var _this = this;
    var $th;
    var $tdRow;

    _this.$thRow.find('th').each(function (i, th) {
      $th = $(th);

      _this.$tdRows.each(function () {
        $tdRow = $(this);
        var method = $th.hasClass('mdui-table-col-numeric') ? 'addClass' : 'removeClass';
        $tdRow.find('td').eq(i)[method]('mdui-table-col-numeric');
      });
    });
  };

  $(function () {
    // 实例化表格
    $('.mdui-table').each(function () {
      var $table = $(this);
      if (!$table.data('mdui.table')) {
        $table.data('mdui.table', new Table($table));
      }
    });
  });

  /**
   * 更新表格
   */
  mdui.updateTables = function () {
    $(arguments.length ? arguments[0] : '.mdui-table').each(function () {
      var $table = $(this);
      var inst = $table.data('mdui.table');

      if (inst) {
        inst.init();
      } else {
        $table.data('mdui.table', new Table($table));
      }
    });
  };

})();
