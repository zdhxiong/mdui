import { Constructor, dedupeMixin } from '@open-wc/dedupe-mixin';
import { LitElement, PropertyValues } from 'lit';
import { property } from 'lit/decorators/property.js';

export type ElevationValue =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24;

export declare class ElevationMixinInterface {
  /**
   * 高程
   */
  elevation: ElevationValue;
}

export const ElevationMixin = dedupeMixin(
  <T extends Constructor<LitElement>>(
    superclass: T,
  ): T & Constructor<ElevationMixinInterface> => {
    class Mixin extends superclass implements ElevationMixinInterface {
      @property({ type: Number })
      elevation: ElevationValue = 0;

      update(changedProperties: PropertyValues) {
        super.update(changedProperties);

        // 确保 elevation 在 0 - 24 之间
        if (changedProperties.has('elevation')) {
          if (this.elevation > 24) {
            this.elevation = 24;
          }

          if (this.elevation < 0) {
            this.elevation = 0;
          }

          this.style.boxShadow = !Number.isNaN(this.elevation)
            ? `var(--mdui-elevation-${this.elevation}-box-shadow)`
            : '';
        }
      }
    }

    return Mixin;
  },
);
