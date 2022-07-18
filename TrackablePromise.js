class TrackablePromise extends Promise {
  constructor(executor) {
    const notifyHandlers = []
    super((resolve, reject) => {
      return executor(resolve, reject, (status) => {
        notifyHandlers.forEach(handler => handler(status))
      })
    })

    this.notifyHandlers = notifyHandlers
  }

  notify(notifyHandler) {
    this.notifyHandlers.push(notifyHandler)
    return this
  }
}

let p = new TrackablePromise((resolve, reject, notify) => {
  function countdown(x) {
    if (x > 0) {
      notify(`${20 * x}% remaining`)
      setTimeout(() => countdown(x - 0.1), 100)
    } else {
      resolve()
    }
  }

  countdown(5)
})

p.notify((status) => console.log('progress:', status))
p.then(() => console.log('completed'))