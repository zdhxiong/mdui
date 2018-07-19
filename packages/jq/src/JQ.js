export default class JQ {
  constructor(arr) {
    const self = this;

    for (let i = 0; i < arr.length; i += 1) {
      self[i] = arr[i];
    }

    self.length = arr.length;

    return this;
  }
}
