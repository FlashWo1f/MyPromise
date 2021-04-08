// 精简 .then

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
        this.parse(realOnFulfilled(this.value), resolve, reject)
      } else if (this.status === REJECTED) {
        this.parse(realOnRejected(this.reason), resolve, reject)
      } else {
        this.callbacks.push({
          onFulfilled: (value) => {
            this.parse(realOnFulfilled(value), resolve, reject)
          },
          onRejected: (reason) => {
            this.parse(realOnRejected(reason), resolve, reject)
          }
        })
      }
    })
  }

  parse = (result, resolve, reject) => {
    queueMicrotask(() => {
      try {
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
}
