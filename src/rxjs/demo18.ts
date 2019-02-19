/**
 * 异常错误处理
 * 对错误处理的处理可以分为两类，即恢复(recover)和重试(retry)。
 *
 *  - catchError
 *  - retry、retryWhen
 *  - finalize
 */

import {interval, of} from 'rxjs';
import { take, map, catchError, retry, retryWhen, delay, finalize } from 'rxjs/operators';
import { Log } from '@/utils';

/**
 * catchError 用来在管道中捕获上游传递过来的错误。
 *
 * catchError 中的回调函数返回了一个 Observable，
 * 当捕获到上游的错误时，调用这个函数，
 * 返回的 Observable 中发出的数据会传递给下游。
 * 因此上面当 x 为 4 时发生了错误，会用 8 来替换。
 */
interval(1000).pipe(
  take(6),
  map(x => {
    if (x === 4) {
      throw new Error('unlucky number 4');
    } else {
      return x;
    }
  }),
  catchError(_ /* error parameter */ => of(8)),
).subscribe(x => Log('try catchError -', x));
// 0
// 1
// 2
// 3
// 8

/**
 * catchError 中的回调函数除了接收错误对象为参数外，
 * 还有第二个参数 caught$ 表示上游的 Observable 对象。
 * 如果回调函数返回这个 Observable 对象，就会进行重试。
 */
interval(1000).pipe(
  take(6),
  map(x => {
    if (x === 4) {
      throw new Error('unlucky number 4');
    } else {
      return x;
    }
  }),
  catchError((_, caught$) => caught$),
  take(20),
).subscribe(x => Log('try catchError caught', x));
// 依次输出 5 遍 0, 1, 2, 3

/**
 * retry 可以接收一个整数作为参数，表示重试次数，如果是负数或者没有传参，会无限次重试。重试实际上就是退订再重新订阅。
 * 实际开发中，如果是代码原因造成的错误，重试没有意义，
 * 如果是因为外部资源导致的异常错误适合重试，如用户网络或者服务器偶尔不稳定的时候。
 */
interval(1000).pipe(
  take(6),
  map(x => {
    if (x === 4) {
      throw new Error('unlucky number 4');
    } else {
      return x;
    }
  }),
  retry(5), // 重试 5 次
).subscribe(x => Log('try retry -', x));

/**
 * retryWhen 操作符接收一个返回 Observable 的回调函数，用这个 Observable 来控制重试的节奏。
 * 当这个 Observable 发出一个数据时就会进行一次重试，它完结时 retryWhen 返回的 Observable 也立即完结。
 */
interval(1000).pipe(
  take(6),
  map(x => {
    if (x === 4) {
      throw new Error('unlucky number 4');
    } else {
      return x;
    }
  }),
  retryWhen(err$ => err$.pipe(
    delay(1000),
    take(5)),
  ), // 延迟 1 秒后重试，重试 5 次
).subscribe(x => Log('try retryWhen', x));

/**
 * NOTE
 * Angular 官网介绍了一个 Exponential backoff 的方法。将每次重试的延迟时间控制为指数级增长。
 * https://angular.io/guide/practical-observable-usage#exponential-backoff
 */

/**
 * 返回上游数据流的镜像 Observable，当上游的 Observable 完结或出错时调用传给它的函数，不影响数据流。
 */
interval(1000).pipe(
  take(6),
  map(x => {
    if (x === 4) {
      throw new Error('unlucky number 4');
    } else {
      return x;
    }
  }),
  finalize(() => Log('try finalize, finally')),
).subscribe(x => Log('try finalize', x));
