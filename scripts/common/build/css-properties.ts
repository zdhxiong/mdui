import { docOrigin } from './docs.js';
import { I18nLanguage, getI18nData } from './i18n.js';
import { ucfirst } from './shared.js';

interface CSSProperty {
  name: string;
  description: string;
  docUrl: string;
}
type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
type Theme = 'light' | 'dark' | '';
type Elevation = 0 | 1 | 2 | 3 | 4 | 5;
type Easing =
  | 'linear'
  | 'standard'
  | 'standard-accelerate'
  | 'standard-decelerate'
  | 'emphasized'
  | 'emphasized-accelerate'
  | 'emphasized-decelerate';
type Duration = 'short' | 'medium' | 'long' | 'extra-long';
type DurationLevel = 1 | 2 | 3 | 4;
type Corner =
  | 'none'
  | 'extra-small'
  | 'small'
  | 'medium'
  | 'large'
  | 'extra-large'
  | 'full';
type StateLayer = 'hover' | 'focus' | 'pressed' | 'dragged';
type TypographyStyle = 'display' | 'headline' | 'title' | 'label' | 'body';
type TypographySize = 'large' | 'medium' | 'small';
type TypographyProperty = 'weight' | 'line-height' | 'size' | 'tracking';

/**
 * CSS 自定义属性，用于写入到 css-data.{language}.json 及 web-types.{language}.json 中
 */
