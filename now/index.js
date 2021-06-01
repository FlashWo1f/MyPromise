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
    try {
      executor(this.resolve, this.reject)
    } catch (error) {
      this.reject(error)      
    }
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
      const handleResolve = () => {
        try {
          let result = onFulfilled(this.value)
          // console.log('???', result)
          return result
        } catch (error) {
          reject(error)
        }
      }
      const handleReject = () => {
        try {
          return onRejected(this.reason)
        } catch (error) {
          reject(error)
        }
      }
      if (this.status === PENDING) {
        this.callback.push({
          onFulfilled: () => {
            queueMicrotask(handleResolve)
          },
          onRejected: () => {
            queueMicrotask(handleReject)
          },
        })
      } else if (this.status === FULFILLED) {
        queueMicrotask(() => {
          this.handleDeal(handleResolve(), resolve, reject)
        })
        // queueMicrotask(() => {
        //   resolve(handleResolve())
        // })
      } else {
        this.handleDeal(handleReject(), resolve, reject)
      }
    })
    return p2
  }

  handleDeal = (result, resolve, reject) => {
    if (result instanceof LPromise) {
      result.then(resolve, reject)
    } else {
      resolve(result)
    }
  }
}

LPromise.all = (arr = []) => {
  
}
