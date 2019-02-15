/**
 * 创建 Observable 的这些方法就是用来创建 Observable 数据流的 -- Part1
 */

import { of, from, fromEvent, fromEventPattern } from 'rxjs';
import { NodeEventHandler } from 'rxjs/internal/observable/fromEvent';

/**
 * 以下流可用 of、from 创建
 *
 * ```ts
 * const source$ = new Observable(observer => {
 *  observer.next(1)
 *  observer.next(2)
 *  observer.next(3)
 *  observer.complete()
 * })
 * ```
 */

export const ofSource$ = of(1, 2, 3);

/**
 * from
 * 可以将可遍历的对象（iterable）转化为一个 Observable，
 * 字符串也部署有 iterator 接口，所以也支持。
 *
 * from 还可以根据 promise 创建一个 Observable。
 * 我们用 fetch 或者 axios 等类库发送的请求都是一个 promise 对象，
 * 我们可以使用 from 将其处理为一个 Observable 对象。
 */
export const fromSource$ = from([1, 2, 3]);

/**
 * fromEvent
 * 用 DOM 事件创建 Observable，第一个参数为 DOM 对象，第二个参数为事件名称。
 */
export const click$ = fromEvent(document.body, 'click');

function addClickHandler(handler: any) {
  document.addEventListener('click', handler);
}

function removeClickHandler(handler: any) {
  document.removeEventListener('click', handler);
}

/**
 * fromEventPattern
 * 将添加事件处理器、删除事件处理器的 API 转化为 Observable
 */
fromEventPattern(addClickHandler, removeClickHandler).subscribe((x) =>
  console.log(x),
);

/**
 * 可以是我们自己实现的和事件类似，拥有注册监听和移除监听的 API
 */
class EventEmitter {
  public handlers: { [k: string]: NodeEventHandler[] } = {};

  public on(eventName: string, handler: NodeEventHandler) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }

    if (typeof handler === 'function') {
      this.handlers[eventName].push(handler);
    }
  }

  public off(eventName: string, handler: NodeEventHandler) {
    this.handlers[eventName].splice(
      this.handlers[eventName].indexOf(handler),
      1,
    );
  }

  public emit(eventName: string, ...args: any[]) {
    this.handlers[eventName].forEach((handler) => {
      handler(...args);
    });
  }
}

const event = new EventEmitter();

const subscription = fromEventPattern(
  event.on.bind(event, 'say'),
  event.off.bind(event, 'say'),
).subscribe((x) => console.log('console by oberver, data:', x));

let timer = (() => {
  let count = 1;
  return window.setInterval(() => {
    if (count === 5) {
      clearInterval(timer);
      timer = 0;
    }
    event.emit('say', `emit 'say' - ${count++}`);
  }, 1000);
})();

setTimeout(() => {
  subscription.unsubscribe();
}, 3000);
