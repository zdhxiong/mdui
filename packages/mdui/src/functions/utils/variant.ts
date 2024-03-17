/**
 * Rainbow和FruitSalad在material-color-utilities中正处于缺失状态.
 * 当material-color-utilities弥补缺失后[7]和[8]可供使用.
 * ```
 *   export type TVariant = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
 * ```
 *
 * @url
 * https://github.com/material-foundation/material-color-utilities/issues/137
 */
export type TMaterialVariant = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export const enum EMaterialVariant {
  Monochrome = 0,
  Neutral = 1,
  TonalSpot = 2,
  Vibrant = 3,
  Expressive = 4,
  Fidelity = 5,
  Content = 6,
  // Rainbow = 7,
  // FruitSalad = 8,
}
