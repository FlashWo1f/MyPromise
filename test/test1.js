const FULFILLDE = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function isFn(v) {
  return typeof v === 'function'
}

class LPromise {

  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.callbacks = []
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)
    }
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLDE
      this.value = value
      this.callbacks.forEach(cb => {
        cb.onFulfilled(value)
      })
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      this.callbacks.forEach(cb => {
        cb.onRejected(reason)
      })
    }
  }

  then = (onFulfilled, onRejected) => {
    // 如果不传  为了能穿透  给个默认函数
    const realOnFulfilled = isFn(onFulfilled) ? onFulfilled : value => value;
    const realOnRejected = isFn(onRejected) ? onRejected : reason => { throw reason };
    return new LPromise((resolve, reject) => {
      if (this.status === FULFILLDE) {
        queueMicrotask(() => {
          try {
            const result = realOnFulfilled(this.value)
            // 用 resolve 将 .then 新返回的 Promise 状态改变 得以让链式 .then 持续地调用
            // resolve(result)
            if (result instanceof LPromise) {
              // 要调用这个最内层 LPromise 的resolve
              // result.then(value => {
              //   resolve(value)
              // }, reason => {
              //   reject(reason)
              // })
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        })
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          try {
            const result = realOnRejected(this.reason)
            // debugger
            if (result instanceof LPromise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (error) {
            reject(error)
          }
        })
      } else {
        this.callbacks.push({
          onFulfilled: (value) => {
            queueMicrotask(() => {
              try {
                const result = realOnFulfilled(value)
                if (result instanceof LPromise) {
                  result.then(resolve, reject)
                } else {
                  resolve(result)
                }
              } catch (error) {
                reject(error)
              }
            })
          },
          onRejected: (reason) => {
            queueMicrotask(() => {
              try {
                const result = realOnRejected(reason)
                if (result instanceof LPromise) {
                  result.then(resolve, reject)
                } else {
                  resolve(result)
                }
              } catch (error) {
                reject(error)
              }
            })
          }
        })
      }
    })
  }
}


