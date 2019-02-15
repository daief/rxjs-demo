/**
 * 操作符 -- Part1
 *  - 常规
 *  - 过滤类
 */

import {filter, map, mapTo, take, takeUntil} from 'rxjs/operators';
import { range, fromEvent, interval } from 'rxjs';

range(100).pipe(
  filter((x) => x % 2 === 0),
  map((x) => x * 2),
).subscribe((x) => console.log(x));

/**
 * map、filter 和数组的 map、filter 方法类似，
 * scan 则是和 reduce 方法类似
 */

/**
 * mapTo 是将所有发出的数据映射到一个给定的值
 */
fromEvent(document, 'click').pipe(
  mapTo('Hi'),
)
  // 点击后输出 `Hi`
  .subscribe((x) => console.log(x));

console.log('-'.repeat(20));

/**
 * 一些过滤的操作符
 *  - take 是从数据流中选取最先发出的若干数据
 *  - takeLast 是从数据流中选取最后发出的若干数据
 *  - takeUntil 是从数据流中选取直到发生某种情况前发出的若干数据
 *  - first 是获得满足判断条件的第一个数据
 *  - last 是获得满足判断条件的最后一个数据
 *  - skip 是从数据流中忽略最先发出的若干数据
 *  - skipLast 是从数据流中忽略最后发出的若干数据
 */

/**
 * 使用了 take(3)，表示只取 3 个数据，Observable 就进入完结状态。
 */
interval(100).pipe(
  take(3),
).subscribe(
  (x) => console.log('try take:', x),
  null,
  () => console.log('try take:', 'complete'),
);

/**
 * 这里有一个 interval 创建的数据流一直在发出数据，
 * 直到当用户点击文档 document 时停止计时
 */
interval(1000).pipe(
  takeUntil(fromEvent(document, 'click')),
).subscribe(
  (x) => console.log('try takeUntil', x + 1),
  null,
  () => console.log('try takeUntil', 'complete'),
);
