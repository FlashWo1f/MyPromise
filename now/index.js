const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
let uid = 0


const p1 = new Promise((resolve, reject) => {
  reject('error')
}).then(res => {
    console.log(res);return 2
  }, err => { throw err })
  .then(res => {
    console.log('resolve: ',res)
  }, (err) => {
    console.log('reject', err)
  })
// console.log(p1)
// p1.then(res => console.log(res))

class LPromise {

  constructor(executor) {
    this.status = PENDING
    this.value = null
    this.reason = null
    this.uid = uid++
    this.callback = []
    executor(this.resolve, this.reject)
  }

  resolve = (value) => {
    if (this.status === PENDING) {
      this.status = FULFILLED
      this.value = value
      while(this.callback.length) {
        const { onFulfilled } = this.callback.shift()
        onFulfilled(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      while(this.callback.length) {
        const { onRejected } = this.callback.shift()
        onRejected(reason) 
      }
    }
  }

  then = (onFulfilled, onRejected) => {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (res => res)
    onRejected = typeof onFulfilled === 'function' ? onRejected : (err => { throw err })
    const p2 = new LPromise((resolve, reject) => {
      if (this.status === PENDING) {
        this.callback.push({
          onFulfilled: () => {
            queueMicrotask(() => {
              try {
                onFulfilled(this.value)
              } catch (error) {
                reject(error)
              }
            })
          },
          onRejected: () => {
            queueMicrotask(() => {
              onRejected(this.reason)
            })
          }
        })
      } else if (this.status === FULFILLED) {
        queueMicrotask(() => {
          const result = onFulfilled(this.value)
          resolve(result)
        })
      } else {
        queueMicrotask(() => {
          const result = onRejected(this.reason)
          resolve(result)
        })
      }
    })
    return p2
  }
}
