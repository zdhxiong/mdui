(function () {
  var dataNS = 'mduiElementDataStorage';

  $.extend({
    /**
     * 在指定元素上存储数据，或从指定元素上读取数据
     * @param ele 必须， DOM 元素
     * @param key 必须，键名
     * @param value 可选，值
     */
    data: function (ele, key, value) {
      var data = {};

      if (value !== undefined) {
        // 根据 key、value 设置值
        data[key] = value;
      } else if (isObjectLike(key)) {
        // 根据键值对设置值
        data = key;
      } else if (key === undefined) {
        // 获取所有值
        var result = {};
        each(ele.attributes, function (i, attribute) {
          var name = attribute.name;
          if (name.indexOf('data-') === 0) {
            var prop = name.slice(5).replace(/-./g, function (u) {
              // 横杠转为驼峰法
              return u.charAt(1).toUpperCase();
            });

            result[prop] = attribute.value;
          }
        });

        if (ele[dataNS]) {
          each(ele[dataNS], function (k, v) {
            result[k] = v;
          });
        }

        return result;
      } else {
        // 获取指定值
        if (ele[dataNS] && (key in ele[dataNS])) {
          return ele[dataNS][key];
        } else {
          var dataKey = ele.getAttribute('data-' + key);
          if (dataKey) {
            return dataKey;
          } else {
            return undefined;
          }
        }
      }

      // 设置值
      if (!ele[dataNS]) {
        ele[dataNS] = {};
      }

      each(data, function (k, v) {
        ele[dataNS][k] = v;
      });
    },

    /**
     * 移除指定元素上存放的数据
     * @param ele 必须，DOM 元素
     * @param key 必须，键名
     */
    removeData: function (ele, key) {
      if (ele[dataNS] && ele[dataNS][key]) {
        ele[dataNS][key] = null;
        delete ele.mduiElementDataStorage[key];
      }
    },

  });

  $.fn.extend({

    /**
     * 在元素上读取或设置数据
     * @param key 必须
     * @param value
     * @returns {*}
     */
    data: function (key, value) {
      if (value === undefined) {
        // 获取值
        if (this[0]) {
          return $.data(this[0], key);
        } else {
          return undefined;
        }
      } else {
        // 设置值
        return this.each(function (i, ele) {
          $.data(ele, key, value);
        });
      }
    },

    /**
     * 移除元素上存储的数据
     * @param key 必须
     * @returns {*}
     */
    removeData: function (key) {
      return this.each(function (i, ele) {
        $.removeData(ele, key);
      });
    },

  });
})();
