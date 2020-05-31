import { isUndefined } from 'mdui.jq/es/utils';
import PlainObject from 'mdui.jq/es/interfaces/PlainObject';

type Func = () => any;

const container: PlainObject<Func[]> = {};

/**
 * 根据队列名，获取队列中所有函数
 * @param name 队列名
 */
function queue(name: string): Func[];

/**
 * 写入队列
 * @param name 队列名
 * @param func 函数
 */
function queue(name: string, func: Func): void;

function queue(name: string, func?: Func): void | Func[] {
  if (isUndefined(container[name])) {
    container[name] = [];
  }

  if (isUndefined(func)) {
    return container[name];
  }

  container[name].push(func);
}

/**
 * 从队列中移除第一个函数，并执行该函数
 * @param name 队列满
 */
function dequeue(name: string): void {
  if (isUndefined(container[name])) {
    return;
  }

  if (!container[name].length) {
    return;
  }

  const func = container[name].shift()!;

  func();
}

export { queue, dequeue };
