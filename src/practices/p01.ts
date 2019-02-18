/**
 * 练习：
 * 页面上有一个 p 标签存放一个状态，
 * 初始为 0，有两个按钮，一个按钮点击后这个状态增加 1，另一个按钮点击后这个状态减少 1。
 *
 * ```html
 *  <button id="addButton">Add</button>
 *  <button id="minusButton">Minus</button>
 *  <p id="state"></p>
 * ```
 */
import { createButton } from '@/utils';
import { fromEvent, EMPTY, merge } from 'rxjs';
import { mapTo, startWith, scan } from 'rxjs/operators';

const addBtn = createButton('add');
const minusBtn = createButton('minus');
const state = document.createElement<'p'>('p');

state.setAttribute('class', 'ui segment');

[addBtn, minusBtn, state].forEach(e => document.body.appendChild(e));

/**
 * 两个按钮的点击事件我们都可以建立响应式数据流，
 * 可以使用 mapTo(1) 和 mapTo(-1) 分别表示点击后增加 1 和减少 1
 */
const addClick$ = fromEvent(addBtn, 'click').pipe(mapTo(1));
const minusClick$ = fromEvent(minusBtn, 'click').pipe(mapTo(-1));

merge(
  /**
   * 使用 EMPTY 创建一个空的数据流来表示这个状态
   * 用 startWith 设定初始值
   */
  EMPTY.pipe(startWith(0)),
  addClick$,
  minusClick$,
).pipe(
  /**
   * scan 实现累加计算
   */
  scan((origin, next) => origin + next),
).subscribe(item => {
  state.textContent = `${item}`;
});

/*
  原文：这两个按钮的点击事件我们都可以建立响应式数据流，
  可以使用 mapTo(1) 和 mapTo(-1) 分别表示点击后增加 1 和减少 1。
  我们可以使用 EMPTY 创建一个空的数据流来表示这个状态，用 startWith 设定初始值。
  然后 merge 这两个点击的数据流，但是这还有一个问题，
  点击事件的数据流需要与表示状态的数据流进行逻辑计算，发出最终的状态，
  我们才能去订阅这个最终的数据流来更改页面的显示。而这种累计计算的方法，可以用 scan 操作符来实现。
*/
