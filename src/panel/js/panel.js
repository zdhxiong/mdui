/**
 * =============================================================================
 * ************   Expansion panel 可扩展面板   ************
 * =============================================================================
 */

mdui.Panel = (function () {

  function Panel(selector, opts) {
    return new CollapsePrivate(selector, opts, {
      item: 'mdui-panel-item',
      itemOpen: 'mdui-panel-item-open',
      header: 'mdui-panel-item-header',
      body: 'mdui-panel-item-body',
    }, 'panel');
  }

  return Panel;

})();
