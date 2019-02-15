/**
 * 操作符 operators
 *  每一个操作符都会产生一个新的 Observable，
 *  不会对上游的 Observable 做任何修改，
 *  这完全符合函数式编程“数据不可变”的要求。
 * 弹珠图 Marble diagrams
 *  查看网址，https://rxmarbles.com/
 */

import { interval } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * interval 操作符创造了一个数据流，
 * interval(1000) 会产生一个每隔 1000 ms 就发出一个从 0 开始递增的数据
 */
const source$ = interval(1000)
  /**
   * pipe 方法就是数据管道，会对数据流进行处理，
   * 可以添加更多的操作符作为参数
   */
  .pipe(
    map((x) => x * x),
  );

source$.subscribe((x) => console.log(x));

/**
 * 上例可用下图表示：
 * ```md
 *  source: -----0-----1-----2-----3--...
 *          map(x => x * x)
 *  newest: -----0-----1-----4-----9--...
 * ```
 */
