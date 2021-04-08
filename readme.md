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

