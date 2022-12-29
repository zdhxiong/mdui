export function animateTo(
  el: HTMLElement,
  keyframes: Keyframe[],
  options?: KeyframeAnimationOptions,
): Promise<unknown> {
  return new Promise((resolve) => {
    if (options?.duration === Infinity) {
      throw new Error('Promise-based animations must be finite.');
    }

    const animation = el.animate(keyframes, {
      ...options,
      duration: options!.duration,
    });

    animation.addEventListener('cancel', resolve, { once: true });
    animation.addEventListener('finish', resolve, { once: true });
  });
}

export function stopAnimations(el: HTMLElement): Promise<unknown> {
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
