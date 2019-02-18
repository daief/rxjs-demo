/**
 * 操作符 -- Part6
 *  - startWith、forkJoin、race
 */
import { fromEvent, from, interval, forkJoin, race } from 'rxjs';
import { startWith, switchMap, take, mapTo } from 'rxjs/operators';
import { Log, now } from '@/utils';

const elBtn = document.createElement('button') as HTMLButtonElement;
const elNumber = document.createElement('div') as HTMLDivElement;

elBtn.textContent = 'button';
elBtn.setAttribute('class', 'ui button');
elNumber.setAttribute('id', 'number');
elNumber.setAttribute('style', `
  border: 1px solid black;
  padding: 5px;
`.trim());

document.body.appendChild(elBtn);
document.body.appendChild(elNumber);

let count = 0;
const fakeRequest = (): Promise<number> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(count++);
    }, 2000);
  });
};

fromEvent(elBtn, 'click').pipe(
  /**
   * startWith 是在 Observable 的一开始加入初始数据，同步立即发送，常用来提供初始状态。
   * 这里会立即发送一次 fakeRequest
   */
  startWith('initData'),
  switchMap(_ => from(fakeRequest())),
).subscribe(x => document.querySelector('#number')!.textContent = `${x}`);

/**
 * forkJoin 只有静态方法形式，类似 Promise.all，
 * 它会等内部所有 Observable 都完结之后，将所有 Observable 对象最后发出来的最后一个数据合并成 Observable。
 */
forkJoin(
  interval(1500).pipe(take(3)),
  interval(2000).pipe(take(2)),
).subscribe(x => Log('try forkJoin', x, now()));
/**
 * 4.5s 后输出 [2, 1]
 */

const obs1 = interval(1000).pipe(mapTo('fast one'));
const obs2 = interval(3000).pipe(mapTo('medium one'));
const obs3 = interval(5000).pipe(mapTo('slow one'));

race(obs3, obs1, obs2)
  .subscribe(
    winner => Log('try race', winner),
  );
/**
 * race 操作符产生的 Observable 会完全输出最先吐出数据的 Observable。
 */
