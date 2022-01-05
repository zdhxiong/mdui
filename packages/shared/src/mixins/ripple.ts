import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement } from 'lit';
import { property } from 'lit/decorators/property.js';

export interface Ripple {
  /**
   * 是否显示涟漪
   */
  ripple: boolean;
}

export const RippleMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<LitElement & Ripple> => {
    class Mixin extends superclass implements Ripple {
      @property({ type: Boolean })
      ripple = false;
    }

    return Mixin;
  },
);
