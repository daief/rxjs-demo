/**
 * 操作符 -- Part4
 *  - concatMap、mergeMap、switchMap
 *
 *  前一节中可知高阶 Observable 常常是由 map 操作符将每个数据映射为 Observable 产生的
 *  而我们订阅的时候需要将其压平为一阶 Observable
 *  就是要先使用 map 操作符再使用 concatAll 或 mergeAll 或 switchAll 这些操作符中的一个
 *
 *  RxJS 中提供了对应的更简洁的 API。
 *  使用的效果可以用下面的公式表示：
 *  - concatMap = map + concatAll
 *  - mergeMap = map + mergeAll
 *  - switchMap = map + switchAll
 */

import { interval } from 'rxjs';
import { take, map, switchAll, switchMap } from 'rxjs/operators';
import { Log, now } from '@/utils';

interval(1500).pipe(
  take(3),
  map((x) => interval(1000).pipe(
    map((y) => x + ':' + y),
    take(2),
  )),
  switchAll(),
).subscribe((x) => Log('try switchAll', x, now()));

interval(1500).pipe(
  take(3),
  switchMap(x => interval(1000).pipe(
    map((y) => x + ':' + y),
    take(2),
  )),
).subscribe((x) => Log('try switchMap', x, now()));