export const getCssProperties = (language: I18nLanguage): CSSProperty[] => {
  const i18nData = getI18nData(language);

  // 断点
  const getBreakpoints = (): CSSProperty[] => {
    const breakpointMap: [Breakpoint, number][] = [
      ['xs', 0],
      ['sm', 600],
      ['md', 840],
      ['lg', 1080],
      ['xl', 1440],
      ['xxl', 1920],
    ];

    return breakpointMap.map(([breakpoint, width]) => {
      const name = `--mdui-breakpoint-${breakpoint}`;

      return {
        name,
        description: i18nData.cssProperties.breakpoint.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{width}}', width.toString())
          .replaceAll(
            '{{newWidth}}',
            (breakpoint === 'xs' ? 0 : width + 20).toString(),
          ),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#breakpoint`,
      };
    });
  };

  // 亮色、暗色、及自动适配 颜色值
  const getColors = (): CSSProperty[] => {
    const themes: Theme[] = ['light', 'dark', ''];

    return themes
      .map<CSSProperty[]>((theme) => {
        return [
          'primary',
          'primary-container',
          'on-primary',
          'on-primary-container',
          'inverse-primary',
          'secondary',
          'secondary-container',
          'on-secondary',
          'on-secondary-container',
          'tertiary',
          'tertiary-container',
          'on-tertiary',
          'on-tertiary-container',
          'surface',
          'surface-dim',
          'surface-bright',
          'surface-container-lowest',
          'surface-container-low',
          'surface-container',
          'surface-container-high',
          'surface-container-highest',
          'surface-variant',
          'on-surface',
          'on-surface-variant',
          'inverse-surface',
          'inverse-on-surface',
          'background',
          'on-background',
          'error',
          'error-container',
          'on-error',
          'on-error-container',
          'outline',
          'outline-variant',
          'shadow',
          'surface-tint-color',
          'scrim',
        ].map((color) => {
          const colorName = color.split('-').map(ucfirst).join(' ');
          const docUrl = `${docOrigin}/${language}/docs/2/styles/design-tokens#color`;

          if (theme) {
            // 亮色、或暗色
            const name = `--mdui-color-${color}-${theme}`;
            const nameAuto = `--mdui-color-${color}`;
            const modeName =
              theme === 'dark'
                ? i18nData.cssProperties.darkLightTheme.dark
                : i18nData.cssProperties.darkLightTheme.light;

            return {
              name,
              description: i18nData.cssProperties.darkLightTheme.description
                .replaceAll('{{name}}', name)
                .replaceAll('{{colorName}}', colorName)
                .replaceAll('{{modeName}}', modeName)
                .replaceAll('{{nameAuto}}', nameAuto),
              docUrl,
            };
          } else {
            // 自动适配
            const name = `--mdui-color-${color}`;
            const nameLight = `--mdui-color-${color}-light`;
            const nameDark = `--mdui-color-${color}-dark`;

            return {
              name,
              description: i18nData.cssProperties.autoTheme.description
                .replaceAll('{{name}}', name)
                .replaceAll('{{colorName}}', colorName)
                .replaceAll('{{nameLight}}', nameLight)
                .replaceAll('{{nameDark}}', nameDark),
              docUrl,
            };
          }
        });
      })
      .flat();
  };

  // 阴影值
  const getElevations = (): CSSProperty[] => {
    const elevations: Elevation[] = [0, 1, 2, 3, 4, 5];

    return elevations.map((elevation) => {
      const name = `--mdui-elevation-level${elevation}`;

      return {
        name,
        description: i18nData.cssProperties.elevation.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{value}}', elevation.toString()),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#elevation`,
      };
    });
  };

  // 动画（缓动曲线）
  const getEasings = (): CSSProperty[] => {
    const easings: Easing[] = [
      'linear',
      'standard',
      'standard-accelerate',
      'standard-decelerate',
      'emphasized',
      'emphasized-accelerate',
      'emphasized-decelerate',
    ];

    return easings.map((easing) => {
      const name = `--mdui-motion-easing-${easing}`;
      const easingName = i18nData.cssProperties.easing[easing];

      return {
        name,
        description: i18nData.cssProperties.easing.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{easingName}}', easingName),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#motion`,
      };
    });
  };

  // 动画（持续时间）
  const getDurations = (): CSSProperty[] => {
    const durations: Duration[] = ['short', 'medium', 'long', 'extra-long'];
    const durationLevels: DurationLevel[] = [1, 2, 3, 4];

    return durations
      .map<CSSProperty[]>((duration) => {
        return durationLevels.map((level) => {
          const name = `--mdui-motion-duration-${duration}${level}`;

          return {
            name,
            description: i18nData.cssProperties.duration.description
              .replaceAll('{{name}}', name)
              .replaceAll('{{value}}', duration)
              .replaceAll('{{level}}', level.toString()),
            docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#motion`,
          };
        });
      })
      .flat();
  };

  // 圆角值
  const getCorners = (): CSSProperty[] => {
    const corners: Corner[] = [
      'none',
      'extra-small',
      'small',
      'medium',
      'large',
      'extra-large',
      'full',
    ];

    return corners.map((corner) => {
      const name = `--mdui-shape-corner-${corner}`;

      return {
        name,
        description: i18nData.cssProperties.corner.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{value}}', corner),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#shape-corner`,
      };
    });
  };

  // 状态层不透明度
  const getStateLayers = (): CSSProperty[] => {
    const stateLayers: StateLayer[] = ['hover', 'focus', 'pressed', 'dragged'];

    return stateLayers.map((stateLayer) => {
      const name = `--mdui-state-layer-${stateLayer}`;

      return {
        name,
        description: i18nData.cssProperties.stateLayer.description
          .replaceAll('{{name}}', name)
          .replaceAll('{{state}}', stateLayer),
        docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#state-layer`,
      };
    });
  };

  // 排版
  const getTypographies = (): CSSProperty[] => {
    const typographyStyles: TypographyStyle[] = [
      'display',
      'headline',
      'title',
      'label',
      'body',
    ];
    const typographySizes: TypographySize[] = ['large', 'medium', 'small'];
    const typographyProperties: TypographyProperty[] = [
      'weight',
      'line-height',
      'size',
      'tracking',
    ];

    return typographyStyles
      .map<CSSProperty[][]>((style) => {
        return typographySizes.map((size) => {
          return typographyProperties.map((property) => {
            const name = `--mdui-typescale-${style}-${size}-${property}`;
            const propertyName =
              i18nData.cssProperties.typescale.font[property];
            const styleName = `${ucfirst(style)} ${ucfirst(
              size,
            )} ${propertyName}`;
            const setValue =
              property === 'weight'
                ? 500
                : property === 'line-height'
                  ? 1.5
                  : property === 'size'
                    ? '16px'
                    : 0.1;
            const cssPropertyName =
              property === 'weight'
                ? 'font-weight'
                : property === 'size'
                  ? 'font-size'
                  : property === 'tracking'
                    ? 'letter-spacing'
                    : property;

            return {
              name,
              description: i18nData.cssProperties.typescale.description
                .replaceAll('{{styleName}}', styleName)
                .replaceAll('{{name}}', name)
                .replaceAll('{{setValue}}', setValue.toString())
                .replaceAll('{{cssPropertyName}}', cssPropertyName),
              docUrl: `${docOrigin}/${language}/docs/2/styles/design-tokens#typescale`,
            };
          });
        });
      })
      .flat(2);
  };

  return [
    ...getBreakpoints(),
    ...getColors(),
    ...getElevations(),
    ...getEasings(),
    ...getDurations(),
    ...getCorners(),
    ...getStateLayers(),
    ...getTypographies(),
  ];
};
