/**
 * 缓存 -- Part1
 *  - buffer、bufferTime、bufferCount、bufferWhen、bufferToggle
 */
import {interval, fromEvent} from 'rxjs';
import { take, buffer, bufferTime, bufferWhen, bufferToggle } from 'rxjs/operators';
import { Log } from '@/utils';

/**
 * buffer 接收一个 Observable 作为 notifier，当 notifier 发出数据时，将 缓存的数据传给下游。
 */
const ob1$ = interval(300).pipe(
  take(30),
  buffer(interval(1000)),
);
// [0, 1, 2]
// [3, 4, 5]
// [6, 7, 8]
// [9, 10, 11, 12]
// [13, 14, 15]
// [16, 17, 18]
// [19, 20, 21, 22]
// [23, 24, 25]
// [26, 27, 28]

/**
 * bufferTime 是用时间来控制时机，上面可以改成 bufferTime(1000)
 */
const ob2$ = interval(300).pipe(
  take(30),
  bufferTime(1000),
);

/**
 * bufferCount 是用数量来控制时机，如 3 个一组，bufferCount(3)
 */

/**
 * bufferWhen 接收一个叫做 closeSelector 的参数，
 * 它应该返回一个 Observable。通过这个 Observable 来控制缓存。
 * 这个函数没有参数。下面的方法等价于前面的 buffer：
 */
const ob3$ = interval(300).pipe(
  take(30),
  bufferWhen(() => interval(1000)),
);

ob1$.subscribe(x => Log('try buffer -', x));
ob2$.subscribe(x => Log('try bufferTime', x));
ob3$.subscribe(x => Log('try bufferWhen', x));
/**
 * TODO
 *  - 三个单独运行的结果不同
 *  - 第一个为啥不输出 29
 */

/**
 * bufferToggle 和 buffer 的不同是可以不断地控制缓存窗口的开和关，
 * 一个参数是一个 Observable，称为 opening，第二个参数是称为 closeSelector 的一个函数。
 * 这个函数的参数是 opening 产生的数据。前一个参数用来控制缓存的开始时间，后一个控制缓存的结束。
 * 与 bufferWhen 相比，它的 closeSelector 可以接收参数，控制性更强。
 *
 * 以下例子：
 *  按住鼠标移动，缓存移动时经过的点
 */
fromEvent(document, 'mousemove')
.pipe(
  bufferToggle(
    fromEvent(document, 'mousedown'),
    _ => fromEvent(document, 'mouseup'),
  ),
).subscribe(x => Log('try bufferToggle', x));
