const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function isFn(fn) {
  return typeof fn === 'function'
}

class ZPromise {

  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.callbacks = []
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(reason)
    }
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.value = value
      this.status = FULFILLED
      for (let cbObj of this.callbacks) {
        const { onFulfilledCb } = cbObj
        onFulfilledCb(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.reason = reason
      this.status = REJECTED
      for (let cbObj of this.callbacks) {
        const { onRejectedCb } = cbObj
        onRejectedCb(reason)
      }
    }
  }

  then = (onFulfilled, onRejected) => {
    !isFn(onFulfilled) && (onFulfilled = val => val) 
    !isFn(onRejected) && (onRejected = err => { throw err })

    const promise2 = new ZPromise((resolve, reject) => {
      
    })
  }
}
