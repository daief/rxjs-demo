/**
 * 操作符 -- Part5
 *  - zip、combineLatest、withLatestFrom
 */

import { interval, zip, combineLatest } from 'rxjs';
import { take, map, withLatestFrom } from 'rxjs/operators';
import { Log, now } from '@/utils';

const source$ = interval(500).pipe(take(3));
const newest$ = interval(300).pipe(take(6));

const add = (x: number, y: number) => x + y;

zip(source$, newest$).pipe(
  // 此处执行 map 操作
  // 否则数据为 [number, number]
  map(x => add(...x)),
).subscribe(x => Log('try zip', x, now()));
/**
 * zip 有拉链的意思，这个操作符和拉链的相似之处在于数据一定是一一对应的。
 * zip 是内部的 Observable 都发出相同顺序的数据后才交给下游处理。
 *
 * ```md
 *  source$: ----0----1----2|
 *  newest$: --0--1--2--3--4--5|
 *  example: ----0----2----4|
 * ```
 *
 * 上面的示例运行过程如下：
 *  1. newest 发出第一个值 0，但这时 source 还没有发出第一个值，不会向下游发出数据
 *  2. source 发出第一个值 0，此时 newest 之前已发出了第一个值 0，执行 map 操作得到 0
 *  3. newest 发出第二个值 1，但这时 source 还没有发出第二个值，不会向下游发出数据
 *  4. newest 发出第三个值 2，但这时 source 还没有发出第三个值，不会向下游发出数据
 *  5. source 发出第二个值 1，此时 newest 之前已发出了第二个值 1，执行 map 操作得到 2
 *  6. newest 发出第四个值 3，但这时 source 还没有发出第四个值，不会向下游发出数据
 *  7. source 发出第三个值 2，此时 newest 之前已发出了第二个值 2，执行 map 操作得到 4
 *  8. source 完结，不可能再有对应的数据了，整个 Observable 完结
 *
 * 官方推荐如上所述的 zip 静态方法，不使用 rxjs/operators/zip
 *
 * 注意：使用 zip 当有数据流吐出数据很快，而有数据流发出值很慢时，要小心数据积压的问题。
 * 这时快的数据流已经发出了很多数据，由于对应的数据还没发出，RxJS 只能保存数据，
 * 快的数据流不断地发出数据，积压的数据越来越多，消耗的内存也会越来越大。
 */

combineLatest(
  interval(500).pipe(take(3)),
  interval(300).pipe(take(6)),
).subscribe(x => Log('try combineLatest', x));
/**
 * combineLatest 与 zip 不同，只要其他的 Observable 已经发出过值就行，
 * 顾名思义，就是与其他 Observable 最近发出的值结合。
 * 这里用 `.` 表示结果
 * ```md
 *  source1: ----0----1----2|
 *  source2: --0--1--2--3--4   --5|
 *  example: ----..--..-.--(..)--.|
 * ```
 *  [0, 0]
 *  [0, 1]
 *  [0, 2]
 *  [1, 2]
 *  [1, 3]
 *  [2, 3]
 *  [2, 4]
 *  [2, 5]
 */

interval(500).pipe(
  take(3),
  withLatestFrom(
    interval(300).pipe(take(6)),
  ),
).subscribe(x => Log('try withLatestFrom', x));
/**
 * withLatestFrom 没有静态方法，只有操作符方法，
 * 前面的方法所有 Observable 地位是平等的，
 * 而这个方法是使用这个操作符的 Observable 起到了主导作用，即只有它发出值才会进行合并产生数据发出给下游。
 *
 * ```md
 *  source1: ----0----1----2|
 *  source2: --0--1--2--3--4--5|
 *  example: ----.----.----.|
 * ```
 *
 * 1. source1 发出 0 时，source2 最新发出的值为 0，结合为 [0, 0] 发出
 * 2. source1 发出 1 时，source2 最新发出的值为 2，结合为 [1, 2] 发出
 * 3. source1 发出 2 时，source2 最新发出的值为 4，结合为 [2, 4] 发出
 */
