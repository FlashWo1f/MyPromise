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
}
