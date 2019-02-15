/**
 * 退订 unsubscribe
 *
 * 观察者想退订，只要调用订阅返回的对象的 unsubscribe 方法，
 * 这样观察者就再也不会接受到 Observable 的信息
 */
import { Observable } from 'rxjs';

const source$ = new Observable((observer) => {
  let count = 1;
  setInterval(() => {
    observer.next(count++);
  }, 1000);
});

const subscription = source$.subscribe({
  next : (item) => console.log(item),
});

setTimeout(() => {
  subscription.unsubscribe();
}, 5000);
