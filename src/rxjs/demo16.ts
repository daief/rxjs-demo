/**
 * 缓存 -- Part2
 *  - window、windowTime、windowCount、windowWhen、windowToggle
 *
 * 与前面的 buffer 类似，不过 window 缓存数据汇聚的形式是 Observable，因此形成了高阶 Observable。
 */
import {window, take, map, mergeAll} from 'rxjs/operators';
import { interval, fromEvent } from 'rxjs';
import { Log } from '@/utils';

const clicks = fromEvent(document, 'click');
const sec = interval(1000);
const result = clicks.pipe(
  window(sec),
  map(win => win.pipe(take(2))),  // each window has at most 2 emissions
  mergeAll(),                     // flatten the Observable-of-Observables
);
result.subscribe(x => Log(x));
/**
 * 连续点击页面，1s 内最多只触发前两次
 */
