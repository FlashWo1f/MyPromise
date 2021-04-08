const FULFILLDE = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

function isFn(v) {
  return typeof v === 'function'
}


class LP1 {
  
  constructor(executor) {
    this.status = PENDING
    this.reason = undefined
    this.value = undefined
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
      while(this.callbacks.length) {
        const { onResolve } = this.callbacks.shift()
        onResolve(value)
      }
    }
  }

  reject = (reason) => {
    if (this.status === PENDING) {
      this.status = REJECTED
      this.reason = reason
      while(this.callbacks.length) {
        const { onReject } = this.callbacks.shift()
        onReject(reason)
      }
    }
  }

  then = (onResolved, onRejected) => {
    !isFn(onResolved) && (onResolved = v => v)
    !isFn(onRejected) && (onRejected = v => { throw v } )

    const promise2 = new LP1((resolve, reject) => {
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const result = onResolved(this.value)
            this.handleResolved(result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const result = onRejected(this.reason)
            this.handleResolved(result, resolve, reject)
          } catch (error) {
            reject(error)
          }
        })
      }

      if (this.status === FULFILLDE) {
        handleFulfilled()
      } else if (this.status === REJECTED) {
        handleRejected()
      } else {
        this.callbacks.push({
          onReject: handleRejected,
          onResolve: handleFulfilled
        })
      }
    })
    return promise2
  }

  handleResolved = (result, resolve, reject) => {
    if (result instanceof LP1) {
      result.then(resolve, reject)
    } else {
      resolve(result)
    }
  }
}