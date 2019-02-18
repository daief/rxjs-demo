import { fromEvent } from 'rxjs';
import { map, concatMap, takeUntil } from 'rxjs/operators';

/**
 * 练习，实现拖拽：
 * 页面上有一个 id 为 drag 的 div：
 * ```html
 * <style>
 *  html, body {
 *    height: 100%;
 *    background-color: tomato;
 *    position: relative;
 *  }
 *
 * \#drag {
 *    position: absolute;
 *    width: 100px;
 *    height: 100px;
 *    background-color: #fff;
 *    cursor: all-scroll;
 * }
 * </style>
 * ```
 *
 * 实现功能：
 * 1. 当在这个 div 上按下鼠标左键 mousedown 时，开始监听鼠标移动 mousemove 位置
 * 2. 当鼠标松开 mouseup 时，结束监听鼠标移动
 * 3. 当鼠标移动被监听时，更新 div 样式来实现拖拽效果
 */

document.documentElement.setAttribute('style', `
  height: 100%;
  background-color: tomato;
  position: relative;
`.trim());
document.body.setAttribute('style', `
  height: 100%;
  background-color: tomato;
  position: relative;
`.trim());

const elDiv = document.createElement<'div'>('div');
document.body.appendChild(elDiv);

elDiv.setAttribute('style', `
  position: absolute;
  width: 100px;
  height: 100px;
  background-color: #fff;
  cursor: all-scroll;
`.trim());

// ----------------------------------------------------------------

/**
 * 转化 DOM 事件为流
 */
const mouseDown$ = fromEvent<MouseEvent>(elDiv, 'mousedown');
const mouseMove$ = fromEvent<MouseEvent>(elDiv, 'mousemove');
const mouseUp$ = fromEvent<MouseEvent>(elDiv, 'mouseup');

/**
 * 对于鼠标按下这个数据流，每次鼠标按下事件发生时都转成鼠标移动的数据流
 */
// mouseDown$.pipe(
//   map(mouseEvent => mouseMove$.pipe(
//     /**
//      * 鼠标松开时，结束监听鼠标移动，我们可以用 takeUntil 表示这个逻辑
//      */
//     takeUntil(mouseUp$)
//   ))
// )

/**
 * 以上 map 操作符内每次将 mousedown 映射为一个 Observable，形成了高阶 Observable，
 * 我们需要用 concatAll 压平，map 和 concatAll 连用，替换为更简洁的 concatMap
 */
mouseDown$.pipe(
  concatMap(mouseDownEvent => mouseMove$.pipe(
    map(mouseMoveEvent => ({
      left: mouseMoveEvent.clientX - mouseDownEvent.offsetX,
      top: mouseMoveEvent.clientY - mouseDownEvent.offsetY,
    })),
    takeUntil(mouseUp$),
  )),
).subscribe(position => {
  elDiv.style.left = `${position.left}px`;
  elDiv.style.top = `${position.top}px`;
});
