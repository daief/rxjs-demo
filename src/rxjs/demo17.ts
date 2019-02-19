/**
 * - debounceTime、throttleTime
 * - distinct、distinctUntilChanged
 * - dalay、delayWhen
 */

import { fromEvent, of, interval } from 'rxjs';
import { debounceTime, map, distinct, delay, delayWhen } from 'rxjs/operators';
import { Log } from '@/utils';

const elInput = document.createElement<'input'>('input');

document.body.appendChild(elInput);

/**
 * 类似 lodash 的 debounce 和 throttle，用来降低事件的触发频率。
 * 我们做搜索时，常常要对输入进行 debounce 来减少请求频率。
 */
fromEvent<any>(elInput, 'input').pipe(
  debounceTime(300),
  map(e => e.target.value),
).subscribe(
  input => Log('try debounceTime', input),
);

/**
 * distinct 操作符可以用来去重，将上游重复的数据过滤掉。
 */
of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1).pipe(
  distinct(),
).subscribe(x => Log('try distinct -', x));

/**
 * distinct 操作符还可以接收一个 keySelector 的函数作为参数
 */
interface Person {
  age: number;
  name: string;
}

of<Person>(
  { age: 4, name: 'Foo' },
  { age: 7, name: 'Bar' },
  { age: 5, name: 'Foo' },
).pipe(
  distinct((p: Person) => p.name),
).subscribe(x => Log('try distinct keySelector', x));

/**
 * distinctUntilChanged 也是过滤重复数据，
 * 但是只会与上一次发出的元素比较。这个操作符比 distinct 更常用。
 * distinct 要与之前发出的不重复的值进行比较，因此要在内部存储这些值，要小心内存泄漏，
 * 而 distinctUntilChanged 只用保存上一个的值。
 */

/**
 * dalay、delayWhen
 * 用来延迟上游 Observable 数据的发出。
 */
fromEvent(elInput, 'click').pipe(delay(1000)).subscribe(x => Log('try delay', x));

/**
 * 前面介绍过 bufferWhen，dalayWhen 也带有 when，
 * 在 RxJS 中，这种操作符它接收的参数都是 Observable Factory，
 * 即一个返回 Observable 对象的回调函数，用这个 Observable 来进行控制。
 *
 * 每个 click 都延迟 0 至 5 秒之间的任意一个时间
 */
fromEvent(document, 'click').pipe(
  delayWhen(_ => interval(Math.random() * 5000)),
).subscribe(x => Log('try delayWhen', x));
