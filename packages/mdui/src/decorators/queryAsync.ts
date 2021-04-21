import { queryDecorator } from './utils.js';

export default function queryAsync(selector: string, isReturnNative?: boolean) {
  return queryDecorator(selector, isReturnNative, false, true);
}
