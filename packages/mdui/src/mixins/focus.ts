import { dedupeMixin } from '@open-wc/dedupe-mixin';

const FocusMixin = dedupeMixin(
  superclass =>
    class extends superclass {
      // your mixin code goes here
    },
);

export default FocusMixin;
