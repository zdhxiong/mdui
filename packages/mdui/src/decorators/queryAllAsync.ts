import { queryDecorator } from './utils.js';

export default function queryAllAsync(selector: string, isReturnNative?: boolean) {
  return queryDecorator(selector, isReturnNative, true, true);
}
