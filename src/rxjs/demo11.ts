/**
 * 操作符 -- Part3
 *  - concatAll、mergeAll、switchAll
 */

/**
 * concatAll、mergeAll、switchAll
 * 用来将高阶的 Observable 对象压平成一阶的 Observable，和 loadash 中压平数组的 flatten 方法类似。
 * - concatAll 会对内部的 Observable 对象做 concat 操作，和 concat 操作符类似，如果前一个内部 Observable 没有完结，那么 concatAll 不会订阅下一个内部 Observable
 * - mergeAll 则是同时处理
 * - switchAll 比较特殊一些，它总是切换到最新的内部 Observable 对象获取数据。
 *    上游高阶 Observable 产生一个新的内部 Observable 时，
 *    switchAll 就会立即订阅最新的内部 Observable，退订之前的，这也就是 ‘switch’ 的含义。
 */

import { interval } from 'rxjs';
import { map, switchAll, take } from 'rxjs/operators';

interval(1500).pipe(
  take(2),
  map((x) => interval(1000).pipe(
    map((y) => x + ':' + y),
    take(2)),
  ),
  switchAll(),
).subscribe((x) => console.log('try switchAll', x, Date.now()));
/**
 * 结果图：
 * ```md
 *  source1: --0--1|
 *  source2: --------0--1|
 *  example: --0--1--0--1|
 * ```
 */
