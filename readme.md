## 注意

### tip1

一个 Promise 的状态改变，比如说变成 rejected
不会影响其链式中的 then 返回的 Promise 的状态

例如下面的代码  success 是会成功打印的
```js
const p = new Promise((resolve, reject) => {
  reject('fail')
})
  .then(() => {}, reason => reason)
  .then(res => console.log('success'))
```


### tip2

如果返回一个 new Promise 且.then 我们不做特殊处理的话  打印出来 会是一个 LPromise 的实例
```js
const p1 = new LPromise((resolve, reject) => {
  resolve('解决')
}).then(res => {
  return new LPromise(resolve => resolve('返回的Promise'))
}).then(res => {
  console.log(res)
})
```

### tip3 也就是 problem1.html 中的 todo

返回的 一开始我想不通 为什么不是 resolve 返回的Promise 而是 reject 返回的Promise 呢
不是在链式调用的时候 都是用的 resolve 吗

原来 const result = realOnRejected(this.reason) 中 result 状态是 REJECTED 了 那自然 result.then(resolve, reject) 会执行第二个回调咯
这也是设计的精妙之处，符合我们用 Promise 的习惯
```js
const p1 = new promise((resolve, reject) => {
  reject('拒绝')
})
.then(
  res => {
    return new LPromise(resolve => {
      resolve('返回的Promise')
    })
  },
  err => {
    return new LPromise((resolve, reject) => {
      // todo  这里 resolve reject 变换 逻辑的走位
      reject('返回的Promise')
    })
  }
).then(res => {
  console.log('resolve', res)
}, reason => {
  console.log('reject', reason)
})
```

### tip4

Promise.then 中不可再返回本身

```js
const p = new Promise((resolve, reject) => {
  resolve(1)
})
const a = p.then(res => {
  return a
})
// console.error("Uncaught (in promise) TypeError: Chaining cycle detected for promise #<Promise>")
```

