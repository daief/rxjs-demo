/**
 * 延迟执行 lazy evaluation
 *
 * 传给 new Observable 的回调函数如果没有订阅是不会执行的，
 * 订阅一个 Observable 就像是执行一个函数，和下面的函数类似。
 * 这和我们常见的那种内部保存有观察者列表的观察者模式是不同的，
 * Observable 内部没有这个观察者列表。
 */

function subscribe(observer: {
  next: (p: any) => void
  error: (p: any) => void
  complete: () => void,
}) {
  let count = 1;
  setInterval(() => {
    observer.next(count++);
  }, 1000);
}

/**
 * 调用后才执行
 */
subscribe({
  next: (item) => console.log(item),
  error: (e) => console.log(e),
  complete: () => console.log('complete'),
});
