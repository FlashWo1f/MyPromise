const FULFILLDE = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'
let uid = 0
function isFn(v) {
  return typeof v === 'function'
}

class LPromise {

  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.callbacks = []
    this.uid = uid++
    // try {
    executor(this.resolve, this.reject)
    // } catch (error) {
    //   this.reject(error)
    // }
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

  catch = (onRejected) => {
    return this.then(val => val, onRejected)
  }

  then = (onFulfilled, onRejected) => {
    // 如果不传  为了能穿透  给个默认函数
    const realOnFulfilled = isFn(onFulfilled) ? onFulfilled : value => value;
    const realOnRejected = isFn(onRejected) ? onRejected : reason => { throw reason };
    let p1 = new LPromise((resolve, reject) => {
      // debugger
      if (this.status === FULFILLDE) {
        queueMicrotask(() => {
          this.parse(p1, realOnFulfilled(this.value), resolve, reject)
        })
      } else if (this.status === REJECTED) {
        queueMicrotask(() => {
          this.parse(p1, realOnRejected(this.reason), resolve, reject)
        })
      } else {
        this.callbacks.push({
          onFulfilled: (value) => {
            queueMicrotask(() => {
              // 这里的 realOnFulfilled(this.value) 也可以 由 resolve 方法可得
              this.parse(p1, realOnFulfilled(value), resolve, reject)
            })
          },
          onRejected: (reason) => {
            queueMicrotask(() => {
              this.parse(p1, realOnRejected(reason), resolve, reject)
            })
          }
        })
      }
    })
    return p1
  }

  parse = (p1, result, resolve, reject) => {
    // debugger
    if (p1 === result) {
      throw new TypeError("Chaining cycle detected for promise")
    }
    try {
      debugger
      if (result instanceof LPromise) {
        result.then(resolve, reject)
      } else {
        resolve(result)
      }
    } catch (error) {
      reject(error)
    }
  }

  static resolve = (value) => {
    // if (value instanceof LPromise) {
    //   return value
    // }
    return new LPromise((resolve, reject) => {
      if (value instanceof LPromise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  static reject = (value) => {
    return new LPromise((resolve, reject) => {
      reject(value)
    })
  }

  static all = (promises) => {
    const values = []
    return new LPromise((resolve, reject) => {
      promises.forEach(p => {
        p.then(
          value => {
            values.push(value)
            // 所有都 reject
            if (values.length === promises.length) {
              resolve(values)
            }
          },
          // 但凡一个 拒绝 那么就 reject all 这个 Promise
          reason => reject(reason)
        )
      })
    })
  }

  static race = (promises) => {
    return new LPromise((resolve, reject) => {
      promises.forEach(p => {
        p.then(
          value => resolve(value),
          reason => reject(reason),
        )
      })
    })
  }
}
