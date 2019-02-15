/**
 * 创建 Observable
 */

import { Observable } from 'rxjs';

/**
 * 通过 Observable 创建了一个 Observable
 */
const source$ = new Observable<number>((observer) => {
  observer.next(1);

  observer.next(2);

  observer.next(3);
});

console.log('start');

/**
 * 调用 subscribe 进行订阅
 */
source$.subscribe({
  next: (item) => console.log(item),
});

console.log('end');

/*
  结果：

   start
   1
   2
   3
   end
*/

console.log('-'.repeat(20));

/**
 * 通过 Observable 创建了一个 `异步` Observable
 */
const sourceAsync$ = new Observable<number>((observer) => {
  let count = 1;
  setInterval(() => {
    observer.next(count++);
  }, 1000);
});

console.log('start');
sourceAsync$.subscribe({
  next: (item) => console.log(item),
});
console.log('end');

/*
  结果：

   start
   end
   1
   2
   3
   4
   ...
 */
