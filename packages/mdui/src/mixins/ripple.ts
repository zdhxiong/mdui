import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement, property } from 'lit-element';

export interface Ripple {
  /**
   * 是否显示涟漪
   */
  ripple: boolean;
}

function RippleMixin<T extends Constructor<LitElement>>(
  superclass: T,
): T & Constructor<LitElement & Ripple> {
  class Mixin extends superclass implements Ripple {
    @property({ type: Boolean })
    ripple = false;
  }

  return Mixin;
}

export default dedupeMixin(RippleMixin);
