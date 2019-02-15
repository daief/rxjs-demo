/**
 * 操作符 -- Part2
 *  - 合并类操作符
 *    - merge、concat、combineLatest、race、zip 这些操作符方法，而是推荐使用对应的静态方法，即从 rxjs 导入而不是 rxjs/operators
 *    - https://rxjs-dev.firebaseapp.com/api/operators/merge
 */
import { interval, merge as staticMerge } from 'rxjs';
import { merge, take, concat } from 'rxjs/operators';

/**
 * concat、merge
 * concat、merge 都是用来把多个 Observable 合并成一个
 *  - concat 要等上一个 Observable 对象 complete 之后才会去订阅第二个 Observable 对象获取数据并把数据传给下游
 *  - merge 同时处理多个 Observable
 *
 */
interval(500).pipe(
  take(3),
  merge(
    interval(300).pipe(take(6)),
  ),
).subscribe((x) => console.log('try merge', x));
/**
 * 上述结果图解
 * ```md
 * source : ----0----1----2|
 * source2: --0--1--2--3--4--5|
 *            merge()
 * example: --0-01--21-3--(24)--5|
 * ```
 */

interval(500).pipe(
  take(3),
  concat(
    interval(300).pipe(take(6)),
  ),
).subscribe((x) => console.log('try concat', x));
/**
 * 上述结果图解
 * ```md
 * source : ----0----1----2|
 * source2: -----------------0--1--2--3--4--5|
 *            concat()
 * example: ----0----1----2--0--1--2--3--4--5|
 * ```
 */

/**
 * 静态 merge
 * 使用方式变成了合并多个 Observable，而不是一个 Observable 与其他 Observable 合并。
 */
staticMerge(
  interval(500).pipe(take(3)),
  interval(300).pipe(take(6)),
).subscribe((x) => console.log('try static merge', x));
