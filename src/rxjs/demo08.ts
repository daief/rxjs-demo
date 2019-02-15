/**
 * 创建 Observable 的这些方法就是用来创建 Observable 数据流的 -- Part2
 */

import {interval, timer, range, defer} from 'rxjs';

/**
 * interval 和 JS 中的 setInterval 类似，参数为间隔时间，下面的代码每隔 1000 ms 会发出一个递增的整数。
 * 0、1、2、3...
 */
interval(1000).subscribe((x) => console.log('interval', x));

/**
 * timer 则可以接收两个参数，
 * 第一个参数为发出第一个值需要等待的时间，
 * 第二个参数为之后的间隔时间。
 * 1s   1
 * 3s   2
 * 3s   3
 * 3s   4
 * ...
 */
timer(1000, 3000).subscribe((x) => console.log('timer', x));

/**
 * 产生 1 到 20 的正整数
 */
range(1, 20).subscribe((x) => console.log('range', x));

/**
 * empty、throwError、never
 * - empty 是创建一个立即完结的 Observable，
 * - throwError 是创建一个抛出错误的 Observable，
 * - never 则是创建一个什么也不做的 Observable（不完结、不吐出数据、不抛出错误）
 *
 * 这三个操作符单独用时没有什么意义，主要用来与其他操作符进行组合。
 * 目前官方不推荐使用 empty 和 never 方法，而是推荐使用常量 EMPTY 和 NEVER（注意不是方法，已经是一个 Observable 对象了）。
 */

/**
 * defer 创建的 Observable 只有在订阅时才会去创建我们真正想要操作的 Observable。
 * defer 延迟了创建 Observable，而又有一个 Observable 方便我们去订阅，这样也就推迟了占用资源。
 *
 * https://stackoverflow.com/a/38771306/10528190
 */
const fetch$ = defer(() => (console.log('defer: do fetch.') as any) || fetch('https://baidu.com'));

setTimeout(() => {
  fetch$.subscribe((rs) => console.log('fetch rs:', rs));
}, 2000);
