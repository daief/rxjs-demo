/**
 * 按钮点击事件流演示
 */

/**
 * 代表流的变量用 $ 符号结尾，是 RxJS 中的一种惯例
 *
 * RxJS 有一个核心和三个重点，
 *  一个核心是 Observable 再加上相关的 Operators，
 *  三个重点分别是 Observer、Subject、Schedulers。
 */

import {fromEvent} from 'rxjs';

import {take} from 'rxjs/operators';

const btn = document.createElement('button') as HTMLButtonElement;

btn.textContent = 'demo1 button';

document.body.appendChild(btn);

/**
 * fromEvent 将点击事件转换为 RxJS 的 Observable （响应式数据流）
 */
const click$ = fromEvent(btn, 'click');

click$.pipe(
  // take 表示只操作一次
  take(1),
)
  // 观察者通过订阅（subscribe）来响应变化
  .subscribe((e) => {
    console.log('click', e);
  });
