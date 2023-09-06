import { isNumber } from '@mdui/jq/shared/helper.js';

export function animateTo(
  el: HTMLElement | undefined,
  keyframes: Keyframe[],
  options: KeyframeAnimationOptions,
): Promise<unknown> {
  if (!el) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    if (options.duration === Infinity) {
      throw new Error('Promise-based animations must be finite.');
    }

    if (isNumber(options.duration) && isNaN(options.duration)) {
      options.duration = 0;
    }

    if (options.easing === '') {
      options.easing = 'linear';
    }

    const animation = el.animate(keyframes, options);

    animation.addEventListener('cancel', resolve, { once: true });
    animation.addEventListener('finish', resolve, { once: true });
  });
}

export function stopAnimations(el?: HTMLElement): Promise<unknown> {
  if (!el) {
    return Promise.resolve();
  }

  return Promise.all(
    el.getAnimations().map((animation) => {
      return new Promise((resolve) => {
        const handleAnimationEvent = requestAnimationFrame(resolve);

        animation.addEventListener('cancel', () => handleAnimationEvent, {
          once: true,
        });
        animation.addEventListener('finish', () => handleAnimationEvent, {
          once: true,
        });
        animation.cancel();
      });
    }),
  );
}
