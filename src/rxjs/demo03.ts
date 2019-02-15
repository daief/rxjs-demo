/**
 * 观察者 Observer 的三个对象
 *  - next： 当 Observable 发出新的值时被调用，接收这个值作为参数
 *  - complete：当 Observable 完结，没有更多数据时被调用。complete 之后，next 方法无效
 *  - error：当 Observable 内部发生错误时被调用，之后不会调用 complete，next 方法无效
 */

import { Observable } from 'rxjs';

const source1$ = new Observable((observer) => {
  observer.next(1);
  observer.next(2);
  /**
   * 调用 complete
   */
  observer.complete();

  observer.next(3);
});

source1$.subscribe({
  next: (item) => console.log('source-1', item),
  complete: () => console.log('source-1', 'complete'),
});

/*
  结果，不会输出 3：
    source-1 1
    source-1 2
    source-1 complete
*/

console.log('-'.repeat(20));

const source2$ = new Observable((observer) => {
  try {
    observer.next(1);
    observer.next(2);
    throw new Error('there is an exception');
  } catch (e) {
    observer.error(e);
    observer.complete();
  }
});

source2$.subscribe({
  next: (item) => console.log('source-2', item),
  error: (e) => console.log('source-2 error', e),
  complete: () => console.log('source-2', 'complete'),
});

/*
  结果，`error 之后不会再调用 complete`：
    source-2 1
    source-2 2
    source-2 error Error: there is an exception
*/

/**
 * 还可顺序传参，不用构建对象
 * 参数依次为 next 、error、complete
 */
source2$.subscribe(
  (item) => console.log('source-2', item),
  (e) => console.log('source-2 error', e),
  () => console.log('source-2', 'complete'),
);
